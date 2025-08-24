// INGFO: Supabase client untuk kode **client-side** (browser) – pakai anon key & RLS yang jaga data. 🧭
import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient() {
  // INGFO: ENV public wajib ada; diambil dari .env.local → NEXT_PUBLIC_* 🧩
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // INGFO: Client browser; session tersimpan di storage default; cocok untuk operasi user non-privileged. 👤
  return createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: { headers: { 'X-Client-Info': 'officeflow-client' } },
  });
}
