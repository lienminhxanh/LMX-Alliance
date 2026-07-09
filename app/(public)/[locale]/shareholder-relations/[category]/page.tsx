import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, FileText, Download } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';
import { buildMeta } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 3600;

const CATEGORY_MAP: Record<string, { dbCat: string; labelKey: string }> = {
  'governance': { dbCat: 'GOVERNANCE', labelKey: 'documents.governance' },
  'financial-reports': { dbCat: 'FINANCIAL_REPORTS', labelKey: 'documents.financialReports' },
  'annual-reports': { dbCat: 'ANNUAL_REPORTS', labelKey: 'documents.annualReports' }
};

export async function generateStaticParams() {
  return [
    { category: 'governance' },
    { category: 'financial-reports' },
    { category: 'annual-reports' }
  ];
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; category: string }> }
): Promise<Metadata> {
  const { locale, category } = await params;
  const config = CATEGORY_MAP[category];
  if (!config) return {};

  const titles: Record<string, string> = {
    vi: category === 'governance' ? 'Điều lệ công ty' : category === 'financial-reports' ? 'Báo cáo tài chính' : 'Báo cáo thường niên',
    en: category === 'governance' ? 'Company Charter' : category === 'financial-reports' ? 'Financial Reports' : 'Annual Reports',
    zh: category === 'governance' ? '公司章程' : category === 'financial-reports' ? '财务报告' : '年度报告',
  };

  return buildMeta({
    locale,
    title: `${titles[locale] ?? titles.vi} | LMX Alliance`,
    description: `Danh sách ${titles[locale] ?? titles.vi} của LMX Alliance`,
    path: `/${locale}/shareholder-relations/${category}`,
  });
}

// Fallback static documents in case database is empty
const MOCK_DOCUMENTS = [
  {
    id: "charter-2026",
    category: "GOVERNANCE",
    nameVI: "Điều lệ Công ty Cổ phần Liên Minh Xanh LMX (Sửa đổi lần 1)",
    nameEN: "Charter of LMX Green Alliance Joint Stock Company (Amended)",
    nameZH: "LMX绿色联盟股份公司章程（修正案）",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2026,
  },
  {
    id: "gov-rules-2026",
    category: "GOVERNANCE",
    nameVI: "Quy chế quản trị nội bộ Công ty Cổ phần Liên Minh Xanh LMX",
    nameEN: "Internal Corporate Governance Regulations of LMX Green Alliance",
    nameZH: "LMX绿色联盟内部公司治理规章",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2026,
  },
  {
    id: "bod-rules-2026",
    category: "GOVERNANCE",
    nameVI: "Quy chế hoạt động của Hội đồng Quản trị LMX Alliance",
    nameEN: "Operational Regulations of the Board of Directors of LMX Alliance",
    nameZH: "LMX联盟董事会运作规程",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2026,
  },
  {
    id: "fs-q1-2026-consolidated",
    category: "FINANCIAL_REPORTS",
    nameVI: "Báo cáo tài chính hợp nhất Quý 1/2026 kèm giải trình lợi nhuận",
    nameEN: "Consolidated Financial Statements for Q1.2026 with Explanation of Profit",
    nameZH: "2026年第一季度合并财务报表及利润说明",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2026,
  },
  {
    id: "fs-q1-2026-separate",
    category: "FINANCIAL_REPORTS",
    nameVI: "Báo cáo tài chính riêng lẻ Quý 1/2026 kèm giải trình lợi nhuận",
    nameEN: "Separate Financial Statements for Q1.2026 with Explanation of Profit",
    nameZH: "2026年第一季度独立财务报表及利润说明",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2026,
  },
  {
    id: "fs-audited-2025",
    category: "FINANCIAL_REPORTS",
    nameVI: "Báo cáo tài chính kiểm toán năm 2025 kèm giải trình lợi nhuận",
    nameEN: "Audited Financial Statements for Year 2025 with Explanation of Profit",
    nameZH: "2025年度审计财务报表及利润说明",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2025,
  },
  {
    id: "annual-report-2025",
    category: "ANNUAL_REPORTS",
    nameVI: "Báo cáo thường niên LMX Alliance năm 2025",
    nameEN: "LMX Alliance Annual Report 2025",
    nameZH: "LMX联盟2025年度报告",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2025,
  },
  {
    id: "annual-report-2024",
    category: "ANNUAL_REPORTS",
    nameVI: "Báo cáo thường niên LMX Alliance năm 2024",
    nameEN: "LMX Alliance Annual Report 2024",
    nameZH: "LMX联盟2024年度报告",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    year: 2024,
  }
];

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const config = CATEGORY_MAP[category];
  if (!config) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'investor' });
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  // Fetch documents from database
  let dbDocuments: any[] = [];
  try {
    dbDocuments = await prisma.investorDocument.findMany({
      where: { category: config.dbCat as any },
      orderBy: [{ year: 'desc' }, { uploadedAt: 'desc' }]
    });
  } catch (err) {
    console.error('Error fetching investor documents:', err);
  }

  // Filter mock documents if DB is empty
  const documents = dbDocuments.length > 0 
    ? dbDocuments 
    : MOCK_DOCUMENTS.filter(d => d.category === config.dbCat);

  // Category labels mapping
  const categoryTitles: Record<string, string> = {
    governance: locale === 'vi' ? 'Điều lệ công ty' : locale === 'en' ? 'Company Charter' : '公司章程',
    'financial-reports': locale === 'vi' ? 'Báo cáo tài chính' : locale === 'en' ? 'Financial Reports' : '财务报告',
    'annual-reports': locale === 'vi' ? 'Báo cáo thường niên' : locale === 'en' ? 'Annual Reports' : '年度报告',
  };

  const titleText = categoryTitles[category] || t(config.labelKey);

  // Additional detail notes
  const detailNotes: Record<string, string> = {
    vi: 'Chi tiết đính kèm!',
    en: 'Detail attached!',
    zh: '附有详细资料！'
  };

  const viewDetailText: Record<string, string> = {
    vi: 'Xem chi tiết...',
    en: 'Xem chi tiết...', // Keeping user format "Xem chi tiết..."
    zh: '查看详情...'
  };

  const note = detailNotes[locale] ?? detailNotes.vi;
  const viewDetail = viewDetailText[locale] ?? viewDetailText.vi;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Header */}
      <div className="bg-[#f8fbf2] border-b border-[#defbbc] py-4">
        <div className="container-max flex items-center gap-1.5 text-xs md:text-sm text-[#6B7280]">
          <Link href={`/${locale}`} className="hover:text-[var(--color-primary-dark)] transition-colors">
            {locale === 'vi' ? 'Trang chủ' : locale === 'en' ? 'Home' : '首页'}
          </Link>
          <ChevronRight size={12} className="opacity-60" />
          <Link href={`/${locale}/shareholder-relations`} className="hover:text-[var(--color-primary-dark)] transition-colors">
            {t('title')}
          </Link>
          <ChevronRight size={12} className="opacity-60" />
          <span className="text-[var(--color-primary-dark)] font-medium">{titleText}</span>
        </div>
      </div>

      {/* Main Body */}
      <main className="section-padding">
        <div className="container-max max-w-4xl">
          <AnimateIn>
            <h1 className="mb-12 text-[var(--color-primary-dark)] border-b-2 border-[#8ec63f] pb-3 inline-block" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 700 }}>
              {titleText.toUpperCase()}
            </h1>
          </AnimateIn>

          {/* Documents List in SaigonTel format */}
          <div className="space-y-6">
            {documents.map((doc, idx) => {
              const name = (doc as any)[`name${L}`] ?? doc.nameVI;
              return (
                <AnimateIn key={doc.id} delay={idx * 0.05}>
                  <div className="group border-b border-[#defbbc] pb-6 last:border-none">
                    <h3 className="text-base font-semibold text-[#1F2937] hover:text-[var(--color-primary-dark)] transition-colors mb-1.5">
                      <Link href={`/${locale}/shareholder-relations/document/${doc.id}`}>
                        {name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#6B7280] italic mb-3">{note}</p>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/${locale}/shareholder-relations/document/${doc.id}`}
                        className="text-xs font-semibold text-[var(--color-primary-dark)] hover:text-[#8ec63f] transition-colors"
                      >
                        {viewDetail}
                      </Link>
                      <span className="text-[#defbbc] text-xs">|</span>
                      <a
                        href={doc.fileUrl}
                        download
                        className="inline-flex items-center gap-1 text-xs text-[#6B7280] hover:text-[var(--color-primary-dark)] transition-colors"
                      >
                        <Download size={12} />
                        <span>{locale === 'vi' ? 'Tải PDF' : locale === 'en' ? 'Download PDF' : '下载 PDF'}</span>
                      </a>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}

            {documents.length === 0 && (
              <p className="text-[#6B7280] text-sm py-8">
                {locale === 'vi' ? 'Chưa có tài liệu trong danh mục này.' : locale === 'en' ? 'No documents available in this category.' : '该类别暂无文件。'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
