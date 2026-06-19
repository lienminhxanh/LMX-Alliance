import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Lĩnh vực hoạt động',
    en: 'Business Segments',
    zh: '业务领域',
  };
  const descs: Record<string, string> = {
    vi: 'LMX Alliance hoạt động trong 3 lĩnh vực chiến lược: Logistics & Xuất nhập khẩu, Xây lắp công trình, Thu mua phế liệu & Xử lý chất thải.',
    en: 'LMX Alliance operates in 3 strategic segments: Logistics & Import-Export, Construction, Scrap Procurement & Waste Management.',
    zh: 'LMX Alliance在3个战略领域运营：物流与进出口、建筑、废料采购与废物处理。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/business-segments`,
    alternates: {
      vi: '/vi/business-segments',
      en: '/en/business-segments',
      zh: '/zh/business-segments',
    },
  });
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sectors' });

  const sectors = await prisma.businessSector.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { orderIndex: 'asc' },
  });

  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  return (
    <>
      <section className="bg-[#0f1e0d] text-white py-20">
        <div className="container-max">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('subtitle')}</p>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>
            {t('title')}
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 gap-6">
            {sectors.map((sector, idx) => {
              const name = (sector as any)[`name${L}`];
              const summary = (sector as any)[`summary${L}`];
              return (
                <div key={sector.id} className="border border-[#d0e4c0] p-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-center bg-white" style={{ borderRadius: '4px' }}>
                  <div className="md:col-span-1 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#edf5e8] flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-medium text-[#6B7280]" style={{ fontFamily: 'var(--font-mono)' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <h2 className="text-lg font-semibold text-[#0f1e0d] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{name}</h2>
                    <p className="text-[#6B7280] leading-relaxed">{summary}</p>
                  </div>
                  <div className="md:col-span-1 flex md:justify-end">
                    <Link
                      href={`/${locale}/business-segments/${sector.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f1e0d] text-white text-sm hover:bg-[#1d3212] transition-colors"
                      style={{ borderRadius: 0 }}
                      aria-label={`${locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'View Details' : '查看详情'}: ${name}`}
                    >
                      {locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'View Details' : '查看详情'} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
