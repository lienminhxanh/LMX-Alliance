'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { PartnerSchema } from '@/lib/validations';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function createPartner(data: unknown) {
  const user = await requireAuth();
  const parsed = PartnerSchema.parse(data);
  const partner = await prisma.partner.create({ data: parsed });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'Partner', entityId: partner.id, details: parsed });
  revalidatePath('/admin/partners');
  return partner;
}

export async function updatePartner(id: string, data: unknown) {
  const user = await requireAuth();
  const parsed = PartnerSchema.parse(data);
  const partner = await prisma.partner.update({ where: { id }, data: parsed });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'Partner', entityId: id, details: parsed });
  revalidatePath('/admin/partners');
  return partner;
}

export async function deletePartner(id: string) {
  const user = await requireAuth();
  await prisma.partner.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'Partner', entityId: id, details: {} });
  revalidatePath('/admin/partners');
}
