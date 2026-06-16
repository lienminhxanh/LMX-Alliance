'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { LeaderSchema } from '@/lib/validations';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function createLeader(data: unknown) {
  const user = await requireAuth();
  const parsed = LeaderSchema.parse(data);
  const leader = await prisma.leader.create({ data: parsed });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'Leader', entityId: leader.id, details: parsed });
  revalidatePath('/admin/leadership');
  return leader;
}

export async function updateLeader(id: string, data: unknown) {
  const user = await requireAuth();
  const parsed = LeaderSchema.parse(data);
  const leader = await prisma.leader.update({ where: { id }, data: parsed });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'Leader', entityId: id, details: parsed });
  revalidatePath('/admin/leadership');
  return leader;
}

export async function deleteLeader(id: string) {
  const user = await requireAuth();
  await prisma.leader.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'Leader', entityId: id, details: {} });
  revalidatePath('/admin/leadership');
}

export async function updateLeaderOrder(ids: string[]) {
  await requireAuth();
  await Promise.all(ids.map((id, idx) => prisma.leader.update({ where: { id }, data: { orderIndex: idx } })));
  revalidatePath('/admin/leadership');
}
