import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, DollarSign, ArrowRight, Shield, TrendingUp, Users, Briefcase } from 'lucide-react';

const benefits = [
  { icon: Shield, titleVI: 'Môi trường chuyên nghiệp', titleEN: 'Professional Environment', titleZH: '专业环境', descVI: 'Làm việc trong môi trường năng động, chuyên nghiệp và sáng tạo.', descEN: 'Work in a dynamic, professional and creative environment.', descZH: '在充满活力、专业且富有创意的环境中工作。' },
  { icon: TrendingUp, titleVI: 'Cơ hội thăng tiến', titleEN: 'Career Growth', titleZH: '晋升机会', descVI: 'Lộ trình thăng tiến rõ ràng và cơ hội phát triển không giới hạn.', descEN: 'Clear career path and unlimited growth opportunities.', descZH: '清晰的职业发展路径和无限的成长机会。' },
  { icon: Users, titleVI: 'Đội ngũ gắn kết', titleEN: 'Cohesive Team', titleZH: '团结的团队', descVI: 'Đồng nghiệp thân thiện, hỗ trợ và cùng nhau phát triển.', descEN: 'Friendly, supportive colleagues growing together.', descZH: '友好、互相支持、共同成长的同事。' },
  { icon: Briefcase, titleVI: 'Đãi ngộ cạnh tranh', titleEN: 'Competitive Benefits', titleZH: '竞争性待遇', descVI: 'Lương thưởng cạnh tranh, BHYT, BHXH đầy đủ theo quy định.', descEN: 'Competitive salary, full health and social insurance.', descZH: '有竞争力的薪资，完善的医疗和社会保险。' },
];

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'careers' });
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const jobs = await prisma.jobPosting.findMany({
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <section className="bg-[#064e3b] text-white py-20">
        <div className="container-max">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('subtitle')}</p>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Why LMX */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="mb-10" style={{ fontFamily: 'var(--font-display)' }}>{t('whyJoin')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              const title = (b as any)[`title${L}`];
              const desc = (b as any)[`desc${L}`];
              return (
                <div key={title} className="p-6 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                  <Icon size={24} className="text-[#6B7280] mb-3" strokeWidth={1.5} />
                  <h4 className="font-semibold text-[#064e3b] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h4>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="section-padding bg-[#F5F6F8]">
        <div className="container-max">
          <h2 className="mb-8" style={{ fontFamily: 'var(--font-display)' }}>{t('openPositions')}</h2>
          {jobs.length === 0 ? (
            <p className="text-[#6B7280]">
              {locale === 'vi' ? 'Hiện chưa có vị trí tuyển dụng.' : locale === 'en' ? 'No open positions at this time.' : '目前暂无招聘职位。'}
            </p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const title = (job as any)[`title${L}`];
                return (
                  <div key={job.id} className="bg-white p-6 border border-[#E8E9ED] flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderRadius: '4px' }}>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#064e3b] mb-1" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><DollarSign size={13} /> {job.salaryRange}</span>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/careers/${job.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#064e3b] text-white text-sm hover:bg-[#065f46] transition-colors flex-shrink-0"
                      style={{ borderRadius: 0 }}
                    >
                      {t('apply')} <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
