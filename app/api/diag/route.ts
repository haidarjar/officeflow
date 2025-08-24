/**
 * Simple connectivity check for Supabase (server-side).
 * - Memastikan ENV terpasang
 * - Menguji akses admin read-only lewat auth.admin.listUsers
 */

import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase_admin'; // <- snake_case

export async function GET() {
  try {
    // 1) pastikan ENV ada
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ ok: false, error: 'Missing Supabase ENV' }, { status: 500 });
    }

    // 2) panggil Admin API (read-only)
    const sb = createSupabaseAdmin();
    const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1 });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // INGFO: Bila project masih kosong, sampleUsers mungkin 0 – itu normal. ✅
    return NextResponse.json({ ok: true, sampleUsers: data?.users?.length ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
