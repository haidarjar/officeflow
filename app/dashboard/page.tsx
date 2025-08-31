'use client';

import { use_auth } from '@/components/providers/auth_provider';

export default function DashboardHome() {
  const { profile } = use_auth();
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p>Selamat datang, {profile?.full_name ?? '—'}!</p>
    </div>
  );
}
