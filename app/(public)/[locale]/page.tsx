import { useTranslations } from 'next-intl';
import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Building2, Truck, Recycle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
    description: 'Tập đoàn đa ngành hàng đầu trong xây lắp, logistics và xử lý chất thải.',
  };
}

const sectorIcons = [Building2, Truck, Recycle];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  const [homePage, sectors, stats, latestNews] = await Promise.all([
    prisma.homePage.findFirst(),
    prisma.businessSector.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.statistic.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
  ]);

  const heroTitle = (homePage as any)?.[`heroTitle${locale.toUpperCase()}`] ?? 'Xây dựng tương lai bền vững';
  const heroDesc = (homePage as any)?.[`heroDesc${locale.toUpperCase()}`] ?? '';

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1F2937] text-white">
        <div className="container-max py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">LMX Alliance</p>
            <h1 className="mb-6 text-white leading-tight whitespace-pre-line" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {heroTitle}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg">{heroDesc}</p>
            <div className="flex gap-3">
              <Link
                href={`/${locale}/business-segments`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1F2937] text-sm font-medium hover:bg-gray-100 transition-colors"
                style={{ borderRadius: 0 }}
              >
                {t('hero.cta')} <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center px-6 py-3 border border-gray-500 text-sm font-medium text-white hover:border-white transition-colors"
                style={{ borderRadius: 0 }}
              >
                {navT('contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Sectors */}
      <section className="section-padding bg-[#F5F6F8]">
        <div className="container-max">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-2">{t('sectors.subtitle')}</p>
            <h2 style={{ fontFamily: 'var(--font-display)' }}>{t('sectors.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#E8E9ED]">
            {sectors.map((sector, idx) => {
              const Icon = sectorIcons[idx] ?? Building2;
              const name = (sector as any)[`name${locale.toUpperCase()}`];
              const summary = (sector as any)[`summary${locale.toUpperCase()}`];
              return (
                <div key={sector.id} className={`p-8 bg-white ${idx < sectors.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#E8E9ED]' : ''}`}>
                  <Icon size={28} className="text-[#6B7280] mb-4" strokeWidth={1.5} />
                  <h3 className="text-base font-semibold text-[#1F2937] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                    {name}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed mb-5">{summary}</p>
                  <Link
                    href={`/${locale}/business-segments/${sector.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1F2937] hover:gap-2.5 transition-all"
                  >
                    {t('sectors.learnMore')} <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      {stats.length > 0 && (
        <section className="section-padding bg-[#1F2937] text-white">
          <div className="container-max">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-10">{t('stats.title')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const value = (stat as any)[`value${locale.toUpperCase()}`];
                const label = (stat as any)[`label${locale.toUpperCase()}`];
                return (
                  <div key={stat.id}>
                    <div className="text-4xl font-medium mb-1 text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                      {value}
                    </div>
                    <div className="text-sm text-gray-400">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About preview */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3">{t('about.title')}</p>
              <h2 className="mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                {locale === 'vi' && 'Công ty Cổ phần Liên Minh Xanh LMX'}
                {locale === 'en' && 'LMX Alliance Joint Stock Company'}
                {locale === 'zh' && '绿色联盟联合股份公司'}
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                {locale === 'vi' && 'LMX Alliance là tập đoàn đa ngành với hơn 10 năm kinh nghiệm, hoạt động trong 3 lĩnh vực chiến lược: xây lắp công trình, logistics & xuất nhập khẩu, và xử lý phế liệu & chất thải. Chúng tôi cam kết phát triển bền vững và tạo ra giá trị lâu dài cho cổ đông và cộng đồng.'}
                {locale === 'en' && 'LMX Alliance is a diversified conglomerate with over 10 years of experience, operating in 3 strategic sectors: construction, logistics & import-export, and waste management. We are committed to sustainable development and creating long-term value for shareholders and the community.'}
                {locale === 'zh' && 'LMX联盟是一家拥有10余年经验的多元化集团，在建筑施工、物流进出口和废物处理三大战略领域运营。我们致力于可持续发展，为股东和社区创造长期价值。'}
              </p>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F2937] text-white text-sm hover:bg-[#374151] transition-colors"
                style={{ borderRadius: 0 }}
              >
                {t('about.readMore')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="lg:col-span-2 bg-[#F5F6F8] aspect-[4/3] flex items-center justify-center border border-[#E8E9ED]">
              <div className="text-center text-[#6B7280]">
                <Building2 size={48} strokeWidth={1} className="mx-auto mb-3" />
                <p className="text-sm">LMX Alliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="section-padding bg-[#F5F6F8]">
          <div className="container-max">
            <div className="flex items-baseline justify-between mb-8">
              <h2 style={{ fontFamily: 'var(--font-display)' }}>{t('news.title')}</h2>
              <Link href={`/${locale}/news`} className="text-sm text-[#6B7280] hover:text-[#1F2937] flex items-center gap-1">
                {t('news.readMore')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((article) => {
                const title = (article as any)[`title${locale.toUpperCase()}`];
                const summary = (article as any)[`summary${locale.toUpperCase()}`];
                const slug = (article as any)[`slug${locale.toUpperCase()}`];
                return (
                  <article key={article.id} className="bg-white border border-[#E8E9ED] p-6" style={{ borderRadius: '4px' }}>
                    <p className="text-xs text-[#6B7280] mb-3">
                      {article.publishedAt ? formatDate(article.publishedAt, locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'vi-VN') : ''}
                    </p>
                    <h3 className="font-semibold text-[#1F2937] mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                      {title}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{summary}</p>
                    <Link href={`/${locale}/news/${slug}`} className="text-sm font-medium text-[#1F2937] hover:underline flex items-center gap-1">
                      {locale === 'vi' ? 'Đọc thêm' : locale === 'en' ? 'Read more' : '阅读更多'} <ArrowRight size={12} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#2C3E50] text-white">
        <div className="container-max text-center">
          <h2 className="mb-4 text-white" style={{ fontFamily: 'var(--font-display)' }}>{t('cta.title')}</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#1F2937] text-sm font-medium hover:bg-gray-100 transition-colors"
            style={{ borderRadius: 0 }}
          >
            {t('cta.button')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
