'use client';

import { use_auth } from '@/components/providers/auth_provider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Min 8 karakter'),
});

export default function SignInPage() {
  const { supabase, session } = use_auth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  // INGFO: Kalau sudah login, arahkan ke dashboard. 🛡️
  useEffect(() => {
    if (session) router.replace('/dashboard');
  }, [session, router]);

  async function on_password_signin(v: z.infer<typeof schema>) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: v.email,
      password: v.password,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Berhasil login');
    router.replace('/dashboard');
  }

  async function on_magic_link() {
    const email = form.getValues('email');
    if (!email) return toast.error('Isi email dulu ya');
    const redirectTo = `${location.origin}/auth/callback`; // INGFO: PKCE callback. 🔗
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) return toast.error(error.message);
    toast.success('Magic link terkirim! Cek emailmu.');
  }

  async function on_google() {
    const redirectTo = `${location.origin}/auth/callback`; // INGFO: akan exchange code → session. 🔄
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) toast.error(error.message);
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border shadow-sm p-6 space-y-6 bg-card">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">Masuk ke OfficeFlow</h1>
            <p className="text-sm text-muted-foreground">
              Gunakan email & password, Magic Link, atau Google.
            </p>
          </header>

          {/* Form Password */}
          <form className="space-y-3" onSubmit={form.handleSubmit(on_password_signin)}>
            <div className="space-y-1">
              <label className="text-sm">Email</label>
              <input
                className="w-full rounded-md border p-2"
                type="email"
                placeholder="nama@contoh.com"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm">Password</label>
              <input
                className="w-full rounded-md border p-2"
                type="password"
                placeholder="••••••••"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full rounded-md bg-black text-white p-2 cursor-pointer"
              type="submit"
            >
              {loading ? 'Memproses…' : 'Sign In'}
            </button>
          </form>

          {/* Magic Link */}
          <button
            onClick={on_magic_link}
            className="w-full rounded-md border p-2 cursor-pointer"
            type="button"
          >
            Kirim Magic Link ✉️
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            atau
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google only */}
          <button onClick={on_google} className="w-full rounded-md border p-2 cursor-pointer" type="button">
            Masuk dengan Google
          </button>

          <p className="text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/sign_up" className="underline">
              Daftar
            </Link>
          </p>
        </div>

        {/* Footer kecil */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Dengan masuk, kamu setuju pada ketentuan penggunaan OfficeFlow.
        </p>
      </div>
    </main>
  );
}
