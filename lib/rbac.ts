// INGFO: Util RBAC sederhana untuk UI (bukan security; keamanan tetap RLS). 🧠
export const is_admin = (role?: string) => role === 'admin';
export const is_head = (role?: string) => role === 'head';
export const is_employee = (role?: string) => role === 'employee';

// INGFO: Cek izin akses halaman (UI only). 🔐
export function can_access(page: 'approvals' | 'admin', role?: string) {
  if (page === 'approvals') return is_head(role) || is_admin(role);
  if (page === 'admin') return is_admin(role);
  return true;
}
