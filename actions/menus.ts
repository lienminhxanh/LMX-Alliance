'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath, revalidateTag } from 'next/cache';

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  if ((session.user as any).role !== 'SUPER_ADMIN') throw new Error('Forbidden');
  return session.user;
}

export async function toggleMenuItemVisibility(key: string, isVisible: boolean) {
  const user = await requireSuperAdmin();
  await prisma.menuItemVisibility.upsert({
    where: { key },
    create: { key, isVisible, updatedById: user.id },
    update: { isVisible, updatedById: user.id },
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'MenuItemVisibility', entityId: key, details: { isVisible } });
  revalidatePath('/admin/menus');
  revalidateTag('menu-visibility', 'max');
}
