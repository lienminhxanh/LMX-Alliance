import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Building2, Truck, Recycle, Award, Users, Briefcase, Handshake } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { CountUp } from '@/components/ui/CountUp';
import { LeafDecor } from '@/components/ui/LeafDecor';
import type { Metadata } from 'next';

import { buildMeta, SITE_URL } from '@/lib/seo';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/public/ProjectCard';

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

function PartnerLogoFallback({ name }: { name: string }) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
    { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
    { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
    { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' },
  ];
  const theme = colors[Math.abs(hash) % colors.length];
  const initials = name
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map(w => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const cleanName = name
    .replace(/^(Công ty TNHH MTV|Công ty Cổ phần|Công ty TNHH|Tập đoàn)\s+/i, '')
    .toUpperCase();
  return (
    <div 
      className="flex items-center gap-3 px-5 py-3 border transition-all hover:scale-105 duration-300"
      style={{ 
        backgroundColor: '#ffffff',
        borderColor: '#defbbc',
        borderRadius: '4px', 
        minWidth: '220px',
        maxWidth: '280px',
        height: '60px',
        boxShadow: '0 4px 12px rgba(1, 82, 49, 0.04)'
      }}
    >
      <div 
        className="w-9 h-9 rounded flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${theme.text} 0%, var(--color-primary-dark) 100%)`, 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {initials}
      </div>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-xs font-bold tracking-wide leading-tight text-[#1F2937] truncate">
          {cleanName}
        </span>
        <span className="text-[9px] text-[#9CA3AF] font-semibold tracking-wider mt-0.5 leading-none uppercase">
          Partner Alliance
        </span>
      </div>
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const navT = await getTranslations({ locale, namespace: 'nav' });

  const [homePage, sectors, stats, latestNews, partners, publishedProjects] = await Promise.all([
    prisma.homePage.findFirst(),
    prisma.businessSector.findMany({ where: { status: 'PUBLISHED' }, orderBy: { orderIndex: 'asc' } }),
    prisma.statistic.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.newsArticle.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.partner.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
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
      <section className="relative overflow-hidden" style={{ background: 'var(--color-primary-dark)' }}>
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
          style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%), linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, transparent 40%, rgba(15, 23, 42, 0.8) 100%)' }}
          aria-hidden
        />
        <LeafDecor variant="mixed" count={14} color="#78d750" />

        <div className="container-max py-24 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-xl">
              <AnimateIn>
                <p className="text-xs uppercase tracking-widest mb-3 font-bold" style={{ color: '#8ec63f', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  LMX Alliance
                </p>
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <h1 className="mb-4 leading-tight whitespace-pre-line" style={{ fontSize: 'clamp(2rem,4vw,3.25rem)', fontWeight: 700, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                  {heroTitle}
                </h1>
              </AnimateIn>
              <AnimateIn delay={0.22}>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
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
      <section className="section-padding bg-[#f8fbf2]">
        <div className="container-max">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <AnimateIn>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-3" style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-display)' }}>
                {t('sectors.title')}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {t('sectors.subtitle')}
              </p>
              <div className="w-12 h-[3px] bg-[#8ec63f] mx-auto mt-4 rounded-full" />
            </AnimateIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-2">
            {sectors.map((sector, idx) => {
              const name    = (sector as any)[`name${L}`];
              const slug    = sector.slug;
              const localThumbnails: Record<string, string> = {
                'logistics-xuat-nhap-khau': '/images/about/sector-logistics.webp',
                'phe-lieu-xu-ly-chat-thai': '/images/about/sector-recycling.webp',
              };
              const imageSrc = localThumbnails[slug] || sector.thumbnail;
              return (
                <AnimateIn key={sector.id} delay={idx * 0.1}>
                  <Link href={`/${locale}/business-segments/${slug}`} className="block group">
                    <div
                      className="card-lift relative overflow-hidden flex flex-col justify-end p-8 aspect-[3/4] min-h-[420px] cursor-pointer transition-all duration-500"
                      style={{ 
                        borderRadius: '4px', 
                        boxShadow: '0 10px 30px rgba(1, 82, 49, 0.08)' 
                      }}
                    >
                      {/* Background Image */}
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      
                      {/* Dark Gradient Overlay */}
                      <div
                        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(1, 82, 49, 0.1) 0%, rgba(1, 82, 49, 0.45) 50%, rgba(1, 44, 26, 0.95) 100%)',
                          zIndex: 1
                        }}
                        aria-hidden
                      />

                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-start translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                        <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#8ec63f' }}>
                          {locale === 'vi' ? 'LĨNH VỰC' : locale === 'en' ? 'SEGMENT' : '领域'}
                        </span>
                        
                        <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight uppercase mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                          {name}
                        </h3>

                        <div className="flex items-center gap-2 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                          <span className="text-xs font-semibold text-white">
                            {locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'Read More' : '查看详情'}
                          </span>
                          <ArrowRight size={14} style={{ color: '#8ec63f' }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────── */}
      {publishedProjects.length >= 3 && (
        <section className="section-padding">
          <div className="container-max">
            <SectionHeading
              eyebrow={t('projects.eyebrow')}
              title={t('projects.title')}
              align="center"
              className="mb-14 max-w-2xl mx-auto"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {publishedProjects.map((project, idx) => {
                const name = (project as any)[`name${L}`];
                const images = Array.isArray(project.images) ? (project.images as string[]) : [];
                return (
                  <ProjectCard
                    key={project.id}
                    image={images.length > 0 ? images[0] : null}
                    statusLabel={t(`projects.status.${project.status.toLowerCase()}`)}
                    name={name}
                    scale={project.scale ?? undefined}
                    location={project.location ?? undefined}
                    scaleLabel={locale === 'vi' ? 'Quy mô:' : locale === 'en' ? 'Scale:' : '规模:'}
                    locationLabel={locale === 'vi' ? 'Vị trí:' : locale === 'en' ? 'Location:' : '位置:'}
                    href={`/${locale}/activities`}
                    delay={idx * 0.1}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}



      {/* ── Latest News ───────────────────────────────── */}
      {latestNews.length > 0 && (
        <section className="section-padding" style={{ background: '#f8fbf2' }}>
          <div className="container-max">
            <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
              <AnimateIn>
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-0" style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-display)' }}>
                  {t('news.title')}
                </h2>
                <div className="w-12 h-[3px] bg-[#8ec63f] mt-3 rounded-full" />
              </AnimateIn>
              <AnimateIn delay={0.1}>
                <Link
                  href={`/${locale}/news`}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                  style={{ color: 'var(--color-primary-dark)' }}
                >
                  {t('news.readMore')} <ArrowRight size={14} style={{ color: '#8ec63f' }} />
                </Link>
              </AnimateIn>
            </div>

            {/* Featured layout: 1 large + 2 small */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {latestNews[0] && (() => {
                const title = (latestNews[0] as any)[`title${L}`];
                const slug  = (latestNews[0] as any)[`slug${L}`];
                return (
                  <AnimateIn className="lg:col-span-7">
                    <Link href={`/${locale}/news/${slug}`} className="group block h-full">
                      <article className="card-lift bg-white h-full flex flex-col" style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(1,82,49,0.06)' }}>
                        <div className="overflow-hidden relative aspect-[16/9] flex-shrink-0">
                          {latestNews[0].thumbnail && (
                            <Image
                              src={latestNews[0].thumbnail}
                              alt={title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 1024px) 100vw, 58vw"
                            />
                          )}
                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 text-white" style={{ background: '#8ec63f', borderRadius: '2px' }}>
                              {locale === 'vi' ? 'Tin nổi bật' : locale === 'en' ? 'Featured' : '热点'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1 justify-between">
                          <div>
                            <p className="text-xs font-semibold text-[#8ec63f] mb-3">
                              {latestNews[0].publishedAt ? formatDate(latestNews[0].publishedAt, locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'vi-VN') : ''}
                            </p>
                            <h3 className="font-extrabold text-[var(--color-primary-dark)] line-clamp-3 group-hover:text-[#8ec63f] transition-colors" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>
                              {title}
                            </h3>
                          </div>
                          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold group-hover:gap-2.5 transition-all" style={{ color: '#8ec63f' }}>
                            {locale === 'vi' ? 'Xem thêm' : locale === 'en' ? 'Read more' : '阅读更多'} <ArrowRight size={12} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </AnimateIn>
                );
              })()}

              {/* Smaller cards — stacked layout (image top, content bottom) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {latestNews.slice(1).map((article, idx) => {
                  const title = (article as any)[`title${L}`];
                  const slug  = (article as any)[`slug${L}`];
                  return (
                    <AnimateIn key={article.id} delay={0.1 + idx * 0.08} className="flex-1">
                      <Link href={`/${locale}/news/${slug}`} className="group block h-full">
                        <article className="card-lift bg-white flex flex-col h-full overflow-hidden" style={{ borderRadius: '4px', boxShadow: '0 4px 20px rgba(1,82,49,0.06)' }}>
                          {/* Thumbnail — 16:9 on top */}
                          {article.thumbnail && (
                            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                              <Image
                                src={article.thumbnail}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                              />
                            </div>
                          )}
                          <div className="p-4 flex flex-col justify-between flex-1">
                            <div>
                              <p className="text-[11px] font-semibold text-[#8ec63f] mb-2">
                                {article.publishedAt ? formatDate(article.publishedAt, locale === 'zh' ? 'zh-CN' : locale === 'en' ? 'en-US' : 'vi-VN') : ''}
                              </p>
                              <h3 className="font-bold text-[var(--color-primary-dark)] line-clamp-2 group-hover:text-[#8ec63f] transition-colors leading-snug" style={{ fontSize: '0.9rem' }}>
                                {title}
                              </h3>
                            </div>
                            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold group-hover:gap-2 transition-all" style={{ color: '#8ec63f' }}>
                              {locale === 'vi' ? 'Xem thêm' : locale === 'en' ? 'Read more' : '阅读更多'} <ArrowRight size={10} />
                            </span>
                          </div>
                        </article>
                      </Link>
                    </AnimateIn>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
