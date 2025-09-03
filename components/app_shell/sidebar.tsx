'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use_auth } from '@/components/providers/auth_provider';
import { is_admin, is_head } from '@/lib/rbac';

// INGFO: Sidebar dengan menu kondisional sesuai role. 📚
export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = use_auth();
  const role = profile?.role;

  const item = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={`block rounded-md px-3 py-2 cursor-pointer ${
          active ? 'bg-muted font-medium' : 'hover:bg-muted/70'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-56 border-r bg-card p-3">
      <nav className="space-y-1">
        {item('/dashboard', 'Dashboard')}
        {item('/tickets', 'Tickets')}
        {(is_head(role) || is_admin(role)) && item('/approvals', 'Approvals')}
        {is_admin(role) && item('/admin', 'Admin')}
      </nav>
    </aside>
  );
}
