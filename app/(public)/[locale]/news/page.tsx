import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';

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
  const skip = (parseInt(page) - 1) * take;
  const where = {
    status: 'PUBLISHED' as const,
    ...(category ? { category: category as any } : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({ where, orderBy: { publishedAt: 'desc' }, take, skip }),
    prisma.newsArticle.count({ where }),
  ]);
  const pages = Math.ceil(total / take);

  return (
    <>
      <section className="py-20 relative overflow-hidden" style={{ background: '#064e3b' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full opacity-10" style={{ background: '#10b981' }} />
        </div>
        <div className="container-max relative">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#6ee7b7' }}>{t('subtitle')}</p>
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
                  background: !category ? '#047857' : 'transparent',
                  color: !category ? '#fff' : '#6B7280',
                  borderColor: !category ? '#047857' : '#E8E9ED',
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
                    background: category === cat ? '#047857' : 'transparent',
                    color: category === cat ? '#fff' : '#6B7280',
                    borderColor: category === cat ? '#047857' : '#E8E9ED',
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
              <div className="mb-10 grid grid-cols-1 md:grid-cols-5 border" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                <div className="md:col-span-3 overflow-hidden" style={{ background: '#F5F6F8' }}>
                  {articles[0].thumbnail ? (
                    <img src={articles[0].thumbnail} alt="" className="w-full h-full object-cover" style={{ minHeight: '240px' }} />
                  ) : (
                    <div className="w-full h-full min-h-60 flex items-center justify-center">
                      <span style={{ color: '#d1fae5', fontSize: '4rem', fontFamily: 'var(--font-mono)' }}>01</span>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 p-8 flex flex-col justify-center">
                  <span
                    className="inline-block text-xs font-medium px-2 py-1 mb-4 w-fit"
                    style={{ background: '#f0fdf4', color: '#047857', borderRadius: '2px' }}
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
                    style={{ color: '#047857' }}
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
                <article className="card-lift border bg-white h-full group" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                  {article.thumbnail && (
                    <div className="overflow-hidden" style={{ borderBottom: '1px solid #E8E9ED' }}>
                      <img src={article.thumbnail} alt="" className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105" />
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
                      style={{ color: '#047857' }}
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
                    background: parseInt(page) === p ? '#047857' : 'transparent',
                    color: parseInt(page) === p ? '#fff' : '#6B7280',
                    borderColor: parseInt(page) === p ? '#047857' : '#E8E9ED',
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
