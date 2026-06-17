import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Download, FileText } from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';

const CATEGORIES = ['ANNUAL_REPORTS', 'FINANCIAL_REPORTS', 'DISCLOSURES', 'SHAREHOLDER_MEETINGS', 'GOVERNANCE'] as const;

export default async function InvestorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'investor' });

  const [messages, documents] = await Promise.all([
    prisma.investorMessage.findMany(),
    prisma.investorDocument.findMany({ orderBy: [{ year: 'desc' }, { uploadedAt: 'desc' }] }),
  ]);

  const ceoMsg = messages.find((m) => m.type === 'CEO_MESSAGE');
  const chairMsg = messages.find((m) => m.type === 'CHAIRMAN_MESSAGE');
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  return (
    <>
      <section className="bg-[#064e3b] text-white py-20">
        <div className="container-max">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">LMX Alliance</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', color: '#fff' }}>
            {t('title')}
          </h1>
          <p className="mt-3 text-sm max-w-xl" style={{ color: '#a7f3d0' }}>{t('subtitle')}</p>
        </div>
      </section>

      {/* Messages */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{ msg: ceoMsg, label: t('ceoMessage') }, { msg: chairMsg, label: t('chairmanMessage') }].map(({ msg, label }) => {
              if (!msg) return null;
              const title = (msg as any)[`title${L}`];
              const content = (msg as any)[`content${L}`];
              return (
                <div key={msg.id} className="p-8 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                  <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3">{label}</p>
                  <h3 className="text-xl font-semibold text-[#064e3b] mb-5" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                  <div className="prose text-[#6B7280]" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section-padding bg-[#F5F6F8]">
        <div className="container-max">
          <h2 className="mb-8" style={{ fontFamily: 'var(--font-display)' }}>{t('documents.title')}</h2>
          {CATEGORIES.map((cat) => {
            const catDocs = documents.filter((d) => d.category === cat);
            if (catDocs.length === 0) return null;
            const catLabel = (t as any)(`documents.${cat.toLowerCase().replace(/_/g, '')}`) || cat;
            return (
              <div key={cat} className="mb-10">
                <h3 className="text-base font-semibold text-[#064e3b] mb-4 pb-2 border-b border-[#E8E9ED]" style={{ fontFamily: 'var(--font-display)' }}>
                  {cat === 'ANNUAL_REPORTS' ? t('documents.annualReports')
                    : cat === 'FINANCIAL_REPORTS' ? t('documents.financialReports')
                    : cat === 'DISCLOSURES' ? t('documents.disclosures')
                    : cat === 'SHAREHOLDER_MEETINGS' ? t('documents.meetings')
                    : t('documents.governance')}
                </h3>
                <div className="space-y-2">
                  {catDocs.map((doc) => {
                    const name = (doc as any)[`name${L}`];
                    return (
                      <div key={doc.id} className="flex items-center justify-between bg-white p-4 border border-[#E8E9ED]" style={{ borderRadius: '2px' }}>
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-[#6B7280] flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#064e3b]">{name}</p>
                            <p className="text-xs text-[#6B7280]">{doc.year} · {doc.fileType.toUpperCase()} · {formatFileSize(doc.fileSize)}</p>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#064e3b] border border-[#E8E9ED] hover:bg-[#F5F6F8] transition-colors"
                          style={{ borderRadius: 0 }}
                        >
                          <Download size={12} /> {t('documents.download')}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {documents.length === 0 && (
            <p className="text-[#6B7280] text-sm">
              {locale === 'vi' ? 'Chưa có tài liệu cổ đông.' : locale === 'en' ? 'No shareholder documents available.' : '暂无股东文件。'}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
