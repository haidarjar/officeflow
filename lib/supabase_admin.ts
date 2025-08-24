/** @server-only */
// INGFO: Supabase client untuk **server** (API routes / server actions) – gunakan SERVICE ROLE KEY. 🔒
import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!; // sama base URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!; // INGFO: JANGAN di-import di client. 🚫

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
    global: { headers: { 'X-Client-Info': 'officeflow-admin' } },
  });
}
