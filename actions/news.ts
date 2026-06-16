'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath } from 'next/cache';
import { NewsSchema } from '@/lib/validations';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function createArticle(data: unknown) {
  const user = await requireAuth();
  const parsed = NewsSchema.parse(data);
  const article = await prisma.newsArticle.create({
    data: {
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
    },
  });
  await logAudit({ userId: user.id!, action: 'CREATE', entity: 'NewsArticle', entityId: article.id, details: parsed });
  revalidatePath('/admin/news');
  return article;
}

export async function updateArticle(id: string, data: unknown) {
  const user = await requireAuth();
  const parsed = NewsSchema.parse(data);
  const article = await prisma.newsArticle.update({
    where: { id },
    data: {
      ...parsed,
      publishedAt: parsed.publishedAt ? new Date(parsed.publishedAt) : null,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
    },
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'NewsArticle', entityId: id, details: parsed });
  revalidatePath('/admin/news');
  return article;
}

export async function deleteArticle(id: string) {
  const user = await requireAuth();
  await prisma.newsArticle.delete({ where: { id } });
  await logAudit({ userId: user.id!, action: 'DELETE', entity: 'NewsArticle', entityId: id, details: {} });
  revalidatePath('/admin/news');
}
