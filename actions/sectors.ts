'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { SectorSchema } from '@/lib/validations';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function createSector(data: unknown) {
  const user = await requireAuth();
  const parsed = SectorSchema.parse(data);
  const sector = await prisma.businessSector.create({ data: { ...parsed, gallery: parsed.gallery ?? [] } });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'BusinessSector', entityId: sector.id, details: parsed });
  revalidatePath('/admin/sectors');
  return sector;
}

export async function updateSector(id: string, data: unknown) {
  const user = await requireAuth();
  const parsed = SectorSchema.parse(data);
  const sector = await prisma.businessSector.update({ where: { id }, data: { ...parsed, gallery: parsed.gallery ?? [] } });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'BusinessSector', entityId: id, details: parsed });
  revalidatePath('/admin/sectors');
  revalidatePath('/admin/sectors/' + id);
  return sector;
}

export async function deleteSector(id: string) {
  const user = await requireAuth();
  await prisma.businessSector.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'BusinessSector', entityId: id, details: {} });
  revalidatePath('/admin/sectors');
}

export async function updateSectorOrder(ids: string[]) {
  await requireAuth();
  await Promise.all(ids.map((id, idx) => prisma.businessSector.update({ where: { id }, data: { orderIndex: idx } })));
  revalidatePath('/admin/sectors');
}
