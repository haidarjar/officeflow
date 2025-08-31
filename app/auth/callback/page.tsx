'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { use_effect_once } from '@/lib/use_effect_once';
import { use_auth } from '@/components/providers/auth_provider';

export default function AuthCallbackPage() {
  const { supabase } = use_auth();
  const router = useRouter();
  const params = useSearchParams();

  use_effect_once(() => {
    (async () => {
      const code = params.get('code');
      if (!code) {
        toast.error('Kode OAuth tidak ditemukan');
        router.replace('/sign_in');
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        toast.error(error.message);
        router.replace('/sign_in');
        return;
      }
      toast.success('Autentikasi berhasil');
      router.replace('/dashboard');
    })();
  });

  return (
    <main className="min-h-dvh flex items-center justify-center">
      <p>Memproses autentikasi…</p>
    </main>
  );
}
