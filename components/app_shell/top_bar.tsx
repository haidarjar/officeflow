'use client';

import Link from 'next/link';
import { use_auth } from '@/components/providers/auth_provider';
import { useRouter } from 'next/navigation';

// INGFO: Top bar—brand, role chip, logout. 🧭
export default function TopBar() {
  const { profile, supabase } = use_auth();
  const router = useRouter();

  async function on_logout() {
    await supabase.auth.signOut();
    router.replace('/sign_in');
  }

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <Link href="/dashboard" className="font-semibold">
        OfficeFlow
      </Link>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
          {profile?.role ?? '-'}
        </span>
        <button onClick={on_logout} className="border rounded-md px-3 py-1 cursor-pointer">
          Logout
        </button>
      </div>
    </header>
  );
}
