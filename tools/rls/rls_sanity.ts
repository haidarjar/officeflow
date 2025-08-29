// INGFO: Load env dari .env.local untuk proses TSX (Node tidak otomatis). 🧪
import * as dotenv from 'dotenv';
import { resolve } from 'node:path';
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// INGFO: RLS sanity tester — jalankan alur nyata (login → buat tiket → approve → soft delete). 🧪
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type DeptRow = { id: string; name: string }; // INGFO: tipe minimal untuk departemen. 🧱

function env(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`${name} is missing or empty`);
  }
  return v.trim();
}

const URL = env('NEXT_PUBLIC_SUPABASE_URL');
const ANON = env('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const ADMIN_EMAIL = env('TEST_ADMIN_EMAIL');
const ADMIN_PASS = env('TEST_ADMIN_PASSWORD');
const HEAD_EMAIL = env('TEST_HEAD_EMAIL');
const HEAD_PASS = env('TEST_HEAD_PASSWORD');
const EMP_EMAIL = env('TEST_EMP_EMAIL');
const EMP_PASS = env('TEST_EMP_PASSWORD');

// Login helper (tetap)
async function login(email: string, password: string) {
  const supabase = createClient(URL, ANON, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Login gagal untuk ${email}: ${error.message}`);
  return { supabase, user: data.user! };
}

// INGFO: Ambil id Department "Engineering" secara type-safe. 🧱
async function get_engineering_id(client: SupabaseClient) {
  const { data, error } = await client
    .from('departments') // ❌ jangan pakai generic di sini
    .select('id')
    .eq('name', 'Engineering')
    .maybeSingle<Pick<DeptRow, 'id'>>(); // ✅ tipe aman di sini

  if (error || !data) throw new Error('Dept Engineering tidak ditemukan. Pastikan seed ada.');
  return data.id; // ✅ sekarang TS tahu ini string
}

async function main() {
  console.log('\n=== RLS Sanity Test Start ===\n');

  const admin = await login(ADMIN_EMAIL, ADMIN_PASS);
  console.log('  role(admin) =', (await admin.supabase.rpc('get_my_role')).data);
  console.log('✓ Admin login');
  const head = await login(HEAD_EMAIL, HEAD_PASS);
  console.log('  role(head)  =', (await head.supabase.rpc('get_my_role')).data);
  console.log('✓ Head login');
  const emp = await login(EMP_EMAIL, EMP_PASS);
  console.log('  role(emp)   =', (await emp.supabase.rpc('get_my_role')).data);
  console.log('✓ Employee login');

  const engineering_id = await get_engineering_id(admin.supabase);
  console.log('✓ Dept Engineering OK →', engineering_id);

  const title = `RLS Ticket by Employee ${Date.now()}`;

  // Employee buat tiket
  const { data: empTicket, error: empCreateErr } = await emp.supabase
    .from('tickets')
    .insert([{ title, department_id: engineering_id, created_by: emp.user.id }])
    .select('id, department_id, created_by, status, deleted_at')
    .single();

  if (empCreateErr) throw new Error('Employee gagal membuat ticket: ' + empCreateErr.message);
  console.log('✓ Employee create ticket →', empTicket.id);

  // Head approve
  const { error: approveErr } = await head.supabase
    .from('approvals')
    .insert([
      { ticket_id: empTicket.id, approver_id: head.user.id, decision: 'approved', note: 'OK' },
    ]);

  if (approveErr) throw new Error('Head gagal approval: ' + approveErr.message);
  console.log('✓ Head approve ticket');

  // Uji admin bisa update approvals langsung (tanpa trigger)
  const { error: updApprovalErr } = await admin.supabase
    .from('approvals')
    .update({ deleted_at: new Date().toISOString() })
    .eq('ticket_id', empTicket.id);

  console.log('admin direct approvals update →', updApprovalErr?.message ?? 'OK');

  // INGFO: Employee coba delete (harus ditolak)
  // PostgREST bisa balas 204 tanpa error saat RLS block, jadi cek jumlah row terpengaruh. 🧪
  const { data: empDelData, error: empDelErr } = await emp.supabase
    .from('tickets')
    .delete()
    .eq('id', empTicket.id)
    .select('id'); // ← minta representasi row yang terhapus

  if (empDelErr) {
    console.log('✓ Employee delete ditolak (expected) →', empDelErr.message);
  } else if (!empDelData || empDelData.length === 0) {
    console.log('✓ Employee delete tidak mempengaruhi baris (expected: RLS block)');
  } else {
    throw new Error('Employee berhasil menghapus ticket (TIDAK BOLEH).');
  }

  // Admin delete (soft)
  const { error: adminDeleteErr } = await admin.supabase
    .from('tickets')
    .delete()
    .eq('id', empTicket.id);
  if (adminDeleteErr) throw new Error('Admin gagal delete (soft): ' + adminDeleteErr.message);
  console.log('✓ Admin delete (soft) OK');

  // Employee tidak boleh melihat tiket yg sudah soft delete
  const { data: empSee, error: empSeeErr } = await emp.supabase
    .from('tickets')
    .select('id')
    .eq('id', empTicket.id);
  if (empSeeErr) throw new Error('Employee SELECT error: ' + empSeeErr.message);
  if (empSee && empSee.length > 0)
    throw new Error('Employee masih bisa melihat ticket yang di-soft delete (tidak boleh).');
  console.log('✓ Employee tidak melihat ticket yang di-soft delete');

  console.log('\n🎉 ALL GREEN — RLS policies bekerja sesuai ekspektasi.\n');
}

main().catch((e) => {
  console.error('\n❌ RLS Sanity Test FAILED:', e.message, '\n');
  process.exit(1);
});
