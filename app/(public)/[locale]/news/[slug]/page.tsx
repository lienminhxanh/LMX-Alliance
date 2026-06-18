import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const categoryLabel: Record<string, Record<string, string>> = {
  COMPANY_NEWS:       { vi: 'Tin công ty',       en: 'Company News',        zh: '公司新闻' },
  INVESTOR_RELATIONS: { vi: 'Quan hệ cổ đông',   en: 'Shareholder Relations', zh: '股东关系' },
  SUSTAINABILITY:     { vi: 'Phát triển bền vững', en: 'Sustainability',     zh: '可持续发展' },
  RECRUITMENT:        { vi: 'Tuyển dụng',         en: 'Recruitment',         zh: '招聘' },
};

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const slugField = `slug${L}` as 'slugVI' | 'slugEN' | 'slugZH';

  // Primary lookup by current locale's slug field
  let article = await prisma.newsArticle.findFirst({
    where: { [slugField]: slug, status: 'PUBLISHED' },
  });

  // Cross-locale fallback: user switched language via header, slug belongs to another locale
  // Find article by any slug field, then redirect to the correct slug for current locale
  if (!article) {
    const otherFields = (['slugVI', 'slugEN', 'slugZH'] as const).filter(f => f !== slugField);
    for (const field of otherFields) {
      const found = await prisma.newsArticle.findFirst({
        where: { [field]: slug, status: 'PUBLISHED' },
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

  return (
    <>
      {/* Hero */}
      <section className="bg-[#064e3b] text-white py-16">
        <div className="container-max">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-white"
            style={{ color: '#a7f3d0' }}
          >
            <ArrowLeft size={14} />
            {locale === 'vi' ? 'Quay lại tin tức' : locale === 'en' ? 'Back to News' : '返回新闻'}
          </Link>

          {/* Category badge */}
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 mb-4 uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#6ee7b7', borderRadius: '2px' }}
          >
            {catLabel}
          </span>

          <h1 className="text-white max-w-3xl" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)', lineHeight: 1.3 }}>
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm" style={{ color: '#a7f3d0' }}>
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
              <p className="text-base leading-relaxed mb-8 font-medium" style={{ color: '#374151', borderLeft: '3px solid #047857', paddingLeft: '1rem' }}>
                {summary}
              </p>

              {/* Cover image */}
              {article.thumbnail && (
                <figure className="mb-8">
                  <img
                    src={article.thumbnail}
                    alt={title}
                    className="w-full"
                    style={{ borderRadius: '4px', maxHeight: '480px', objectFit: 'cover' }}
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
                <div className="p-5 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-3">
                    {locale === 'vi' ? 'Thông tin bài viết' : locale === 'en' ? 'Article Info' : '文章信息'}
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <User size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <div>
                        <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Tác giả' : locale === 'en' ? 'Author' : '作者'}</p>
                        <p className="font-medium" style={{ color: '#064e3b' }}>{article.author}</p>
                      </div>
                    </div>
                    {article.publishedAt && (
                      <div className="flex items-start gap-2">
                        <Calendar size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                        <div>
                          <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Ngày đăng' : locale === 'en' ? 'Published' : '发布日期'}</p>
                          <p className="font-medium" style={{ color: '#064e3b' }}>{formatDate(article.publishedAt)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Tag size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <div>
                        <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Chuyên mục' : locale === 'en' ? 'Category' : '分类'}</p>
                        <p className="font-medium" style={{ color: '#064e3b' }}>{catLabel}</p>
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
                                <img src={a.thumbnail} alt="" className="w-14 h-14 object-cover flex-shrink-0" style={{ borderRadius: '2px' }} />
                              ) : (
                                <div className="w-14 h-14 flex-shrink-0" style={{ background: '#f0fdf4', borderRadius: '2px' }} />
                              )}
                              <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#047857] transition-colors" style={{ color: '#1F2937' }}>
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
