import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Target, Eye, Shield, Users, TrendingUp } from 'lucide-react';

const coreValues = [
  { icon: Shield, titleVI: 'Chính trực', titleEN: 'Integrity', titleZH: '诚信', descVI: 'Trung thực và minh bạch trong mọi hoạt động kinh doanh.', descEN: 'Honest and transparent in all business activities.', descZH: '在所有商业活动中诚实透明。' },
  { icon: Users, titleVI: 'Hợp tác', titleEN: 'Collaboration', titleZH: '合作', descVI: 'Xây dựng quan hệ đối tác bền vững với khách hàng và đối tác.', descEN: 'Building sustainable partnerships with clients and partners.', descZH: '与客户和合作伙伴建立可持续的合作关系。' },
  { icon: TrendingUp, titleVI: 'Đổi mới', titleEN: 'Innovation', titleZH: '创新', descVI: 'Không ngừng cải tiến và ứng dụng công nghệ mới.', descEN: 'Continuously improving and applying new technologies.', descZH: '不断改进和应用新技术。' },
  { icon: Target, titleVI: 'Bền vững', titleEN: 'Sustainability', titleZH: '可持续', descVI: 'Phát triển kinh doanh gắn liền với bảo vệ môi trường.', descEN: 'Business development aligned with environmental protection.', descZH: '业务发展与环境保护相结合。' },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  const [leaders, settings] = await Promise.all([
    prisma.leader.findMany({ orderBy: { orderIndex: 'asc' }, take: 4 }),
    prisma.companySettings.findFirst(),
  ]);

  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container-max">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{t('title')}</p>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>
            {t('subtitle')}
          </h1>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
              <div className="w-10 h-10 bg-[#1F2937] flex items-center justify-center mb-4">
                <Target size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>{t('mission.title')}</h3>
              <p className="text-[#6B7280] leading-relaxed">{t('mission.content')}</p>
            </div>
            <div className="p-8 bg-[#1F2937] text-white" style={{ borderRadius: '4px' }}>
              <div className="w-10 h-10 bg-white/10 flex items-center justify-center mb-4">
                <Eye size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{t('vision.title')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('vision.content')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-[#F5F6F8]">
        <div className="container-max">
          <h2 className="mb-10" style={{ fontFamily: 'var(--font-display)' }}>{t('values.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v) => {
              const Icon = v.icon;
              const title = (v as any)[`title${L}`];
              const desc = (v as any)[`desc${L}`];
              return (
                <div key={title} className="bg-white p-6 border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                  <Icon size={24} className="text-[#6B7280] mb-3" strokeWidth={1.5} />
                  <h4 className="font-semibold text-[#1F2937] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h4>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      {leaders.length > 0 && (
        <section className="section-padding">
          <div className="container-max">
            <h2 className="mb-10" style={{ fontFamily: 'var(--font-display)' }}>{t('leadership.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaders.map((leader) => {
                const name = (leader as any)[`name${L}`];
                const position = (leader as any)[`position${L}`];
                return (
                  <div key={leader.id} className="border border-[#E8E9ED]" style={{ borderRadius: '4px' }}>
                    <div className="aspect-[3/4] bg-[#F5F6F8] flex items-center justify-center">
                      {leader.photo ? (
                        <img src={leader.photo} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={40} className="text-[#E8E9ED]" />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>{name}</p>
                      <p className="text-sm text-[#6B7280] mt-0.5">{position}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Company Info */}
      {settings && (
        <section className="section-padding bg-[#F5F6F8]">
          <div className="container-max">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-[#6B7280] mb-3">
                {locale === 'vi' ? 'Thông tin công ty' : locale === 'en' ? 'Company Information' : '公司信息'}
              </p>
              <p className="text-[#6B7280] leading-relaxed">{settings.description}</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
