import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Building2, Truck, Recycle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { CountUp } from '@/components/ui/CountUp';
import { LeafDecor } from '@/components/ui/LeafDecor';
import type { Metadata } from 'next';

import { buildMeta, SITE_URL } from '@/lib/seo';

export const revalidate = 900;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Trang chủ',
    en: 'Home',
    zh: '首页',
  };
  const descs: Record<string, string> = {
    vi: 'LMX Alliance — Giải pháp toàn diện trong logistics, xây lắp công trình, thu mua phế liệu và xử lý chất thải nguy hại. An toàn – Hiệu quả – Minh bạch.',
    en: 'LMX Alliance — Comprehensive solutions in logistics, construction, scrap procurement and hazardous waste management. Safe – Efficient – Transparent.',
    zh: 'LMX Alliance — 物流、建筑、废料采购和危险废物处理综合解决方案。安全 – 高效 – 透明。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}`,
    alternates: { vi: '/vi', en: '/en', zh: '/zh' },
  });
}

const sectorIcons = [Building2, Truck, Recycle];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  const [homePage, sectors, stats, latestNews, partners] = await Promise.all([
    prisma.homePage.findFirst(),
    prisma.businessSector.findMany({ where: { status: 'PUBLISHED' }, orderBy: { orderIndex: 'asc' } }),
    prisma.statistic.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.newsArticle.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.partner.findMany({ orderBy: { orderIndex: 'asc' } }),
  ]);

  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
  const heroTitle = (homePage as any)?.[`heroTitle${L}`] ?? 'Xây dựng tương lai bền vững';
  const heroDesc  = (homePage as any)?.[`heroDesc${L}`]  ?? '';

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Công ty Cổ phần Liên Minh Xanh LMX',
    alternateName: 'LMX Alliance',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-931-824-025',
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Số 104 Đường Lò Lu',
      addressLocality: 'Long Phước',
      addressRegion: 'TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#015231' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783155165/lmx-migration/kib7bbktkmcv2p2k2cbd.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(1,61,39,0.45) 0%, rgba(1,82,49,0.25) 35%, rgba(1,82,49,0.6) 65%, rgba(1,82,49,0.92) 100%)' }}
          aria-hidden
        />
        <LeafDecor variant="mixed" count={14} color="#78d750" />

        <div className="container-max py-24 md:py-32 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-xl">
              <AnimateIn>
                <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#78d750' }}>
                  LMX Alliance
                </p>
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <h1 className="mb-4 leading-tight whitespace-pre-line" style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 700, color: '#fff' }}>
                  {heroTitle}
                </h1>
              </AnimateIn>
              <AnimateIn delay={0.22}>
                <p className="text-base leading-relaxed" style={{ color: '#defbbc' }}>
                  {heroDesc}
                </p>
              </AnimateIn>
            </div>
            <AnimateIn delay={0.35} className="shrink-0">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/business-segments`}
                  className="inline-flex items-center gap-2 px-7 py-3 text-sm font-medium transition-all hover:gap-3"
                  style={{ background: '#8ec63f', color: '#fff', borderRadius: '4px' }}
                >
                  {t('hero.cta')} <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="btn-hero-outline"
                >
                  {navT('contact')}
                </Link>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Business Sectors ──────────────────────────── */}
      <section className="section-padding" style={{ background: '#f8fbf2' }}>
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4B5563' }}>{t('sectors.subtitle')}</p>
            <h2 className="mb-10">{t('sectors.title')}</h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 border" style={{ borderColor: '#defbbc' }}>
            {sectors.map((sector, idx) => {
              const Icon = sectorIcons[idx] ?? Building2;
              const name    = (sector as any)[`name${L}`];
              const summary = (sector as any)[`summary${L}`];
              return (
                <AnimateIn key={sector.id} delay={idx * 0.1}>
                  <div
                    className={`card-lift bg-white h-full group cursor-pointer ${idx < sectors.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}`}
                    style={{ borderColor: '#defbbc' }}
                  >
                    {sector.thumbnail && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden">
                        <Image
                          src={sector.thumbnail}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <div
                        className="w-11 h-11 flex items-center justify-center mb-5 transition-all"
                        style={{ background: '#f8fbf2', borderRadius: '4px' }}
                      >
                        <Icon size={22} style={{ color: '#8ec63f' }} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-semibold mb-3">{name}</h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B7280' }}>{summary}</p>
                      <Link
                        href={`/${locale}/business-segments/${sector.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium link-underline"
                        style={{ color: '#8ec63f' }}
                        aria-label={`${t('sectors.learnMore')}: ${name}`}
                      >
                        {t('sectors.learnMore')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Statistics ────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="section-padding" style={{ background: '#015231' }}>
          <div className="container-max">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-10 font-medium" style={{ color: '#78d750' }}>
                {t('stats.title')}
              </p>
            </AnimateIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {stats.map((stat, idx) => {
                const value = (stat as any)[`value${L}`];
                const label = (stat as any)[`label${L}`];
                return (
                  <AnimateIn key={stat.id} delay={idx * 0.08}>
                    <CountUp value={value} label={label} />
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── About Preview ─────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center">
            <AnimateIn from="left" className="lg:col-span-3">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>{t('about.title')}</p>
              <h2 className="mb-5">
                {locale === 'vi' && 'Công ty Cổ phần Liên Minh Xanh LMX'}
                {locale === 'en' && 'LMX Alliance Joint Stock Company'}
                {locale === 'zh' && '绿色联盟联合股份公司'}
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: '#6B7280' }}>
                {locale === 'vi' && 'LMX Alliance là tập đoàn đa ngành với hơn 10 năm kinh nghiệm, hoạt động trong 3 lĩnh vực chiến lược: xây lắp công trình, logistics & xuất nhập khẩu, và xử lý phế liệu & chất thải. Chúng tôi cam kết phát triển bền vững và tạo ra giá trị lâu dài cho cổ đông và cộng đồng.'}
                {locale === 'en' && 'LMX Alliance is a diversified conglomerate with over 10 years of experience, operating in 3 strategic sectors: construction, logistics & import-export, and waste management. We are committed to sustainable development and long-term value creation.'}
                {locale === 'zh' && 'LMX联盟是一家拥有10余年经验的多元化集团，在建筑施工、物流进出口和废物处理三大战略领域运营。我们致力于可持续发展，为股东和社区创造长期价值。'}
              </p>
              <Link
                href={`/${locale}/about`}
                className="btn-primary"
                style={{ borderRadius: 0 }}
              >
                {t('about.readMore')} <ArrowRight size={14} />
              </Link>
            </AnimateIn>
            <AnimateIn delay={0.15} from="right" className="lg:col-span-2">
              <div className="photo-frame">
                <div
                  className="relative aspect-[4/3] overflow-hidden group"
                  style={{ border: '1px solid #defbbc', borderRadius: '4px', zIndex: 1 }}
                >
                  <Image
                    src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783155162/lmx-migration/isxcswevz1slkjapuagk.jpg"
                    alt={locale === 'vi' ? 'Đội ngũ LMX Alliance' : locale === 'en' ? 'LMX Alliance team' : 'LMX Alliance团队'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Latest News ───────────────────────────────── */}
      {latestNews.length > 0 && (
        <section className="section-padding" style={{ background: '#f8fbf2' }}>
          <div className="container-max">
            <AnimateIn>
              <div className="flex items-baseline justify-between mb-8">
                <h2>{t('news.title')}</h2>
                <Link href={`/${locale}/news`} className="text-sm flex items-center gap-1 link-underline" style={{ color: '#6B7280' }}>
                  {t('news.readMore')} <ArrowRight size={14} />
                </Link>
              </div>
            </AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((article, idx) => {
                const title   = (article as any)[`title${L}`];
                const summary = (article as any)[`summary${L}`];
                const slug    = (article as any)[`slug${L}`];
                return (
                  <AnimateIn key={article.id} delay={idx * 0.1}>
                    <article className="card-lift bg-white border h-full" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                      {article.thumbnail && (
                        <div className="overflow-hidden relative aspect-video" style={{ borderBottom: '1px solid #defbbc' }}>
                          <Image
                            src={article.thumbnail}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <p className="text-xs mb-3" style={{ color: '#6B7280' }}>
                          {article.publishedAt ? formatDate(article.publishedAt, locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'vi-VN') : ''}
                        </p>
                        <h3 className="font-semibold mb-2 line-clamp-2" style={{ fontSize: '1.05rem' }}>{title}</h3>
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#6B7280' }}>{summary}</p>
                        <Link
                          href={`/${locale}/news/${slug}`}
                          className="text-sm font-medium inline-flex items-center gap-1 link-underline"
                          style={{ color: '#8ec63f' }}
                          aria-label={`${locale === 'vi' ? 'Đọc thêm' : locale === 'en' ? 'Read more' : '阅读更多'}: ${title}`}
                        >
                          {locale === 'vi' ? 'Đọc thêm' : locale === 'en' ? 'Read more' : '阅读更多'} <ArrowRight size={12} />
                        </Link>
                      </div>
                    </article>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Partners Marquee ──────────────────────────── */}
      {partners.length > 0 && (
        <section className="py-14 border-t border-b" style={{ borderColor: '#defbbc' }}>
          <div className="container-max mb-8 text-center">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>
                {locale === 'vi' ? 'Đối tác của chúng tôi' : locale === 'en' ? 'Our Partners' : '我们的合作伙伴'}
              </p>
              <p className="text-sm" style={{ color: '#9CA3AF' }}>
                {locale === 'vi' ? 'Hệ thống đối tác tin cậy trên toàn quốc' : locale === 'en' ? 'Trusted partner network nationwide' : '全国可信合作伙伴网络'}
              </p>
            </AnimateIn>
          </div>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...partners, ...partners].map((p, i) => (
                <div key={i} className="marquee-item">
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={(p as any)[`name${L}`] || p.nameVI}
                      className="partner-logo"
                    />
                  ) : (
                    <div
                      className="flex items-center gap-2 px-4 py-2 border"
                      style={{ borderColor: '#defbbc', borderRadius: '2px', minWidth: '120px' }}
                    >
                      <div
                        className="w-7 h-7 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: '#8ec63f', borderRadius: '2px' }}
                      >
                        {((p as any)[`name${L}`] || p.nameVI).charAt(0)}
                      </div>
                      <span className="text-xs font-medium truncate" style={{ color: '#374151' }}>
                        {(p as any)[`name${L}`] || p.nameVI}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-20 text-white" style={{ background: '#013d27' }}>
        <div className="container-max text-center">
          <AnimateIn>
            <h2 className="mb-4" style={{ color: '#fff' }}>{t('cta.title')}</h2>
            <p className="mb-8 max-w-xl mx-auto" style={{ color: '#defbbc' }}>{t('cta.subtitle')}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium transition-all hover:gap-3"
              style={{ background: '#fff', color: '#015231', borderRadius: 0 }}
            >
              {t('cta.button')} <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
