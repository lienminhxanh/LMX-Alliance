import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Download, FileText, Calendar, User } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { buildMeta } from '@/lib/seo';
import type { Metadata } from 'next';

import { DocumentDownloadButton, DocumentOpenButton } from './DocumentActions';

export const revalidate = 3600;

const CATEGORY_MAP: Record<string, { slug: string; title: Record<string, string> }> = {
  'GOVERNANCE': {
    slug: 'governance',
    title: { vi: 'Điều lệ công ty', en: 'Company Charter', zh: '公司章程' }
  },
  'FINANCIAL_REPORTS': {
    slug: 'financial-reports',
    title: { vi: 'Báo cáo tài chính', en: 'Financial Reports', zh: '财务报告' }
  },
  'ANNUAL_REPORTS': {
    slug: 'annual-reports',
    title: { vi: 'Báo cáo thường niên', en: 'Annual Reports', zh: '年度报告' }
  }
};

// Fallback documents list
const MOCK_DOCUMENTS = [
  {
    id: "charter-2026",
    category: "GOVERNANCE",
    nameVI: "Điều lệ Công ty Cổ phần Liên Minh Xanh LMX (Sửa đổi lần 1)",
    nameEN: "Charter of LMX Green Alliance Joint Stock Company (Amended)",
    nameZH: "LMX绿色联盟股份公司章程（修正案）",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "dieu-le-cong-ty-lmx.pdf",
    uploadedAt: new Date("2026-04-22T08:00:00Z"),
    author: "Ban quản trị LMX",
    authorEN: "LMX Board of Directors",
    authorZH: "LMX董事会"
  },
  {
    id: "gov-rules-2026",
    category: "GOVERNANCE",
    nameVI: "Quy chế quản trị nội bộ Công ty Cổ phần Liên Minh Xanh LMX",
    nameEN: "Internal Corporate Governance Regulations of LMX Green Alliance",
    nameZH: "LMX绿色联盟内部公司治理规章",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "quy-che-quan-tri-lmx.pdf",
    uploadedAt: new Date("2026-04-24T08:00:00Z"),
    author: "Ban quản trị LMX",
    authorEN: "LMX Board of Directors",
    authorZH: "LMX董事会"
  },
  {
    id: "bod-rules-2026",
    category: "GOVERNANCE",
    nameVI: "Quy chế hoạt động của Hội đồng Quản trị LMX Alliance",
    nameEN: "Operational Regulations of the Board of Directors of LMX Alliance",
    nameZH: "LMX联盟董事会运作规程",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "quy-che-hd-hdqt-lmx.pdf",
    uploadedAt: new Date("2026-04-26T08:00:00Z"),
    author: "Ban quản trị LMX",
    authorEN: "LMX Board of Directors",
    authorZH: "LMX董事会"
  },
  {
    id: "fs-q1-2026-consolidated",
    category: "FINANCIAL_REPORTS",
    nameVI: "Báo cáo tài chính hợp nhất Quý 1/2026 kèm giải trình lợi nhuận",
    nameEN: "Consolidated Financial Statements for Q1.2026 with Explanation of Profit",
    nameZH: "2026年第一季度合并财务报表及利润说明",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "BC_Tai_Chinh_Hop_Nhat_Q1_2026.pdf",
    uploadedAt: new Date("2026-04-30T09:00:00Z"),
    author: "Phòng Tài chính Kế toán",
    authorEN: "Finance & Accounting Department",
    authorZH: "财务与会计部"
  },
  {
    id: "fs-q1-2026-separate",
    category: "FINANCIAL_REPORTS",
    nameVI: "Báo cáo tài chính riêng lẻ Quý 1/2026 kèm giải trình lợi nhuận",
    nameEN: "Separate Financial Statements for Q1.2026 with Explanation of Profit",
    nameZH: "2026年第一季度独立财务报表及利润说明",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "BC_Tai_Chinh_Rieng_Le_Q1_2026.pdf",
    uploadedAt: new Date("2026-04-30T09:15:00Z"),
    author: "Phòng Tài chính Kế toán",
    authorEN: "Finance & Accounting Department",
    authorZH: "财务与会计部"
  },
  {
    id: "fs-audited-2025",
    category: "FINANCIAL_REPORTS",
    nameVI: "Báo cáo tài chính kiểm toán năm 2025 kèm giải trình lợi nhuận",
    nameEN: "Audited Financial Statements for Year 2025 with Explanation of Profit",
    nameZH: "2025年度审计财务报表及利润说明",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "BC_Tai_Chinh_Kiem_Toan_2025.pdf",
    uploadedAt: new Date("2026-03-15T10:00:00Z"),
    author: "Ban Kiểm toán Độc lập",
    authorEN: "Independent Audit Committee",
    authorZH: "独立审计委员会"
  },
  {
    id: "annual-report-2025",
    category: "ANNUAL_REPORTS",
    nameVI: "Báo cáo thường niên LMX Alliance năm 2025",
    nameEN: "LMX Alliance Annual Report 2025",
    nameZH: "LMX联盟2025年度报告",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "Bao_Cao_Thuong_Nien_2025.pdf",
    uploadedAt: new Date("2026-04-05T08:30:00Z"),
    author: "Phòng Truyền thông & Quan hệ Cổ đông",
    authorEN: "PR & Investor Relations Department",
    authorZH: "公关与投资者关系部"
  },
  {
    id: "annual-report-2024",
    category: "ANNUAL_REPORTS",
    nameVI: "Báo cáo thường niên LMX Alliance năm 2024",
    nameEN: "LMX Alliance Annual Report 2024",
    nameZH: "LMX联盟2024年度报告",
    fileUrl: "/docs/giay-phep-dkdn.pdf",
    fileName: "Bao_Cao_Thuong_Nien_2024.pdf",
    uploadedAt: new Date("2025-04-10T08:30:00Z"),
    author: "Phòng Truyền thông & Quan hệ Cổ đông",
    authorEN: "PR & Investor Relations Department",
    authorZH: "公关与投资者关系部"
  }
];

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; id: string }> }
): Promise<Metadata> {
  const { locale, id } = await params;
  let doc = null;
  try {
    doc = await prisma.investorDocument.findUnique({ where: { id } });
  } catch {}

  if (!doc) {
    doc = MOCK_DOCUMENTS.find(d => d.id === id);
  }

  if (!doc) return {};

  const name = (doc as any)[`name${locale.toUpperCase()}`] ?? doc.nameVI;

  return buildMeta({
    locale,
    title: `${name} | LMX Alliance`,
    description: `Xem chi tiết và tải xuống ${name}`,
    path: `/${locale}/shareholder-relations/document/${id}`,
  });
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'investor' });
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  // 1. Query database for document
  let dbDoc = null;
  try {
    dbDoc = await prisma.investorDocument.findUnique({ where: { id } });
  } catch (err) {
    console.error('Error fetching document:', err);
  }

  // 2. Fall back to mock document if not in DB
  const doc = dbDoc || MOCK_DOCUMENTS.find(d => d.id === id);
  if (!doc) {
    notFound();
  }

  const name = (doc as any)[`name${L}`] ?? doc.nameVI;
  const fileName = (doc as any).fileName || `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  const fileUrl = doc.fileUrl;
  const catConfig = CATEGORY_MAP[doc.category];

  // Date styling helper
  const dateObj = doc.uploadedAt || new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString(locale === 'vi' ? 'vi-VN' : locale === 'zh' ? 'zh-CN' : 'en-US', options);

  // Author details helper
  const authorName = (doc as any)[`author${L}`] ?? (doc as any).author ?? (locale === 'vi' ? 'Phòng Truyền thông' : locale === 'zh' ? '媒体部' : 'Communications Department');

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
          {catConfig && (
            <>
              <ChevronRight size={12} className="opacity-60" />
              <Link href={`/${locale}/shareholder-relations/${catConfig.slug}`} className="hover:text-[var(--color-primary-dark)] transition-colors">
                {catConfig.title[locale] ?? catConfig.title.vi}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="opacity-60" />
          <span className="text-[var(--color-primary-dark)] font-medium truncate max-w-[200px] md:max-w-xs">{name}</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="section-padding">
        <div className="container-max max-w-4xl">
          <AnimateIn>
            {/* Title & Metadata */}
            <h1 className="mb-4 text-[var(--color-primary-dark)]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 700, lineHeight: 1.25 }}>
              {name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-[#6B7280] mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{locale === 'vi' ? `Viết bởi: ${authorName}` : locale === 'zh' ? `撰写人: ${authorName}` : `Written by: ${authorName}`}</span>
              </div>
            </div>

            {/* Attached file box (Matches Image 4) */}
            <div className="bg-[#f8fbf2] border border-[#defbbc] p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderRadius: '4px' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e0f2fe] rounded flex items-center justify-center text-[#0284c7]">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">{locale === 'vi' ? 'Tài liệu đính kèm:' : locale === 'zh' ? '附带文件:' : 'Attached Document:'}</p>
                  <p className="text-sm font-semibold text-[#1F2937] truncate max-w-[250px] md:max-w-md">{fileName}</p>
                </div>
              </div>
              
              <DocumentDownloadButton
                fileUrl={fileUrl}
                fileName={fileName}
                downloadLabel={locale === 'vi' ? 'Tải file đính kèm' : locale === 'zh' ? '下载附件' : 'Download Attachment'}
              />
            </div>

            {/* PDF Previewer (Matches Image 4 request for Preview) */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[var(--color-primary-dark)] flex items-center gap-2">
                  <FileText size={18} />
                  <span>{locale === 'vi' ? 'Xem trước tài liệu' : locale === 'zh' ? '预览文件' : 'Document Preview'}</span>
                </h3>
                <DocumentOpenButton
                  fileUrl={fileUrl}
                  openLabel={locale === 'vi' ? 'Mở trong cửa sổ mới' : locale === 'zh' ? '在新窗口打开' : 'Open in new window'}
                />
              </div>

              {/* PDF Embed / Iframe */}
              <div 
                className="w-full border border-gray-200 bg-gray-50 flex flex-col justify-between overflow-hidden shadow-inner mx-auto" 
                style={{ 
                  borderRadius: '4px',
                  aspectRatio: '1 / 1.414'
                }}
              >
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&view=Fit`}
                  title={name}
                  className="w-full h-full border-none"
                  style={{ background: '#ffffff' }}
                />
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center pt-4">
              <Link
                href={`/${locale}/shareholder-relations`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:text-[#8ec63f] transition-all hover:underline"
              >
                {locale === 'vi' ? '← Quay lại Quan hệ cổ đông' : locale === 'zh' ? '← 返回股东关系' : '← Back to Shareholder Relations'}
              </Link>
            </div>
          </AnimateIn>
        </div>
      </main>
    </div>
  );
}
