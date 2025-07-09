export const ADMIN_ROLES = ['admin', 'superadmin'] as const;
export type AdminRole = typeof ADMIN_ROLES[number];

export function isAdminRole(role?: string | null): role is AdminRole {
  if (!role) return false;
  return ADMIN_ROLES.includes(role as AdminRole);
}

export function isSuperAdmin(role?: string | null): boolean {
  return role === 'superadmin';
}
