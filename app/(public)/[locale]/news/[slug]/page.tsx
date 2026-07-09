import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import { buildMeta, SITE_URL } from '@/lib/seo';
import Image from 'next/image';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    select: { slugVI: true, slugEN: true, slugZH: true },
  });
  return articles.flatMap((a) =>
    ([['vi', a.slugVI], ['en', a.slugEN], ['zh', a.slugZH]] as const)
      .filter(([, slug]) => !!slug)
      .map(([locale, slug]) => ({ locale, slug: slug as string }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params;
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
  const slugField = `slug${L}` as 'slugVI' | 'slugEN' | 'slugZH';

  const article = await prisma.newsArticle.findFirst({
    where: { [slugField]: slug, status: 'PUBLISHED' },
    select: {
      titleVI: true, titleEN: true, titleZH: true,
      summaryVI: true, summaryEN: true, summaryZH: true,
      slugVI: true, slugEN: true, slugZH: true,
      thumbnail: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  if (!article) return {};

  const title = (article as any)[`title${L}`] as string;
  const description = ((article as any)[`summary${L}`] as string | null)
    ?? title;

  return buildMeta({
    locale,
    title,
    description,
    path: `/${locale}/news/${slug}`,
    alternates: {
      vi: article.slugVI ? `/vi/news/${article.slugVI}` : `/vi/news`,
      en: article.slugEN ? `/en/news/${article.slugEN}` : `/en/news`,
      zh: article.slugZH ? `/zh/news/${article.slugZH}` : `/zh/news`,
    },
    image: article.thumbnail ?? undefined,
    type: 'article',
  });
}

const categoryLabel: Record<string, Record<string, string>> = {
  COMPANY_NEWS:       { vi: 'Tin công ty',       en: 'Company News',        zh: '公司新闻' },
  INVESTOR_RELATIONS: { vi: 'Quan hệ cổ đông',   en: 'Shareholder Relations', zh: '股东关系' },
  SUSTAINABILITY:     { vi: 'Phát triển bền vững', en: 'Sustainability',     zh: '可持续发展' },
  RECRUITMENT:        { vi: 'Tuyển dụng',         en: 'Recruitment',         zh: '招聘' },
};

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const slugField = `slug${L}` as 'slugVI' | 'slugEN' | 'slugZH';

  // Primary lookup by current locale's slug field
  let article = await prisma.newsArticle.findFirst({
    where: { [slugField]: slug, status: 'PUBLISHED' },
    select: {
      id: true,
      titleVI: true, titleEN: true, titleZH: true,
      contentVI: true, contentEN: true, contentZH: true,
      summaryVI: true, summaryEN: true, summaryZH: true,
      thumbnail: true,
      author: true,
      category: true,
      publishedAt: true,
      updatedAt: true,
      slugVI: true, slugEN: true, slugZH: true,
      status: true,
    },
  });

  // Cross-locale fallback: user switched language via header, slug belongs to another locale
  // Find article by any slug field, then redirect to the correct slug for current locale
  if (!article) {
    const otherFields = (['slugVI', 'slugEN', 'slugZH'] as const).filter(f => f !== slugField);
    for (const field of otherFields) {
      const found = await prisma.newsArticle.findFirst({
        where: { [field]: slug, status: 'PUBLISHED' },
        select: {
          slugVI: true, slugEN: true, slugZH: true,
        },
      });
      if (found) {
        const correctSlug = (found as any)[slugField] as string | null;
        if (correctSlug) redirect(`/${locale}/news/${correctSlug}`);
        break;
      }
    }
    notFound();
  }

  const title   = (article as any)[`title${L}`];
  const content = (article as any)[`content${L}`];
  const summary = (article as any)[`summary${L}`];
  const catLabel = categoryLabel[article.category]?.[locale] ?? article.category;

  // Recent articles for sidebar
  const related = await prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED', category: article.category, id: { not: article.id } },
    orderBy: { publishedAt: 'desc' },
    take: 4,
  });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: summary ?? '',
    datePublished: article.publishedAt?.toISOString() ?? new Date().toISOString(),
    dateModified: article.updatedAt.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'LMX Alliance',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    image: article.thumbnail ? [article.thumbnail] : [],
    url: `${SITE_URL}/${locale}/news/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden text-white py-16" style={{ background: 'linear-gradient(135deg, #0f172a 0%, var(--color-primary-dark) 100%)' }}>
        <div className="container-max">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: '#defbbc' }}
          >
            <ArrowLeft size={14} />
            {locale === 'vi' ? 'Quay lại tin tức' : locale === 'en' ? 'Back to News' : '返回新闻'}
          </Link>

          {/* Category badge */}
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 mb-4 uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#78d750', borderRadius: '2px' }}
          >
            {catLabel}
          </span>

          <h1 className="text-white max-w-3xl" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', lineHeight: 1.3 }}>
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm" style={{ color: '#defbbc' }}>
            {article.publishedAt && (
              <span className="flex items-center gap-1.5"><Calendar size={13} /> {formatDate(article.publishedAt)}</span>
            )}
            <span className="flex items-center gap-1.5"><User size={13} /> {article.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Main article */}
            <article className="lg:col-span-3">
              {/* Lead / summary */}
              <p className="text-base leading-relaxed mb-8 font-medium" style={{ color: '#374151', borderLeft: '3px solid #8ec63f', paddingLeft: '1rem' }}>
                {summary}
              </p>

              {/* Cover image */}
              {article.thumbnail && (
                <figure className="mb-8 relative w-full" style={{ height: '480px', maxHeight: '50vh' }}>
                  <Image
                    src={article.thumbnail}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                    style={{ borderRadius: '4px' }}
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </figure>
              )}

              {/* Body */}
              <div className="article-body prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Meta card */}
                <div className="p-5 border border-[#defbbc]" style={{ borderRadius: '4px' }}>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-3">
                    {locale === 'vi' ? 'Thông tin bài viết' : locale === 'en' ? 'Article Info' : '文章信息'}
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <User size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <div>
                        <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Tác giả' : locale === 'en' ? 'Author' : '作者'}</p>
                        <p className="font-medium" style={{ color: 'var(--color-primary-dark)' }}>{article.author}</p>
                      </div>
                    </div>
                    {article.publishedAt && (
                      <div className="flex items-start gap-2">
                        <Calendar size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                        <div>
                          <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Ngày đăng' : locale === 'en' ? 'Published' : '发布日期'}</p>
                          <p className="font-medium" style={{ color: 'var(--color-primary-dark)' }}>{formatDate(article.publishedAt)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Tag size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <div>
                        <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Chuyên mục' : locale === 'en' ? 'Category' : '分类'}</p>
                        <p className="font-medium" style={{ color: 'var(--color-primary-dark)' }}>{catLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related articles */}
                {related.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-3">
                      {locale === 'vi' ? 'Bài viết liên quan' : locale === 'en' ? 'Related Articles' : '相关文章'}
                    </p>
                    <div className="space-y-3">
                      {related.map((a) => {
                        const aTitle = (a as any)[`title${L}`];
                        const aSlug  = (a as any)[`slug${L}`];
                        return (
                          <Link
                            key={a.id}
                            href={`/${locale}/news/${aSlug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              {a.thumbnail ? (
                                <div className="w-14 h-14 relative flex-shrink-0" style={{ borderRadius: '2px', overflow: 'hidden' }}>
                                  <Image
                                    src={a.thumbnail}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 flex-shrink-0" style={{ background: '#f8fbf2', borderRadius: '2px' }} />
                              )}
                              <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#8ec63f] transition-colors" style={{ color: '#1F2937' }}>
                                {aTitle}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}
