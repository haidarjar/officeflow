'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { use_auth } from '@/components/providers/auth_provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, profile, sign_out } = use_auth();
  const router = useRouter();

  // INGFO: Guard client-side — bila tidak login, ke /sign_in. 🛡️
  useEffect(() => {
    if (session === null) router.replace('/sign_in');
  }, [session, router]);

  return (
    <div className="min-h-dvh grid grid-rows-[auto,1fr]">
      <header className="border-b py-3 px-6 flex items-center justify-between">
        <div className="font-semibold">OfficeFlow</div>
        <div className="text-sm flex items-center gap-3">
          <span>{profile?.full_name ?? 'User'}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
            {profile?.role ?? '-'}
          </span>
          <button onClick={sign_out} className="rounded-md border px-3 py-1 cursor-pointer">
            Logout
          </button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
