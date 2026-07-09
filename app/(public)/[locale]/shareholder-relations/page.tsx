import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Quan hệ cổ đông',
    en: 'Shareholder Relations',
    zh: '股东关系',
  };
  const descs: Record<string, string> = {
    vi: 'Thông tin quan hệ cổ đông LMX Alliance — tài liệu, báo cáo và cập nhật dành cho nhà đầu tư.',
    en: 'LMX Alliance shareholder relations — documents, reports and investor updates.',
    zh: 'LMX Alliance股东关系 — 文件、报告和投资者更新。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/shareholder-relations`,
    alternates: {
      vi: '/vi/shareholder-relations',
      en: '/en/shareholder-relations',
      zh: '/zh/shareholder-relations',
    },
  });
}

export default async function InvestorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'investor' });

  // Translations helpers
  const textDict = {
    govDesc: {
      vi: 'Điều lệ Công ty Cổ phần Liên Minh Xanh LMX (LMX Alliance) được thông qua bởi Đại hội đồng cổ đông, quy định các nguyên tắc quản trị và điều hành doanh nghiệp.',
      en: 'The Charter of LMX Alliance Joint Stock Company approved by the General Meeting of Shareholders, defining governance and operational principles.',
      zh: '经股东大会批准的LMX绿色联盟股份公司章程，定义了治理和经营原则。'
    },
    finDesc: {
      vi: 'LMX Alliance công bố đầy đủ và minh bạch Báo cáo tài chính định kỳ theo quý, năm đã được kiểm toán bởi các tổ chức kiểm toán hàng đầu.',
      en: 'LMX Alliance publishes periodic quarterly and annual financial statements audited by top independent audit firms.',
      zh: 'LMX联盟定期、透明地公布由顶级独立审计事务所审计的季度和年度财务报表。'
    },
    annDesc: {
      vi: 'Báo cáo thường niên cung cấp bức tranh toàn cảnh về hoạt động kinh doanh, chiến lược phát triển và kết quả tăng trưởng của LMX Alliance.',
      en: 'The annual report provides a comprehensive overview of business operations, development strategy, and growth results of LMX Alliance.',
      zh: '年度报告全面概述了LMX联盟的业务运营、发展战略和增长成果。'
    },
    seeMore: {
      vi: 'Xem thêm',
      en: 'See more',
      zh: '查看更多'
    }
  };

  const localizedText = (key: keyof typeof textDict) => {
    const dict = textDict[key] as Record<string, string>;
    return dict[locale] ?? dict.vi;
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-primary-dark)] text-white py-24 flex items-center" style={{ minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783160253/lmx-migration/h2sptyzylqoc3ezjjgdf.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom opacity-30"
          style={{ objectPosition: '50% 22%' }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.2) 100%)' }}
          aria-hidden
        />
        <LeafDecor variant="eco" count={8} color="#78d750" />
        <div className="container-max relative w-full z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-[#78d750] mb-3 font-medium">LMX Alliance</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', color: '#fff', fontWeight: 700 }}>
              {t('title')}
            </h1>
            <p className="mt-3 text-base max-w-xl text-emerald-100">{t('subtitle')}</p>
          </AnimateIn>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="section-padding bg-white relative">
        <LeafDecor variant="leaf" count={5} color="#8ec63f" />
        <div className="container-max relative z-10">
          <div className="space-y-20">
            
            {/* 1. Điều lệ công ty */}
            <div className="max-w-4xl mx-auto text-center py-6">
              <AnimateIn>
                <h2 className="mb-4 text-[var(--color-primary-dark)]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600 }}>
                  {t('documents.governance').toUpperCase()}
                </h2>
                <p className="max-w-3xl mx-auto text-[#6B7280] leading-relaxed mb-6 text-sm md:text-base">
                  {localizedText('govDesc')}
                </p>
                <Link
                  href={`/${locale}/shareholder-relations/governance`}
                  className="inline-flex items-center text-sm font-semibold text-[#8ec63f] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  <span>{localizedText('seeMore')}</span>
                </Link>
              </AnimateIn>
            </div>

            {/* 2. Báo cáo tài chính */}
            <div className="max-w-4xl mx-auto text-center py-6">
              <AnimateIn>
                <h2 className="mb-4 text-[var(--color-primary-dark)]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600 }}>
                  {t('documents.financialReports').toUpperCase()}
                </h2>
                <p className="max-w-3xl mx-auto text-[#6B7280] leading-relaxed mb-6 text-sm md:text-base">
                  {localizedText('finDesc')}
                </p>
                <Link
                  href={`/${locale}/shareholder-relations/financial-reports`}
                  className="inline-flex items-center text-sm font-semibold text-[#8ec63f] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  <span>{localizedText('seeMore')}</span>
                </Link>
              </AnimateIn>
            </div>

            {/* 3. Báo cáo thường niên */}
            <div className="max-w-4xl mx-auto text-center py-6">
              <AnimateIn>
                <h2 className="mb-4 text-[var(--color-primary-dark)]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 600 }}>
                  {t('documents.annualReports').toUpperCase()}
                </h2>
                <p className="max-w-3xl mx-auto text-[#6B7280] leading-relaxed mb-6 text-sm md:text-base">
                  {localizedText('annDesc')}
                </p>
                <Link
                  href={`/${locale}/shareholder-relations/annual-reports`}
                  className="inline-flex items-center text-sm font-semibold text-[#8ec63f] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  <span>{localizedText('seeMore')}</span>
                </Link>
              </AnimateIn>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
