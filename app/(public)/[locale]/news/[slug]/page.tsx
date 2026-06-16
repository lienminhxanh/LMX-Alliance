import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const slugField = `slug${L}` as 'slugVI' | 'slugEN' | 'slugZH';
  const article = await prisma.newsArticle.findFirst({
    where: { [slugField]: slug, status: 'PUBLISHED' },
  });
  if (!article) notFound();

  const title = (article as any)[`title${L}`];
  const content = (article as any)[`content${L}`];
  const summary = (article as any)[`summary${L}`];

  return (
    <>
      <section className="bg-[#064e3b] text-white py-16">
        <div className="container-max">
          <Link href={`/${locale}/news`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> {locale === 'vi' ? 'Quay lại tin tức' : locale === 'en' ? 'Back to News' : '返回新闻'}
          </Link>
          <div className="max-w-2xl">
            <p className="text-xs text-gray-400 mb-3">
              {article.publishedAt ? formatDate(article.publishedAt) : ''} · {article.author}
            </p>
            <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.25rem)' }}>
              {title}
            </h1>
            <p className="text-gray-300 mt-4 leading-relaxed">{summary}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              {article.thumbnail && (
                <img src={article.thumbnail} alt={title} className="w-full mb-8 border border-[#E8E9ED]" style={{ borderRadius: '4px' }} />
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div className="p-4 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                  <p className="text-xs uppercase tracking-wider text-[#6B7280] mb-2">
                    {locale === 'vi' ? 'Tác giả' : locale === 'en' ? 'Author' : '作者'}
                  </p>
                  <p className="text-sm text-[#064e3b] font-medium">{article.author}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
