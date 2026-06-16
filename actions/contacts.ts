'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { ContactStatus } from '@prisma/client';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function updateContactStatus(id: string, status: ContactStatus, notes?: string) {
  const user = await requireAuth();
  const msg = await prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      notes: notes ?? undefined,
      respondedAt: status === 'RESPONDED' ? new Date() : undefined,
    },
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'ContactMessage', entityId: id, details: { status } });
  revalidatePath('/admin/contacts');
  return msg;
}

export async function deleteContact(id: string) {
  const user = await requireAuth();
  await prisma.contactMessage.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'ContactMessage', entityId: id, details: {} });
  revalidatePath('/admin/contacts');
}
