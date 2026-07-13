import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Target, Shield, Users, TrendingUp, Leaf, Award, CheckCircle2, FileText, Link2 } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';
import { HashScrollHandler } from '@/components/public/HashScrollHandler';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Giới thiệu',
    en: 'About Us',
    zh: '关于我们',
  };
  const descs: Record<string, string> = {
    vi: 'Tìm hiểu về Công ty Cổ phần Liên Minh Xanh LMX — lịch sử thành lập, sứ mệnh, tầm nhìn, giá trị cốt lõi và đội ngũ lãnh đạo.',
    en: 'Learn about LMX Green Alliance JSC — our founding story, mission, vision, core values and leadership team.',
    zh: '了解LMX绿色联盟股份公司 — 成立历史、使命、愿景、核心价值观和领导团队。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/about`,
    alternates: { vi: '/vi/about', en: '/en/about', zh: '/zh/about' },
  });
}

const coreValues = [
  {
    icon: Shield,
    image: '/images/about/about-hero.webp',
    titleVI: 'Chính trực', titleEN: 'Integrity', titleZH: '诚信',
    descVI: 'Trung thực, minh bạch trong mọi hoạt động và tuân thủ pháp luật.',
    descEN: 'Honesty and transparency in all activities, complying with laws.',
    descZH: '诚信透明，遵守法律。',
  },
  {
    icon: Users,
    image: '/images/about/mission-card.webp',
    titleVI: 'Hợp tác', titleEN: 'Collaboration', titleZH: '合作',
    descVI: 'Xây dựng mối quan hệ hợp tác bền vững với mọi đối tác.',
    descEN: 'Building sustainable partnerships with all stakeholders.',
    descZH: '与所有合作伙伴建立长期可持续关系。',
  },
  {
    icon: TrendingUp,
    image: '/images/about/vision-card.webp',
    titleVI: 'Hiệu quả', titleEN: 'Efficiency', titleZH: '高效',
    descVI: 'Giải pháp tối ưu, mang lại giá trị thiết thực và tiết kiệm chi phí.',
    descEN: 'Optimal solutions, bringing real value and cost efficiency.',
    descZH: '提供高效、优化成本的实用解决方案。',
  },
  {
    icon: Leaf,
    image: '/images/about/core-values-bg.webp',
    titleVI: 'Bền vững', titleEN: 'Sustainability', titleZH: '可持续',
    descVI: 'Đồng hành cùng bảo vệ môi trường và kinh tế tuần hoàn.',
    descEN: 'Committed to environmental protection and circular economy.',
    descZH: '致力于环境保护和循环经济发展。',
  },
];

const achievements = [
  { icon: Award,         value: '10+',  descVI: 'Năm kinh nghiệm',       descEN: 'Years of experience',    descZH: '年经验' },
  { icon: CheckCircle2,  value: 'Đa dạng', descVI: 'Dự án đã triển khai', descEN: 'Projects delivered',      descZH: '多样项目' },
  { icon: Users,         value: '200+', descVI: 'Nhân sự chuyên nghiệp',  descEN: 'Professional staff',     descZH: '专业员工' },
  { icon: Target,        value: '50+',  descVI: 'Đối tác chiến lược',     descEN: 'Strategic partners',     descZH: '战略合作伙伴' },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  const [leaders, settings, huePhuongPartner] = await Promise.all([
    prisma.leader.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.companySettings.findFirst(),
    prisma.partner.findUnique({ where: { id: 'hue-phuong-vn' } }),
  ]);

  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  return (
    <>
      <HashScrollHandler />
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-24" style={{ background: 'var(--color-primary-dark)' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom"
          aria-hidden
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.2) 100%)' }} aria-hidden />
        <LeafDecor variant="branch" count={8} color="#78d750" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-8" style={{ background: '#78d750' }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-5" style={{ background: '#78d750' }} />
        </div>
        <div className="container-max relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#78d750' }}>{t('title')}</p>
            <h1 className="mb-4" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', fontWeight: 700, color: '#fff' }}>
              {locale === 'vi' ? 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX'
                : locale === 'en' ? 'LMX Green Alliance Joint Stock Company'
                : 'LMX绿色联盟股份公司'}
            </h1>
            {settings?.tagline && (
              <p className="max-w-2xl text-base leading-relaxed" style={{ color: '#defbbc' }}>
                {settings.tagline}
              </p>
            )}
          </AnimateIn>
        </div>
      </section>

      {/* ── Achievements strip ───────────────────── */}
      <section style={{ background: '#013d27' }}>
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {achievements.map((a, idx) => {
              const desc = (a as any)[`desc${L}`];
              return (
                <AnimateIn key={idx} delay={idx * 0.08}>
                  <div className="py-8 px-4 text-center border-r last:border-0" style={{ borderColor: '#013d27' }}>
                    <p className="text-3xl font-bold text-white mb-1">{a.value}</p>
                    <p className="text-xs" style={{ color: '#defbbc' }}>{desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Giới thiệu công ty ────────────────────── */}
      {settings && (
        <section className="section-padding" id="intro">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimateIn from="left">
                <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#015231' }}>
                  {locale === 'vi' ? 'Giới thiệu' : locale === 'en' ? 'Introduction' : '简介'}
                </p>
                <h2 className="mb-6" style={{ color: '#015231' }}>
                  {locale === 'vi' ? 'Giới thiệu công ty' : locale === 'en' ? 'Company Introduction' : '公司简介'}
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: '#374151' }}>
                  {((settings as any)[`aboutIntro${L}`] as string)
                    .split('\n\n')
                    .filter(Boolean)
                    .map((para, idx) => <p key={idx}>{para}</p>)}
                </div>
              </AnimateIn>

              <AnimateIn delay={0.1} from="right">
                <div className="relative h-[320px] md:h-[420px] w-full" style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(1, 82, 49, 0.06)' }}>
                  <Image
                    src="/images/about/about-hero.webp"
                    alt={locale === 'vi' ? 'Trụ sở và hoạt động của Công ty Cổ phần Liên Minh Xanh LMX'
                      : locale === 'en' ? 'LMX Green Alliance JSC headquarters and operations'
                      : 'LMX绿色联盟股份公司总部及运营'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>
      )}

      {/* ── Thư ngỏ ──────────────────────────────── */}
      {settings && (
        <section className="section-padding" id="open-letter" style={{ background: '#f8fbf2' }}>
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimateIn from="left">
                <div className="relative h-[320px] md:h-[420px] w-full" style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(1, 82, 49, 0.06)' }}>
                  <Image
                    src="/images/about/about-letter-v2.webp"
                    alt={locale === 'vi' ? 'Nhà máy và cơ sở hạ tầng công nghiệp, minh họa định hướng phát triển bền vững của LMX'
                      : locale === 'en' ? 'Industrial plant and infrastructure, illustrating LMX’s sustainable development orientation'
                      : '工业厂房与基础设施，展现LMX的可持续发展方向'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </AnimateIn>

              <AnimateIn delay={0.1} from="right">
                <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#015231' }}>
                  {locale === 'vi' ? 'Thư ngỏ' : locale === 'en' ? 'Open Letter' : '致辞'}
                </p>
                <h2 className="mb-6" style={{ color: '#015231' }}>
                  {(settings as any)[`aboutLetterTitle${L}`]}
                </h2>
                <div className="space-y-4 text-base leading-relaxed" style={{ color: '#374151' }}>
                  {((settings as any)[`aboutLetter${L}`] as string)
                    .split('\n\n')
                    .filter(Boolean)
                    .map((block, idx) => {
                      const lines = block.split('\n').filter(Boolean);
                      const listStart = lines.findIndex((line) => line.startsWith('- '));
                      if (listStart === -1) {
                        return <p key={idx}>{block}</p>;
                      }
                      const intro = lines.slice(0, listStart).join(' ');
                      const items = lines.slice(listStart).map((line) => line.replace(/^- /, ''));
                      return (
                        <div key={idx}>
                          {intro && <p className="mb-2">{intro}</p>}
                          <ul className="space-y-1.5 list-disc list-inside">
                            {items.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-8 pt-6 border-t inline-block" style={{ borderColor: '#defbbc' }}>
                  <p className="font-semibold" style={{ color: '#015231' }}>{settings.name}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{(settings as any)[`aboutLetterSigner${L}`]}</p>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>
      )}

      {/* ── Core Values ──────────────────────────── */}
      <section className="section-padding" id="values">
        <div className="container-max">
          <AnimateIn>
            <h2 className="mb-10">{t('values.title')}</h2>
          </AnimateIn>
          <div className="flex flex-col md:flex-row gap-4 w-full h-[450px]">
            {coreValues.map((v, idx) => {
              const Icon = v.icon;
              const title = (v as any)[`title${L}`];
              const desc  = (v as any)[`desc${L}`];
              const image = v.image;
              return (
                <AnimateIn
                  key={title}
                  delay={idx * 0.07}
                  className="expanding-card h-[220px] md:h-full"
                >
                  <div
                    className="relative w-full h-full overflow-hidden group"
                    style={{ borderRadius: '4px', boxShadow: '0 8px 24px rgba(1, 82, 49, 0.06)' }}
                  >
                    {/* Background Image */}
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />

                    {/* Dark Gradient Overlay (no solid color block, just subtle shading for text contrast) */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(1, 82, 49, 0) 0%, rgba(1, 82, 49, 0.3) 50%, rgba(1, 44, 26, 0.9) 100%)',
                        zIndex: 1
                      }}
                      aria-hidden
                    />

                    {/* Content */}
                    <div className="absolute inset-0 p-5 z-10 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 flex items-center justify-center bg-white/20 backdrop-blur-md" style={{ borderRadius: '4px' }}>
                          <Icon size={18} className="text-[#8ec63f]" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          {title}
                        </h3>
                      </div>

                      {/* Description - expanded on hover */}
                      <p className="text-xs text-white/90 leading-relaxed max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pháp lý công ty ──────────────────────── */}
      <section className="section-padding" id="legal-documents" style={{ background: '#f8fbf2' }}>
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Pháp lý' : locale === 'en' ? 'Legal' : '法律'}
            </p>
            <h2 className="mb-10" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Pháp lý công ty'
                : locale === 'en' ? 'Company Legal Documents'
                : '公司法律文件'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Info card */}
            <AnimateIn from="left" className="lg:col-span-2">
              <div className="p-6 bg-white border h-full" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: '#f8fbf2', borderRadius: '4px' }}>
                    <FileText size={22} style={{ color: '#8ec63f' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: '#015231', fontSize: '1rem' }}>
                      {locale === 'vi' ? 'Giấy chứng nhận đăng ký doanh nghiệp'
                        : locale === 'en' ? 'Business Registration Certificate'
                        : '营业执照'}
                    </h3>
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      {locale === 'vi' ? 'Sở Tài Chính TP. HCM — Phòng Đăng Ký Kinh Doanh'
                        : locale === 'en' ? 'Ho Chi Minh City Dept. of Finance — Business Registration Division'
                        : '胡志明市财政局 — 工商登记处'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    {
                      label: locale === 'vi' ? 'Tên tiếng Việt' : locale === 'en' ? 'Vietnamese name' : '越文名称',
                      value: 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX',
                    },
                    {
                      label: locale === 'vi' ? 'Tên tiếng Anh' : locale === 'en' ? 'English name' : '英文名称',
                      value: 'LMX GREEN ALLIANCE JOINT STOCK COMPANY',
                    },
                    {
                      label: locale === 'vi' ? 'Tên viết tắt' : locale === 'en' ? 'Abbreviation' : '简称',
                      value: 'LMX ALLIANCE JSC',
                    },
                    {
                      label: locale === 'vi' ? 'Mã số DN' : locale === 'en' ? 'Business ID' : '统一社会信用代码',
                      value: '0319271621',
                    },
                    {
                      label: locale === 'vi' ? 'Đăng ký lần đầu' : locale === 'en' ? 'First registration' : '首次注册',
                      value: locale === 'vi' ? 'Ngày 20 tháng 11 năm 2025'
                        : locale === 'en' ? '20 November 2025'
                        : '2025年11月20日',
                    },
                    {
                      label: locale === 'vi' ? 'Thay đổi lần 1' : locale === 'en' ? '1st amendment' : '第1次变更',
                      value: locale === 'vi' ? 'Ngày 17 tháng 04 năm 2026'
                        : locale === 'en' ? '17 April 2026'
                        : '2026年4月17日',
                    },
                    {
                      label: locale === 'vi' ? 'Vốn điều lệ' : locale === 'en' ? 'Charter capital' : '注册资本',
                      value: '5.000.000.000 VNĐ',
                    },
                    {
                      label: locale === 'vi' ? 'Trụ sở' : locale === 'en' ? 'Headquarters' : '总部地址',
                      value: 'Số 104 Đường Lò Lu, P. Long Phước, TP. HCM',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <span className="font-medium flex-shrink-0 text-xs" style={{ color: '#6B7280', minWidth: '7.5rem' }}>{label}</span>
                      <span className="font-medium text-xs" style={{ color: '#015231' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/docs/giay-phep-dkdn.pdf"
                  download
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: '#015231' }}
                >
                  <FileText size={14} />
                  {locale === 'vi' ? 'Tải xuống PDF' : locale === 'en' ? 'Download PDF' : '下载PDF'}
                </a>
              </div>
            </AnimateIn>

            {/* Certificate image — click to open full PDF */}
            <AnimateIn delay={0.1} from="right" className="lg:col-span-3">
              <a
                href="/docs/giay-phep-dkdn.pdf"
                target="_blank"
                rel="noopener noreferrer"
                title={locale === 'vi' ? 'Nhấp để xem giấy phép đầy đủ' : locale === 'en' ? 'Click to view full certificate' : '点击查看完整证书'}
                className="block group"
                style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #defbbc', display: 'block', position: 'relative' }}
              >
                <Image
                  src="/docs/giay-phep-dkdn.png"
                  alt="Giấy chứng nhận đăng ký doanh nghiệp — LMX Alliance"
                  width={784}
                  height={1123}
                  className="w-full block transition-opacity duration-200 group-hover:opacity-90"
                />
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(6,78,59,0.85)' }}
                >
                  <div className="text-center text-white">
                    <FileText size={32} className="mx-auto mb-2" strokeWidth={1.5} />
                    <p className="text-sm font-medium">
                      {locale === 'vi' ? 'Xem PDF đầy đủ' : locale === 'en' ? 'View full PDF' : '查看完整PDF'}
                    </p>
                  </div>
                </div>
              </a>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Liên kết Huê Phương VN ───────────────── */}
      {huePhuongPartner && (
      <section className="section-padding">
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Đối tác chiến lược' : locale === 'en' ? 'Strategic Partner' : '战略合作伙伴'}
            </p>
            <h2 className="mb-10" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Liên kết giữa LMX và Huê Phương VN'
                : locale === 'en' ? 'LMX & Huê Phương VN Partnership'
                : 'LMX与Huê Phương VN合作关系'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <AnimateIn from="left">
              <div className="space-y-4 text-base leading-relaxed" style={{ color: '#374151' }}>
                <p>{(huePhuongPartner as any)[`desc${L}`]}</p>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1} from="right">
              <div className="p-6 border" style={{ borderColor: '#defbbc', borderRadius: '4px', background: '#FAFAFA' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: '#f8fbf2', borderRadius: '4px' }}>
                    <Link2 size={18} style={{ color: '#8ec63f' }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: '#015231', fontSize: '1rem' }}>
                    {(huePhuongPartner as any)[`name${L}`]}
                  </h3>
                </div>
                <ul className="space-y-3 text-sm" style={{ color: '#374151' }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#8ec63f' }} />
                    <span>
                      {locale === 'vi'
                        ? 'Xử lý và tái chế chất thải công nghiệp theo giấy phép của Bộ Nông nghiệp và Môi trường'
                        : locale === 'en'
                        ? 'Processing and recycling industrial waste under permits from the Ministry of Agriculture and Environment'
                        : '根据农业和环境部许可证处理和回收工业废物'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#8ec63f' }} />
                    <span>
                      {locale === 'vi'
                        ? 'Tư vấn pháp lý và kỹ thuật về quản lý chất thải nguy hại'
                        : locale === 'en'
                        ? 'Legal and technical consulting on hazardous waste management'
                        : '危险废物管理的法律和技术咨询'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#8ec63f' }} />
                    <span>
                      {locale === 'vi'
                        ? 'Góp phần nâng cao hiệu quả quản lý chất thải an toàn và bền vững'
                        : locale === 'en'
                        ? 'Contributing to improving safe and sustainable waste management effectiveness'
                        : '有助于提高安全和可持续废物管理的有效性'}
                    </span>
                  </li>
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
      )}

      {/* ── Leadership ───────────────────────────── */}
      {leaders.length > 0 && (() => {
        const isTier1 = (l: typeof leaders[0]) => {
          const posVI = (l.positionVI || '').toLowerCase();
          const posEN = (l.positionEN || '').toLowerCase();
          
          if (posVI.includes('phó') || posEN.includes('vice') || posEN.includes('deputy')) {
            return false;
          }
          
          return (
            posVI.includes('chủ tịch') ||
            posVI.includes('tổng giám đốc') ||
            posEN.includes('chairman') ||
            posEN.includes('ceo') ||
            posEN.includes('general director') ||
            posEN.includes('managing director')
          );
        };

        const tier1Leaders = leaders.filter(isTier1);
        const tier2Leaders = leaders.filter(l => !isTier1(l));

        return (
          <section className="section-padding" id="leadership" style={{ background: '#f8fbf2' }}>
            <div className="container-max">
              <AnimateIn>
                <h2 className="mb-12 text-center text-[#015231]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  {t('leadership.title')}
                </h2>
              </AnimateIn>

              <div className="space-y-12">
                {/* Chairman & CEO Row */}
                {tier1Leaders.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-6">
                    {tier1Leaders.map((leader, idx) => {
                      const name     = (leader as any)[`name${L}`];
                      const position = (leader as any)[`position${L}`];
                      return (
                        <AnimateIn key={leader.id} delay={idx * 0.08} className="w-full sm:w-[220px] flex-shrink-0">
                          <div className="card-lift border bg-white overflow-hidden group" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                            <div className="aspect-[3/4] overflow-hidden" style={{ background: '#f8fbf2', position: 'relative' }}>
                              {leader.photo ? (
                                <Image
                                  src={leader.photo}
                                  alt={name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, 220px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users size={48} strokeWidth={1} style={{ color: '#defbbc' }} />
                                </div>
                              )}
                            </div>
                            <div className="p-4 text-center" style={{ borderTop: '3px solid #8ec63f' }}>
                              <p className="font-semibold text-center text-sm">{name}</p>
                              <p className="text-xs text-center mt-1" style={{ color: '#6B7280' }}>{position}</p>
                            </div>
                          </div>
                        </AnimateIn>
                      );
                    })}
                  </div>
                )}

                {/* Other Leaders Row */}
                {tier2Leaders.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-6">
                    {tier2Leaders.map((leader, idx) => {
                      const name     = (leader as any)[`name${L}`];
                      const position = (leader as any)[`position${L}`];
                      return (
                        <AnimateIn key={leader.id} delay={idx * 0.08} className="w-full sm:w-[220px] flex-shrink-0">
                          <div className="card-lift border bg-white overflow-hidden group" style={{ borderColor: '#defbbc', borderRadius: '4px' }}>
                            <div className="aspect-[3/4] overflow-hidden" style={{ background: '#f8fbf2', position: 'relative' }}>
                              {leader.photo ? (
                                <Image
                                  src={leader.photo}
                                  alt={name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, 220px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users size={48} strokeWidth={1} style={{ color: '#defbbc' }} />
                                </div>
                              )}
                            </div>
                            <div className="p-4 text-center" style={{ borderTop: '3px solid #8ec63f' }}>
                              <p className="font-semibold text-center text-sm">{name}</p>
                              <p className="text-xs text-center mt-1" style={{ color: '#6B7280' }}>{position}</p>
                            </div>
                          </div>
                        </AnimateIn>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Company Info ─────────────────────────── */}
      {settings && (
        <section className="section-padding">
          <div className="container-max">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#015231' }}>
                {locale === 'vi' ? 'Thông tin liên hệ' : locale === 'en' ? 'Contact Info' : '联系信息'}
              </p>
              <h2 className="mb-10" style={{ color: '#015231' }}>
                {settings.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
                    style={{ background: '#f8fbf2', color: '#015231', border: '1px solid #defbbc', borderRadius: '2px' }}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#8ec63f' }} />
                    {locale === 'vi' ? 'Đang hoạt động' : locale === 'en' ? 'Active' : '运营中'}
                  </div>
                </div>
                <div className="p-6 border" style={{ borderColor: '#defbbc', borderRadius: '4px', background: '#FAFAFA' }}>
                  <div className="space-y-5">
                    {[
                      { label: locale === 'vi' ? 'Địa chỉ' : locale === 'en' ? 'Address' : '地址', value: settings.address },
                      { label: locale === 'vi' ? 'Điện thoại' : locale === 'en' ? 'Phone' : '电话', value: settings.phone },
                      { label: 'Email', value: settings.email },
                      { label: 'Website', value: settings.website },
                    ].map(({ label, value }) => value ? (
                      <div key={label} className="flex gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider flex-shrink-0 pt-0.5" style={{ color: '#015231', width: '5rem' }}>
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
