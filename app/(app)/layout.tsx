'use client';

import TopBar from '@/components/app_shell/top_bar';
import Sidebar from '@/components/app_shell/sidebar';
import { use_auth } from '@/components/providers/auth_provider';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// INGFO: Layout area aplikasi—wajib login (UI guard). 🛡️
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { session } = use_auth();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, set_checked] = useState(false);

  useEffect(() => {
    // INGFO: Tunggu satu tick agar AuthProvider resolve session. ⏳
    if (session === undefined) return;
    if (!session) {
      // Biarkan /sign_in & /sign_up di luar guard.
      if (!pathname.startsWith('/sign_')) router.replace('/sign_in');
    } else {
      set_checked(true);
    }
  }, [session, router, pathname]);

  if (!session) {
    return (
      <div className="min-h-dvh grid place-items-center text-sm text-muted-foreground">Memuat…</div>
    );
  }

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr]">
      <TopBar />
      <div className="grid grid-cols-[14rem_1fr]">
        <Sidebar />
        <main className="p-6">{checked ? children : null}</main>
      </div>
    </div>
  );
}
