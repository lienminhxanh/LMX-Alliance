import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Target, Eye, Shield, Users, TrendingUp, Leaf, Award, CheckCircle2 } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';

const coreValues = [
  { icon: Shield, titleVI: 'Chính trực', titleEN: 'Integrity', titleZH: '诚信', descVI: 'Trung thực và minh bạch trong mọi hoạt động kinh doanh.', descEN: 'Honest and transparent in all business activities.', descZH: '在所有商业活动中诚实透明。' },
  { icon: Users, titleVI: 'Hợp tác', titleEN: 'Collaboration', titleZH: '合作', descVI: 'Xây dựng quan hệ đối tác bền vững với khách hàng và đối tác.', descEN: 'Building sustainable partnerships with clients and partners.', descZH: '与客户和合作伙伴建立可持续的合作关系。' },
  { icon: TrendingUp, titleVI: 'Đổi mới', titleEN: 'Innovation', titleZH: '创新', descVI: 'Không ngừng cải tiến và ứng dụng công nghệ mới.', descEN: 'Continuously improving and applying new technologies.', descZH: '不断改进和应用新技术。' },
  { icon: Leaf, titleVI: 'Bền vững', titleEN: 'Sustainability', titleZH: '可持续', descVI: 'Phát triển kinh doanh gắn liền với bảo vệ môi trường.', descEN: 'Business development aligned with environmental protection.', descZH: '业务发展与环境保护相结合。' },
];

const timeline = [
  { year: '2012', titleVI: 'Thành lập công ty', titleEN: 'Company Founded', titleZH: '公司成立', descVI: 'Công ty Cổ phần Liên Minh Xanh LMX được thành lập tại TP. Hồ Chí Minh.', descEN: 'LMX Alliance Joint Stock Company founded in Ho Chi Minh City.', descZH: 'LMX绿色联盟股份公司在胡志明市成立。' },
  { year: '2015', titleVI: 'Mở rộng Logistics', titleEN: 'Logistics Expansion', titleZH: '物流扩张', descVI: 'Ra mắt mảng logistics và xuất nhập khẩu, mở rộng mạng lưới đối tác.', descEN: 'Launched logistics and import-export division, expanding partner network.', descZH: '推出物流和进出口部门，扩展合作伙伴网络。' },
  { year: '2018', titleVI: 'Xử lý chất thải', titleEN: 'Waste Management', titleZH: '废物管理', descVI: 'Thành lập bộ phận xử lý phế liệu và chất thải công nghiệp.', descEN: 'Established industrial waste and scrap management division.', descZH: '成立工业废物和废料管理部门。' },
  { year: '2022', titleVI: 'Chứng nhận ISO', titleEN: 'ISO Certification', titleZH: 'ISO认证', descVI: 'Đạt chứng nhận ISO 9001:2015 và ISO 14001:2015 cho cả 3 mảng kinh doanh.', descEN: 'Achieved ISO 9001:2015 and ISO 14001:2015 across all 3 business sectors.', descZH: '三大业务部门均获得ISO 9001:2015和ISO 14001:2015认证。' },
  { year: '2024', titleVI: 'Top 50 DN xanh', titleEN: 'Top 50 Green Biz', titleZH: 'Top 50绿色企业', descVI: 'Được vinh danh Top 50 Doanh nghiệp Xanh tiêu biểu tại Việt Nam.', descEN: 'Honored as Top 50 Outstanding Green Enterprises in Vietnam.', descZH: '荣获越南前50家优秀绿色企业称号。' },
];

const achievements = [
  { icon: Award, valueVI: '10+', descVI: 'Năm kinh nghiệm', descEN: 'Years of experience', descZH: '年经验' },
  { icon: CheckCircle2, valueVI: '100+', descVI: 'Dự án hoàn thành', descEN: 'Projects completed', descZH: '完成项目' },
  { icon: Users, valueVI: '200+', descVI: 'Nhân sự chuyên nghiệp', descEN: 'Professional staff', descZH: '专业员工' },
  { icon: Target, valueVI: '50+', descVI: 'Đối tác chiến lược', descEN: 'Strategic partners', descZH: '战略合作伙伴' },
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
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-24" style={{ background: '#064e3b' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: '#10b981' }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-5" style={{ background: '#6ee7b7' }} />
        </div>
        <div className="container-max relative">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#6ee7b7' }}>{t('title')}</p>
            <h1 className="mb-4" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', fontWeight: 700, color: '#fff' }}>
              {t('subtitle')}
            </h1>
            <p className="max-w-xl text-base leading-relaxed" style={{ color: '#a7f3d0' }}>
              {locale === 'vi' && 'Hơn 10 năm xây dựng giá trị, phát triển bền vững và đóng góp vào cộng đồng.'}
              {locale === 'en' && 'Over 10 years of building value, sustainable development, and community contribution.'}
              {locale === 'zh' && '10多年来构建价值、可持续发展并为社区做出贡献。'}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Achievements strip ───────────────────── */}
      <section style={{ background: '#047857' }}>
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {achievements.map((a, idx) => {
              const desc = (a as any)[`desc${L}`];
              return (
                <AnimateIn key={idx} delay={idx * 0.08}>
                  <div className="py-8 px-4 text-center border-r last:border-0" style={{ borderColor: '#065f46' }}>
                    <p className="text-3xl font-bold text-white mb-1">{a.valueVI}</p>
                    <p className="text-xs" style={{ color: '#a7f3d0' }}>{desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              {locale === 'vi' ? 'Định hướng phát triển' : locale === 'en' ? 'Our Direction' : '发展方向'}
            </p>
            <h2 className="mb-10">
              {locale === 'vi' ? 'Sứ mệnh & Tầm nhìn' : locale === 'en' ? 'Mission & Vision' : '使命与愿景'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <AnimateIn delay={0.05}>
              <div className="p-8 border h-full group card-lift" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-5 transition-all" style={{ background: '#f0fdf4', borderRadius: '4px' }}>
                  <Target size={22} style={{ color: '#047857' }} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{t('mission.title')}</h3>
                <p className="leading-relaxed" style={{ color: '#6B7280' }}>{t('mission.content')}</p>
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid #E8E9ED' }}>
                  <ul className="space-y-2">
                    {(locale === 'vi'
                      ? ['Phát triển doanh nghiệp bền vững', 'Tạo việc làm chất lượng cao', 'Bảo vệ môi trường']
                      : locale === 'en'
                      ? ['Sustainable business growth', 'Creating quality employment', 'Environmental protection']
                      : ['可持续业务发展', '创造优质就业', '环境保护']
                    ).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                        <CheckCircle2 size={14} style={{ color: '#047857', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateIn>

            {/* Vision */}
            <AnimateIn delay={0.1}>
              <div className="p-8 h-full text-white" style={{ background: '#064e3b', borderRadius: '4px' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '4px' }}>
                  <Eye size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>{t('vision.title')}</h3>
                <p className="leading-relaxed" style={{ color: '#a7f3d0' }}>{t('vision.content')}</p>
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid #065f46' }}>
                  <ul className="space-y-2">
                    {(locale === 'vi'
                      ? ['Top 10 tập đoàn Đông Nam Á 2030', 'Mở rộng ra thị trường quốc tế', 'Dẫn đầu về kinh tế xanh']
                      : locale === 'en'
                      ? ['Top 10 SEA conglomerate by 2030', 'Expand to international markets', 'Lead in green economy']
                      : ['2030年东南亚前十集团', '拓展国际市场', '引领绿色经济']
                    ).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#6ee7b7' }}>
                        <CheckCircle2 size={14} style={{ color: '#6ee7b7', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────── */}
      <section className="section-padding" style={{ background: '#F5F6F8' }}>
        <div className="container-max">
          <AnimateIn>
            <h2 className="mb-10">{t('values.title')}</h2>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((v, idx) => {
              const Icon = v.icon;
              const title = (v as any)[`title${L}`];
              const desc  = (v as any)[`desc${L}`];
              return (
                <AnimateIn key={title} delay={idx * 0.07}>
                  <div
                    className="card-lift bg-white p-6 border h-full group"
                    style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center mb-4 transition-all"
                      style={{ background: '#f0fdf4', borderRadius: '4px' }}
                    >
                      <Icon size={20} strokeWidth={1.5} style={{ color: '#047857' }} />
                    </div>
                    <h4 className="font-semibold mb-2" style={{ fontSize: '1rem' }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              {locale === 'vi' ? 'Hành trình phát triển' : locale === 'en' ? 'Our Journey' : '发展历程'}
            </p>
            <h2 className="mb-12">
              {locale === 'vi' ? 'Dấu mốc lịch sử' : locale === 'en' ? 'Key Milestones' : '重要里程碑'}
            </h2>
          </AnimateIn>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px" style={{ background: '#d1fae5' }} />
            <div className="space-y-10">
              {timeline.map((item, idx) => {
                const title = (item as any)[`title${L}`];
                const desc  = (item as any)[`desc${L}`];
                const isRight = idx % 2 === 1;
                return (
                  <AnimateIn key={item.year} delay={idx * 0.08}>
                    <div className={`relative flex items-start gap-6 md:gap-0 ${isRight ? 'md:flex-row-reverse' : ''}`}>
                      {/* Year dot */}
                      <div className="flex-shrink-0 relative z-10 ml-0 md:ml-0"
                        style={{ width: '2rem', marginLeft: isRight ? 'auto' : undefined }}>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto"
                          style={{ background: '#047857' }}
                        >
                          ✓
                        </div>
                      </div>
                      {/* Content */}
                      <div className={`flex-1 pb-2 md:w-5/12 md:${isRight ? 'pr-10' : 'pl-10'} pl-4`}>
                        <div className="card-lift p-6 bg-white border" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                          <span
                            className="inline-block text-xs font-bold px-2 py-1 mb-3"
                            style={{ background: '#f0fdf4', color: '#047857', borderRadius: '2px' }}
                          >
                            {item.year}
                          </span>
                          <h4 className="font-semibold mb-1">{title}</h4>
                          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                        </div>
                      </div>
                      {isRight && <div className="hidden md:block md:w-5/12" />}
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership ───────────────────────────── */}
      {leaders.length > 0 && (
        <section className="section-padding" style={{ background: '#F5F6F8' }}>
          <div className="container-max">
            <AnimateIn>
              <h2 className="mb-10">{t('leadership.title')}</h2>
            </AnimateIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {leaders.map((leader, idx) => {
                const name     = (leader as any)[`name${L}`];
                const position = (leader as any)[`position${L}`];
                return (
                  <AnimateIn key={leader.id} delay={idx * 0.08}>
                    <div className="card-lift border bg-white overflow-hidden group" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                      <div className="aspect-[3/4] overflow-hidden" style={{ background: '#f0fdf4' }}>
                        {leader.photo ? (
                          <img src={leader.photo} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users size={48} strokeWidth={1} style={{ color: '#d1fae5' }} />
                          </div>
                        )}
                      </div>
                      <div className="p-4" style={{ borderTop: '3px solid #047857' }}>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{position}</p>
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Company Info ─────────────────────────── */}
      {settings && (
        <section className="section-padding" style={{ background: '#fff' }}>
          <div className="container-max">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#047857' }}>
                {locale === 'vi' ? 'Thông tin công ty' : locale === 'en' ? 'Company Info' : '公司信息'}
              </p>
              <h2 className="mb-10" style={{ color: '#064e3b' }}>
                {settings.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="leading-relaxed mb-6" style={{ color: '#6B7280' }}>{settings.description}</p>
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
                    style={{ background: '#f0fdf4', color: '#047857', border: '1px solid #d1fae5', borderRadius: '2px' }}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#047857' }} />
                    {locale === 'vi' ? 'Đang hoạt động' : locale === 'en' ? 'Active' : '运营中'}
                  </div>
                </div>
                <div
                  className="p-6 border"
                  style={{ borderColor: '#E8E9ED', borderRadius: '4px', background: '#FAFAFA' }}
                >
                  <div className="space-y-5">
                    {[
                      { label: locale === 'vi' ? 'Địa chỉ' : locale === 'en' ? 'Address' : '地址', value: settings.address },
                      { label: locale === 'vi' ? 'Điện thoại' : locale === 'en' ? 'Phone' : '电话', value: settings.phone },
                      { label: 'Email', value: settings.email },
                      { label: locale === 'vi' ? 'Website' : 'Website', value: settings.website },
                    ].map(({ label, value }) => value ? (
                      <div key={label} className="flex gap-4">
                        <span
                          className="text-xs font-bold uppercase tracking-wider flex-shrink-0 pt-0.5"
                          style={{ color: '#047857', width: '5rem' }}
                        >
                          {label}
                        </span>
                        <span className="text-sm" style={{ color: '#374151' }}>{value}</span>
                      </div>
                    ) : null)}
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      )}
    </>
  );
}
