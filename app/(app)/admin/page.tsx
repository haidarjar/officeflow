'use client';

import { use_auth } from '@/components/providers/auth_provider';
import { is_admin } from '@/lib/rbac';
import { useRouter } from 'next/navigation';

// INGFO: Gate—Admin only. 🛂
export default function AdminPage() {
  const { profile } = use_auth();
  const router = useRouter();
  if (!is_admin(profile?.role)) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold">Admin</h1>
      <p className="text-sm text-muted-foreground">
        Triage, assignment, dan pengelolaan global akan diisi Step 11.
      </p>
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        Placeholder admin area siap.
      </div>
    </section>
  );
}
