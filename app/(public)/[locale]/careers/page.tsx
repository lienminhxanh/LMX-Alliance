import { getCachedCompanySettings } from '@/lib/cached';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Mail, Shield, TrendingUp, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Tuyển dụng', en: 'Careers', zh: '招聘' };
  const descs: Record<string, string> = {
    vi: 'Cơ hội nghề nghiệp tại LMX Alliance — môi trường chuyên nghiệp, phát triển bền vững và phúc lợi cạnh tranh.',
    en: 'Career opportunities at LMX Alliance — professional environment, sustainable growth and competitive benefits.',
    zh: 'LMX Alliance的职业机会 — 专业环境、可持续发展和有竞争力的福利。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/careers`,
    alternates: { vi: '/vi/careers', en: '/en/careers', zh: '/zh/careers' },
  });
}

const benefits = [
  {
    icon: Shield,
    titleVI: 'Môi trường chuyên nghiệp', titleEN: 'Professional Environment', titleZH: '专业环境',
    descVI: 'Làm việc trong môi trường năng động, chuyên nghiệp và không ngừng sáng tạo.',
    descEN: 'Work in a dynamic, professional and creative environment.',
    descZH: '在充满活力、专业且富有创意的环境中工作。',
  },
  {
    icon: TrendingUp,
    titleVI: 'Cơ hội thăng tiến', titleEN: 'Career Growth', titleZH: '晋升机会',
    descVI: 'Lộ trình phát triển rõ ràng, cơ hội thăng tiến không giới hạn cho người tài.',
    descEN: 'Clear development path and unlimited career advancement for talented individuals.',
    descZH: '清晰的发展路径，为有才能的人提供无限的职业晋升机会。',
  },
  {
    icon: Users,
    titleVI: 'Đội ngũ gắn kết', titleEN: 'Cohesive Team', titleZH: '团结的团队',
    descVI: 'Đồng nghiệp thân thiện, hỗ trợ lẫn nhau và cùng nhau phát triển bền vững.',
    descEN: 'Friendly, supportive colleagues growing together sustainably.',
    descZH: '友好、互相支持、共同可持续发展的同事。',
  },
  {
    icon: Briefcase,
    titleVI: 'Đãi ngộ cạnh tranh', titleEN: 'Competitive Package', titleZH: '竞争性待遇',
    descVI: 'Lương thưởng hấp dẫn, BHYT & BHXH đầy đủ, thưởng dự án và phúc lợi mở rộng.',
    descEN: 'Attractive salary, full health & social insurance, project bonuses and extended benefits.',
    descZH: '有吸引力的薪资，完整的医疗和社会保险，项目奖金及扩展福利。',
  },
];

const steps = [
  {
    step: '01',
    titleVI: 'Nộp hồ sơ', titleEN: 'Submit Application', titleZH: '提交申请',
    descVI: 'Gửi CV và thư xin việc qua email tuyển dụng. Hồ sơ gồm: CV tiếng Việt hoặc tiếng Anh, thư xin việc, bằng cấp liên quan.',
    descEN: 'Send your CV and cover letter via the recruitment email. Include: CV in Vietnamese or English, cover letter, relevant certificates.',
    descZH: '通过招聘邮件发送您的简历和求职信，包括：中文或英文简历、求职信及相关证书。',
  },
  {
    step: '02',
    titleVI: 'Xem xét hồ sơ', titleEN: 'Application Review', titleZH: '简历筛选',
    descVI: 'Bộ phận Nhân sự xem xét và đánh giá hồ sơ trong vòng 5–7 ngày làm việc.',
    descEN: 'HR reviews and evaluates applications within 5–7 working days.',
    descZH: '人事部门在5-7个工作日内审核并评估申请。',
  },
  {
    step: '03',
    titleVI: 'Phỏng vấn vòng 1', titleEN: 'First Interview', titleZH: '第一轮面试',
    descVI: 'Phỏng vấn qua điện thoại hoặc video call (30 phút) với chuyên viên Nhân sự.',
    descEN: 'Phone or video call interview (30 minutes) with HR specialist.',
    descZH: '与人事专员进行30分钟电话或视频面试。',
  },
  {
    step: '04',
    titleVI: 'Phỏng vấn vòng 2', titleEN: 'Second Interview', titleZH: '第二轮面试',
    descVI: 'Phỏng vấn trực tiếp với quản lý bộ phận tuyển dụng tại văn phòng LMX Alliance.',
    descEN: 'In-person interview with the hiring department manager at LMX Alliance office.',
    descZH: '在LMX联盟办公室与招聘部门经理进行面对面面试。',
  },
  {
    step: '05',
    titleVI: 'Thông báo kết quả', titleEN: 'Result Notification', titleZH: '结果通知',
    descVI: 'Thông báo kết quả trong vòng 3 ngày làm việc sau buổi phỏng vấn cuối.',
    descEN: 'Results notified within 3 working days after the final interview.',
    descZH: '最后一轮面试后3个工作日内通知结果。',
  },
  {
    step: '06',
    titleVI: 'Ký hợp đồng & Onboarding', titleEN: 'Contract & Onboarding', titleZH: '签约与入职',
    descVI: 'Hoàn tất thủ tục hành chính, ký hợp đồng lao động và bắt đầu hành trình cùng LMX Alliance.',
    descEN: 'Complete administrative procedures, sign the employment contract and begin your journey with LMX Alliance.',
    descZH: '完成行政手续、签订劳动合同，开启您与LMX联盟的旅程。',
  },
];

const culturePoints = [
  { vi: 'Tôn trọng sự đa dạng và bình đẳng cơ hội', en: 'Respect diversity and equal opportunity', zh: '尊重多样性和平等机会' },
  { vi: 'Khuyến khích sáng tạo và cải tiến liên tục', en: 'Encourage creativity and continuous improvement', zh: '鼓励创新和持续改进' },
  { vi: 'Cam kết phát triển bền vững và bảo vệ môi trường', en: 'Committed to sustainable development and environmental protection', zh: '致力于可持续发展和环境保护' },
  { vi: 'Xây dựng văn hóa trách nhiệm và minh bạch', en: 'Building a culture of accountability and transparency', zh: '建立责任和透明的文化' },
];

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const settings = await getCachedCompanySettings();
  // Fallback to general company email if recruitment email not yet configured
  const recruitmentEmail = settings?.recruitmentEmail || settings?.email || '';

  const heroTitle = locale === 'vi' ? 'Cơ hội nghề nghiệp' : locale === 'en' ? 'Career Opportunities' : '职业机会';
  const heroSub = locale === 'vi'
    ? 'Gia nhập đội ngũ LMX Alliance — cùng chúng tôi xây dựng tương lai bền vững và tạo ra giá trị lâu dài.'
    : locale === 'en'
    ? 'Join the LMX Alliance team — together we build a sustainable future and create long-term value.'
    : '加入LMX联盟团队——与我们共同建设可持续未来，创造长远价值。';

  return (
    <>
      {/* ── Hero ────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 flex items-center" style={{ background: '#015231', minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(1,82,49,0.92) 0%, rgba(1,82,49,0.72) 60%, rgba(1,82,49,0.5) 100%)' }}
          aria-hidden
        />
        <div className="container-max relative w-full">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest font-medium mb-3" style={{ color: '#78d750' }}>LMX Alliance</p>
            <h1 className="mb-4 text-white" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700 }}>
              {heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed" style={{ color: '#defbbc' }}>
              {heroSub}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Why LMX ─────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              {locale === 'vi' ? 'Phúc lợi & Đãi ngộ' : locale === 'en' ? 'Benefits & Perks' : '福利与待遇'}
            </p>
            <h2 className="mb-10" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Tại sao chọn LMX Alliance?' : locale === 'en' ? 'Why Choose LMX Alliance?' : '为何选择LMX联盟？'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              const title = (b as any)[`title${L}`];
              const desc = (b as any)[`desc${L}`];
              return (
                <AnimateIn key={title} delay={idx * 0.07}>
                  <div className="card-lift p-6 border h-full" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: '#f8fbf2', borderRadius: '4px' }}>
                      <Icon size={20} strokeWidth={1.5} style={{ color: '#8ec63f' }} />
                    </div>
                    <h4 className="font-semibold mb-2 text-base" style={{ color: '#015231' }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Company Culture ──────────────────────── */}
      <section className="section-padding" style={{ background: '#f8fbf2' }}>
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#015231' }}>
                {locale === 'vi' ? 'Văn hóa doanh nghiệp' : locale === 'en' ? 'Company Culture' : '企业文化'}
              </p>
              <h2 className="mb-4" style={{ color: '#015231' }}>
                {locale === 'vi' ? 'Nơi bạn phát triển cùng chúng tôi'
                  : locale === 'en' ? 'Where You Grow With Us'
                  : '与我们共同成长'}
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: '#6B7280' }}>
                {locale === 'vi'
                  ? 'LMX Alliance không chỉ là nơi làm việc — đây là môi trường để mỗi cá nhân khẳng định giá trị bản thân, đóng góp cho cộng đồng và cùng nhau hướng tới mục tiêu phát triển kinh tế xanh, bền vững.'
                  : locale === 'en'
                  ? 'LMX Alliance is more than a workplace — it is an environment where every individual can assert their value, contribute to the community, and collectively work toward green and sustainable economic development.'
                  : 'LMX联盟不仅仅是一个工作场所——这是一个让每个人都能实现自身价值、为社区做出贡献、共同致力于绿色可持续经济发展的环境。'}
              </p>
              <ul className="space-y-3">
                {culturePoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#374151' }}>
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#8ec63f' }} />
                    <span>{locale === 'vi' ? p.vi : locale === 'en' ? p.en : p.zh}</span>
                  </li>
                ))}
              </ul>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '10+', labelVI: 'Năm kinh nghiệm', labelEN: 'Years of experience', labelZH: '年经验' },
                  { value: '200+', labelVI: 'Nhân sự chuyên nghiệp', labelEN: 'Professional staff', labelZH: '专业员工' },
                  { value: 'Đa dạng', labelVI: 'Dự án đã triển khai', labelEN: 'Projects delivered', labelZH: '多样项目' },
                  { value: '50+', labelVI: 'Đối tác chiến lược', labelEN: 'Strategic partners', labelZH: '战略合作伙伴' },
                ].map((s) => {
                  const label = locale === 'vi' ? s.labelVI : locale === 'en' ? s.labelEN : s.labelZH;
                  return (
                    <div key={s.value} className="p-6 text-center card-lift border flex flex-col justify-center items-center" style={{ background: '#013d27', borderRadius: '8px', borderColor: 'rgba(255,255,255,0.05)', boxShadow: '0 4px 12px rgba(1, 82, 49, 0.08)' }}>
                      <p className="text-3xl font-extrabold mb-1" style={{ color: '#8ec63f', fontFamily: 'var(--font-display)' }}>{s.value}</p>
                      <p className="text-xs font-medium text-gray-300 leading-snug">{label}</p>
                    </div>
                  );
                })}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Recruitment Process ──────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              {locale === 'vi' ? 'Minh bạch & Chuyên nghiệp' : locale === 'en' ? 'Transparent & Professional' : '透明与专业'}
            </p>
            <h2 className="mb-12" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Quy trình tuyển dụng' : locale === 'en' ? 'Recruitment Process' : '招聘流程'}
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => {
              const title = (s as any)[`title${L}`];
              const desc = (s as any)[`desc${L}`];
              return (
                <AnimateIn key={s.step} delay={idx * 0.07}>
                  <div className="p-6 border h-full" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-9 h-9 flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: '#8ec63f', color: '#013d27', borderRadius: '4px' }}
                      >
                        {s.step}
                      </span>
                      <h4 className="font-semibold" style={{ color: '#015231' }}>{title}</h4>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden" style={{ background: '#f8fbf2', borderTop: '3px solid #8ec63f' }}>
        <LeafDecor variant="branch" count={8} color="#8ec63f" />
        <div className="container-max text-center relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Bắt đầu hành trình của bạn' : locale === 'en' ? 'Start Your Journey' : '开始您的旅程'}
            </p>
            <h2 className="mb-4" style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)', color: '#015231' }}>
              {locale === 'vi' ? 'Gia nhập LMX Alliance hôm nay'
                : locale === 'en' ? 'Join LMX Alliance Today'
                : '今天加入LMX联盟'}
            </h2>
            <p className="mb-8 max-w-xl mx-auto text-sm leading-relaxed" style={{ color: '#374151' }}>
              {locale === 'vi'
                ? 'Gửi CV và thư xin việc trực tiếp đến bộ phận Nhân sự của chúng tôi. Chúng tôi sẽ phản hồi trong vòng 5–7 ngày làm việc.'
                : locale === 'en'
                ? 'Send your CV and cover letter directly to our HR department. We will respond within 5–7 working days.'
                : '将您的简历和求职信直接发送给我们的人事部门。我们将在5-7个工作日内回复。'}
            </p>
            {recruitmentEmail ? (
              <a
                href={`mailto:${recruitmentEmail}?subject=${encodeURIComponent(locale === 'vi' ? 'Hồ sơ ứng tuyển - LMX Alliance' : locale === 'en' ? 'Job Application - LMX Alliance' : '求职申请 - LMX联盟')}`}
                className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold"
              >
                <Mail size={16} />
                {locale === 'vi' ? 'Gửi hồ sơ ứng tuyển' : locale === 'en' ? 'Send Your Application' : '发送申请'}
              </a>
            ) : null}
            {recruitmentEmail && (
              <p className="mt-4 text-xs" style={{ color: '#015231' }}>
                {recruitmentEmail}
              </p>
            )}
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
