import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { prisma } from '@/lib/prisma';

const locales = ['vi', 'en', 'zh'];

const staticPaths = [
  '',           // homepage
  '/about',
  '/contact',
  '/careers',
  '/news',
  '/business-segments',
  '/shareholder-relations',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages × 3 locales
  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic news articles
  const articles = await prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED' },
    select: { slugVI: true, slugEN: true, slugZH: true, updatedAt: true },
  });

  for (const a of articles) {
    const slugs: Record<string, string | null> = { vi: a.slugVI, en: a.slugEN, zh: a.slugZH };
    for (const [locale, slug] of Object.entries(slugs)) {
      if (!slug) continue;
      entries.push({
        url: `${SITE_URL}/${locale}/news/${slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Dynamic business sectors
  const sectors = await prisma.businessSector.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  for (const s of sectors) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/business-segments/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
