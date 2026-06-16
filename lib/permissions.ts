import { UserRole } from '@prisma/client';

type Module =
  | 'settings'
  | 'homepage'
  | 'sectors'
  | 'news'
  | 'jobs'
  | 'investor-relations'
  | 'leadership'
  | 'partners'
  | 'projects'
  | 'media'
  | 'contacts'
  | 'users'
  | 'audit-logs';

const PERMISSIONS: Record<UserRole, Module[]> = {
  SUPER_ADMIN: [
    'settings', 'homepage', 'sectors', 'news', 'jobs',
    'investor-relations', 'leadership', 'partners', 'projects',
    'media', 'contacts', 'users', 'audit-logs',
  ],
  CONTENT_MANAGER: ['sectors', 'news', 'jobs', 'media'],
  IR_MANAGER: ['investor-relations', 'media'],
  VIEWER: [],
};

export function canAccess(role: UserRole, module: Module): boolean {
  return PERMISSIONS[role]?.includes(module) ?? false;
}

export function canWrite(role: UserRole): boolean {
  return role !== 'VIEWER';
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === 'SUPER_ADMIN';
}
