'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// INGFO: Client Supabase untuk browser (persist session + PKCE/OAuth). �
export function create_browser_client(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, {
    auth: {
      persistSession: true, // INGFO: simpan session di localStorage. 💾
      flowType: 'pkce', // INGFO: OAuth modern (wajib untuk /auth/callback). 🔄
      detectSessionInUrl: true, // INGFO: tangkap fragment URL saat kembali dari OAuth. 🌐
    },
  });
}
