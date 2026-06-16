import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Building2 } from 'lucide-react';

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
          <div className="grid grid-cols-1 gap-6">
            {sectors.map((sector, idx) => {
              const name = (sector as any)[`name${L}`];
              const summary = (sector as any)[`summary${L}`];
              return (
                <div key={sector.id} className="border border-[#E8E9ED] p-8 grid grid-cols-1 md:grid-cols-5 gap-6 items-center bg-white" style={{ borderRadius: '4px' }}>
                  <div className="md:col-span-1 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5F6F8] flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-medium text-[#6B7280]" style={{ fontFamily: 'var(--font-mono)' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <h2 className="text-lg font-semibold text-[#1F2937] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{name}</h2>
                    <p className="text-[#6B7280] leading-relaxed">{summary}</p>
                  </div>
                  <div className="md:col-span-1 flex md:justify-end">
                    <Link
                      href={`/${locale}/business-segments/${sector.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F2937] text-white text-sm hover:bg-[#374151] transition-colors"
                      style={{ borderRadius: 0 }}
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
