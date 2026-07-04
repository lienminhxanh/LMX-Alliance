import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export const getCachedCompanySettings = unstable_cache(
  async () => prisma.companySettings.findFirst(),
  ['company-settings'],
  { revalidate: 3600, tags: ['company-settings'] }
);

export const getCachedNewsList = unstable_cache(
  async (category: string | undefined, page: number, take: number) => {
    const skip = (page - 1) * take;
    const where = {
      status: 'PUBLISHED' as const,
      ...(category ? { category: category as any } : {}),
    };
    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({ where, orderBy: { publishedAt: 'desc' }, take, skip }),
      prisma.newsArticle.count({ where }),
    ]);
    return { articles, total };
  },
  ['news-list'],
  { revalidate: 900, tags: ['news'] }
);
