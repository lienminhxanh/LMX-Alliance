'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { ProjectSchema } from '@/lib/validations';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function createProject(data: unknown) {
  const user = await requireAuth();
  const parsed = ProjectSchema.parse(data);
  const project = await prisma.project.create({ data: { ...parsed, images: parsed.images ?? [] } });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'Project', entityId: project.id, details: parsed });
  revalidatePath('/admin/projects');
  return project;
}

export async function updateProject(id: string, data: unknown) {
  const user = await requireAuth();
  const parsed = ProjectSchema.parse(data);
  const project = await prisma.project.update({ where: { id }, data: { ...parsed, images: parsed.images ?? [] } });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'Project', entityId: id, details: parsed });
  revalidatePath('/admin/projects');
  return project;
}

export async function deleteProject(id: string) {
  const user = await requireAuth();
  await prisma.project.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'Project', entityId: id, details: {} });
  revalidatePath('/admin/projects');
}
