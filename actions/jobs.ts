'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { JobSchema } from '@/lib/validations';
import { ApplicationStatus } from '@prisma/client';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function createJob(data: unknown) {
  const user = await requireAuth();
  const parsed = JobSchema.parse(data);
  const job = await prisma.jobPosting.create({ data: parsed });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'JobPosting', entityId: job.id, details: parsed });
  revalidatePath('/admin/jobs');
  return job;
}

export async function updateJob(id: string, data: unknown) {
  const user = await requireAuth();
  const parsed = JobSchema.parse(data);
  const job = await prisma.jobPosting.update({ where: { id }, data: parsed });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'JobPosting', entityId: id, details: parsed });
  revalidatePath('/admin/jobs');
  return job;
}

export async function deleteJob(id: string) {
  const user = await requireAuth();
  await prisma.jobPosting.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'JobPosting', entityId: id, details: {} });
  revalidatePath('/admin/jobs');
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const user = await requireAuth();
  const app = await prisma.jobApplication.update({ where: { id }, data: { status } });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'JobApplication', entityId: id, details: { status } });
  return app;
}
