import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getCachedNewsList } from '@/lib/cached';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Tin tức', en: 'News', zh: '新闻' };
  const descs: Record<string, string> = {
    vi: 'Cập nhật tin tức mới nhất từ LMX Alliance — hoạt động kinh doanh, dự án, tuyển dụng và phát triển bền vững.',
    en: 'Latest news from LMX Alliance — business activities, projects, recruitment and sustainability.',
    zh: '来自LMX Alliance的最新消息 — 商业活动、项目、招聘和可持续发展。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/news`,
    alternates: { vi: '/vi/news', en: '/en/news', zh: '/zh/news' },
  });
}

const CATEGORIES = ['COMPANY_NEWS', 'INVESTOR_RELATIONS', 'SUSTAINABILITY', 'RECRUITMENT'] as const;

export default async function NewsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { category, page = '1' } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'news' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const take = 9;
  const { articles, total } = await getCachedNewsList(category, parseInt(page), take);
  const pages = Math.ceil(total / take);

  return (
    <>
      <section className="py-24 relative overflow-hidden flex items-center" style={{ background: '#015231', minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157487/lmx-migration/vf1nerboxp4phtvsp0yu.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(1,82,49,0.92) 0%, rgba(1,82,49,0.72) 60%, rgba(1,82,49,0.5) 100%)' }}
          aria-hidden
        />
        <div className="container-max relative w-full">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#78d750' }}>{t('subtitle')}</p>
            <h1 className="text-white" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700 }}>{t('title')}</h1>
          </AnimateIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          {/* Category filter */}
          <AnimateIn>
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href={`/${locale}/news`}
                className="px-4 py-1.5 text-sm border transition-colors"
                style={{
                  borderRadius: 0,
                  background: !category ? '#8ec63f' : 'transparent',
                  color: !category ? '#fff' : '#6B7280',
                  borderColor: !category ? '#8ec63f' : '#defbbc',
                }}
              >
                {tCommon('all')}
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/news?category=${cat}`}
                  className="px-4 py-1.5 text-sm border transition-colors"
                  style={{
                    borderRadius: 0,
                    background: category === cat ? '#8ec63f' : 'transparent',
                    color: category === cat ? '#fff' : '#6B7280',
                    borderColor: category === cat ? '#8ec63f' : '#defbbc',
                  }}
                >
                  {(t as any)(`categories.${cat}`)}
                </Link>
              ))}
            </div>
          </AnimateIn>

          {/* Featured article */}
          {articles.length > 0 && !category && parseInt(page) === 1 && (
            <AnimateIn>
              <div className="mb-10 grid grid-cols-1 md:grid-cols-5 border" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                <div className="md:col-span-3 overflow-hidden" style={{ background: '#f8fbf2' }}>
                  {articles[0].thumbnail ? (
                    <div className="w-full h-full relative" style={{ minHeight: '240px' }}>
                      <Image src={articles[0].thumbnail} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-60 flex items-center justify-center">
                      <span style={{ color: '#defbbc', fontSize: '4rem', fontFamily: 'var(--font-mono)' }}>01</span>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 p-8 flex flex-col justify-center">
                  <span
                    className="inline-block text-xs font-medium px-2 py-1 mb-4 w-fit"
                    style={{ background: '#f8fbf2', color: '#8ec63f', borderRadius: '2px' }}
                  >
                    {locale === 'vi' ? 'Nổi bật' : locale === 'en' ? 'Featured' : '精选'}
                  </span>
                  <p className="text-xs mb-2" style={{ color: '#6B7280' }}>
                    {articles[0].publishedAt ? formatDate(articles[0].publishedAt) : ''}
                  </p>
                  <h2 className="font-semibold mb-3" style={{ fontSize: '1.25rem' }}>
                    {(articles[0] as any)[`title${L}`]}
                  </h2>
                  <p className="text-sm mb-5 line-clamp-3" style={{ color: '#6B7280' }}>
                    {(articles[0] as any)[`summary${L}`]}
                  </p>
                  <Link
                    href={`/${locale}/news/${(articles[0] as any)[`slug${L}`]}`}
                    className="inline-flex items-center gap-2 text-sm font-medium link-underline"
                    style={{ color: '#8ec63f' }}
                    aria-label={`${t('readMore')}: ${(articles[0] as any)[`title${L}`]}`}
                  >
                    {t('readMore')} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </AnimateIn>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {((!category && parseInt(page) === 1) ? articles.slice(1) : articles).map((article, idx) => (
              <AnimateIn key={article.id} delay={idx * 0.07}>
                <article className="card-lift border bg-white h-full group" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                  {article.thumbnail && (
                    <div className="overflow-hidden relative aspect-video" style={{ borderBottom: '1px solid #defbbc' }}>
                      <Image
                        src={article.thumbnail}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs mb-2" style={{ color: '#6B7280' }}>
                      {article.publishedAt ? formatDate(article.publishedAt) : ''}
                    </p>
                    <h3 className="font-semibold mb-2 line-clamp-2" style={{ fontSize: '1rem' }}>
                      {(article as any)[`title${L}`]}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
                      {(article as any)[`summary${L}`]}
                    </p>
                    <Link
                      href={`/${locale}/news/${(article as any)[`slug${L}`]}`}
                      className="text-sm font-medium inline-flex items-center gap-1 link-underline"
                      style={{ color: '#8ec63f' }}
                      aria-label={`${t('readMore')}: ${(article as any)[`title${L}`]}`}
                    >
                      {t('readMore')} <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex gap-1 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/${locale}/news?${category ? `category=${category}&` : ''}page=${p}`}
                  className="w-9 h-9 flex items-center justify-center text-sm border transition-colors"
                  style={{
                    borderRadius: 0,
                    background: parseInt(page) === p ? '#8ec63f' : 'transparent',
                    color: parseInt(page) === p ? '#fff' : '#6B7280',
                    borderColor: parseInt(page) === p ? '#8ec63f' : '#defbbc',
                  }}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}

          {articles.length === 0 && (
            <p className="text-center py-16" style={{ color: '#6B7280' }}>
              {locale === 'vi' ? 'Chưa có bài viết.' : locale === 'en' ? 'No articles found.' : '暂无文章。'}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
