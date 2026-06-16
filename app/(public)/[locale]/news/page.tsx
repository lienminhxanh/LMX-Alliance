import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = ['COMPANY_NEWS', 'INVESTOR_RELATIONS', 'SUSTAINABILITY', 'RECRUITMENT'] as const;

export default async function NewsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { category, page = '1' } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'news' });
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
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container-max">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('subtitle')}</p>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>
            {t('title')}
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/${locale}/news`}
              className={`px-4 py-1.5 text-sm border ${!category ? 'bg-[#1F2937] text-white border-[#1F2937]' : 'border-[#E8E9ED] text-[#6B7280] hover:border-[#1F2937]'}`}
              style={{ borderRadius: 0 }}
            >
              {t('../../common.all')}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/${locale}/news?category=${cat}`}
                className={`px-4 py-1.5 text-sm border ${category === cat ? 'bg-[#1F2937] text-white border-[#1F2937]' : 'border-[#E8E9ED] text-[#6B7280] hover:border-[#1F2937]'}`}
                style={{ borderRadius: 0 }}
              >
                {(t as any)(`categories.${cat}`)}
              </Link>
            ))}
          </div>

          {/* Featured (first article large) */}
          {articles.length > 0 && !category && parseInt(page) === 1 && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-0 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
              <div className="md:col-span-3 bg-[#F5F6F8] aspect-video flex items-center justify-center">
                {articles[0].thumbnail ? (
                  <img src={articles[0].thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[#E8E9ED] text-6xl font-mono">{String(1).padStart(2, '0')}</div>
                )}
              </div>
              <div className="md:col-span-2 p-8 flex flex-col justify-center">
                <p className="text-xs text-[#6B7280] mb-2">{articles[0].publishedAt ? formatDate(articles[0].publishedAt) : ''}</p>
                <h2 className="font-semibold text-[#1F2937] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
                  {(articles[0] as any)[`title${L}`]}
                </h2>
                <p className="text-sm text-[#6B7280] mb-5 line-clamp-3">{(articles[0] as any)[`summary${L}`]}</p>
                <Link
                  href={`/${locale}/news/${(articles[0] as any)[`slug${L}`]}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1F2937]"
                >
                  {t('readMore')} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {((!category && parseInt(page) === 1) ? articles.slice(1) : articles).map((article) => (
              <article key={article.id} className="border border-[#E8E9ED] bg-white" style={{ borderRadius: '4px' }}>
                {article.thumbnail && (
                  <div className="aspect-video overflow-hidden border-b border-[#E8E9ED]">
                    <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs text-[#6B7280] mb-2">{article.publishedAt ? formatDate(article.publishedAt) : ''}</p>
                  <h3 className="font-semibold text-[#1F2937] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {(article as any)[`title${L}`]}
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{(article as any)[`summary${L}`]}</p>
                  <Link
                    href={`/${locale}/news/${(article as any)[`slug${L}`]}`}
                    className="text-sm font-medium text-[#1F2937] flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {t('readMore')} <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex gap-1 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/${locale}/news?${category ? `category=${category}&` : ''}page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center text-sm border ${parseInt(page) === p ? 'bg-[#1F2937] text-white border-[#1F2937]' : 'border-[#E8E9ED] text-[#6B7280] hover:border-[#1F2937]'}`}
                  style={{ borderRadius: 0 }}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}

          {articles.length === 0 && (
            <p className="text-[#6B7280] text-center py-16">
              {locale === 'vi' ? 'Chưa có bài viết.' : locale === 'en' ? 'No articles found.' : '暂无文章。'}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
