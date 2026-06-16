'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { CompanySettingsSchema } from '@/lib/validations';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function upsertCompanySettings(data: unknown) {
  const user = await requireAuth();
  const parsed = CompanySettingsSchema.parse(data);
  const settings = await prisma.companySettings.upsert({
    where: { id: 'singleton' },
    update: parsed,
    create: { id: 'singleton', ...parsed },
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'CompanySettings', entityId: 'singleton', details: parsed });
  revalidatePath('/admin/settings');
  return settings;
}

export async function upsertHomePage(data: { heroTitleVI: string; heroTitleEN: string; heroTitleZH: string; heroDescVI: string; heroDescEN: string; heroDescZH: string; heroCTA: string; heroImage: string }) {
  const user = await requireAuth();
  const homePage = await prisma.homePage.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'HomePage', entityId: 'singleton', details: data });
  revalidatePath('/admin/homepage/hero');
  return homePage;
}

export async function upsertStatistic(data: { id?: string; valueVI: string; valueEN: string; valueZH: string; labelVI: string; labelEN: string; labelZH: string; orderIndex: number }) {
  const user = await requireAuth();
  if (data.id) {
    const stat = await prisma.statistic.update({ where: { id: data.id }, data });
    await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'Statistic', entityId: stat.id, details: data });
    revalidatePath('/admin/homepage/statistics');
    return stat;
  }
  const { id: _, ...rest } = data;
  const stat = await prisma.statistic.create({ data: rest });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'Statistic', entityId: stat.id, details: data });
  revalidatePath('/admin/homepage/statistics');
  return stat;
}

export async function deleteStatistic(id: string) {
  const user = await requireAuth();
  await prisma.statistic.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'Statistic', entityId: id, details: {} });
  revalidatePath('/admin/homepage/statistics');
}
