'use client';

import { use_auth } from '@/components/providers/auth_provider';
import { can_access } from '@/lib/rbac';
import { useRouter } from 'next/navigation';

// INGFO: Gate sederhana—Head/Admin saja. 🚧
export default function ApprovalsPage() {
  const { profile } = use_auth();
  const router = useRouter();
  const role = profile?.role;

  if (!can_access('approvals', role)) {
    router.replace('/dashboard');
    return null;
  }

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold">Approvals</h1>
      <p className="text-sm text-muted-foreground">Halaman persetujuan untuk Head/Admin.</p>
      <div className="rounded-md border p-6 text-sm text-muted-foreground">
        Alur approve/reject akan diisi pada Step 10.
      </div>
    </section>
  );
}
