import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

export const getCompanySettings = unstable_cache(
  async () => prisma.companySettings.findFirst(),
  ['company-settings'],
  { revalidate: 3600, tags: ['settings'] }
);

export const getActiveBusinessSectors = unstable_cache(
  async () => prisma.businessSector.findMany({ where: { status: 'PUBLISHED' }, orderBy: { orderIndex: 'asc' } }),
  ['business-sectors'],
  { revalidate: 3600, tags: ['sectors'] }
);

export const getLatestNews = unstable_cache(
  async (take = 3) => prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take,
  }),
  ['latest-news'],
  { revalidate: 900, tags: ['news'] }
);

export const getAllPublishedNews = unstable_cache(
  async () => prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  }),
  ['all-news'],
  { revalidate: 900, tags: ['news'] }
);

export const getLeaders = unstable_cache(
  async () => prisma.leader.findMany({ orderBy: { orderIndex: 'asc' }, take: 4 }),
  ['leaders'],
  { revalidate: 3600, tags: ['leaders'] }
);

export const getActivePartners = unstable_cache(
  async () => prisma.partner.findMany({ orderBy: { orderIndex: 'asc' } }),
  ['partners'],
  { revalidate: 3600, tags: ['partners'] }
);

export const getOpenJobPostings = unstable_cache(
  async () => prisma.jobPosting.findMany({ where: { status: 'OPEN' }, orderBy: { createdAt: 'desc' } }),
  ['job-postings'],
  { revalidate: 1800, tags: ['jobs'] }
);
