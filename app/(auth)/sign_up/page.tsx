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
  full_name: z.string().min(1, 'Nama wajib'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Min 8 karakter'),
});

export default function SignUpPage() {
  const { supabase, session } = use_auth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  // INGFO: Kalau sudah login, arahkan ke dashboard. 🛡️
  useEffect(() => {
    if (session) router.replace('/dashboard');
  }, [session, router]);

  async function on_submit(v: z.infer<typeof schema>) {
    setLoading(true);
    const redirectTo = `${location.origin}/auth/callback`; // INGFO: auto-login via PKCE. 🔗
    const { data, error } = await supabase.auth.signUp({
      email: v.email,
      password: v.password,
      options: {
        data: { full_name: v.full_name }, // INGFO: supaya trigger isi profiles.full_name. 🧩
        emailRedirectTo: redirectTo,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.user?.aud === 'authenticated') {
      toast.success('Akun dibuat. Kamu sudah login.');
      router.replace('/dashboard');
    } else {
      toast.success('Cek email untuk konfirmasi.');
    }
  }

  async function on_google() {
    const redirectTo = `${location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) toast.error(error.message);
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-5xl grid gap-8 md:grid-cols-2">
        {/* Kiri: copy/benefit */}
        <section className="rounded-2xl border shadow-sm p-6 bg-card hidden md:block">
          <h2 className="text-xl font-semibold mb-2">Kenapa OfficeFlow?</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Pelacakan tiket & approval yang rapi.</li>
            <li>Role-based access (employee, head, admin).</li>
            <li>Terintegrasi Supabase & siap produksi.</li>
          </ul>
          <div className="mt-6 rounded-lg border p-4 bg-background">
            <p className="text-sm">
              Sudah punya akun?{' '}
              <Link className="underline" href="/sign_in">
                Masuk di sini
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Kanan: form */}
        <section className="rounded-2xl border shadow-sm p-6 space-y-6 bg-card">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">Daftar</h1>
            <p className="text-sm text-muted-foreground">Buat akun baru untuk memulai.</p>
          </header>

          <form className="space-y-3" onSubmit={form.handleSubmit(on_submit)}>
            <div className="space-y-1">
              <label className="text-sm">Nama Lengkap</label>
              <input className="w-full rounded-md border p-2" {...form.register('full_name')} />
              {form.formState.errors.full_name && (
                <p className="text-sm text-red-600">{form.formState.errors.full_name.message}</p>
              )}
            </div>
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
              {loading ? 'Memproses…' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            atau
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google only */}
          <button onClick={on_google} className="w-full rounded-md border p-2 cursor-pointer" type="button">
            Daftar dengan Google
          </button>

          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/sign_in" className="underline">
              Masuk
            </Link>
          </p>
        </section>
      </div>

      {/* Footer kecil */}
      <p className="sr-only">OfficeFlow Sign Up</p>
    </main>
  );
}
