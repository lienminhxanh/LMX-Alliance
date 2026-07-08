import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildMeta } from '@/lib/seo';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';
import { Truck, Building2, Recycle, Leaf, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Hoạt động doanh nghiệp',
    en: 'Business Activities',
    zh: '企业活动',
  };
  const descs: Record<string, string> = {
    vi: 'Tổng quan các hoạt động kinh doanh của LMX Alliance — logistics, xây dựng, phế liệu và phát triển bền vững.',
    en: 'Overview of LMX Alliance business activities — logistics, construction, scrap and sustainable development.',
    zh: 'LMX Alliance业务活动概览 — 物流、建筑、废料和可持续发展。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/activities`,
    alternates: {
      vi: '/vi/activities',
      en: '/en/activities',
      zh: '/zh/activities',
    },
  });
}

const activities = [
  {
    icon: Truck,
    titleVI: 'Logistics & Xuất nhập khẩu',
    titleEN: 'Logistics & Import-Export',
    titleZH: '物流与进出口',
    descVI: 'Cung cấp dịch vụ giao nhận, vận tải, thông quan hàng hóa xuất nhập khẩu. Đội ngũ xe tải đa dạng từ 2–35 tấn, phủ sóng toàn quốc.',
    descEN: 'Freight forwarding, transportation, and customs clearance for import-export goods. Diverse fleet of 2–35 ton trucks covering the whole country.',
    descZH: '提供进出口货物的货运代理、运输和清关服务。多样化的2-35吨卡车车队，覆盖全国。',
    achievements: {
      vi: ['Đội xe đa dạng', 'Phủ sóng toàn quốc', 'Thông quan 24/7'],
      en: ['Diverse vehicle fleet', 'Nationwide coverage', '24/7 customs clearance'],
      zh: ['多样化车队', '覆盖全国', '24/7清关服务'],
    },
  },
  {
    icon: Building2,
    titleVI: 'Thi công xây dựng',
    titleEN: 'Construction Works',
    titleZH: '建筑施工',
    descVI: 'Thi công xây lắp công trình dân dụng và công nghiệp — nhà kho, nhà xưởng, tòa nhà văn phòng theo tiêu chuẩn kỹ thuật cao nhất.',
    descEN: 'Civil and industrial construction — warehouses, factories, office buildings to the highest technical standards.',
    descZH: '民用和工业建筑施工 — 仓库、厂房、办公楼，达到最高技术标准。',
    achievements: {
      vi: ['Nhiều công trình đã bàn giao', 'Đội ngũ kỹ sư chuyên nghiệp', 'Tuân thủ tiêu chuẩn kỹ thuật TCVN'],
      en: ['Multiple projects delivered', 'Professional engineering team', 'TCVN technical standards'],
      zh: ['多个项目已交付', '专业工程师团队', '符合TCVN技术标准'],
    },
  },
  {
    icon: Recycle,
    titleVI: 'Thu mua & Kinh doanh phế liệu',
    titleEN: 'Scrap Procurement & Trading',
    titleZH: '废料采购与贸易',
    descVI: 'Thu mua và kinh doanh các loại phế liệu kim loại, nhựa, giấy. Quy trình 4 bước chuẩn mực, giá cạnh tranh, thanh toán nhanh chóng.',
    descEN: 'Purchasing and trading metal, plastic, paper scrap. 4-step standard process, competitive prices, fast payment.',
    descZH: '采购和销售金属、塑料、纸张废料。4步标准流程，具有竞争力的价格，快速付款。',
    achievements: {
      vi: ['Phế liệu kim loại & nhựa & giấy', 'Giá cạnh tranh — thanh toán ngay', 'Đội xe chuyên dụng thu gom'],
      en: ['Metal & plastic & paper scrap', 'Competitive price — instant payment', 'Specialized collection fleet'],
      zh: ['金属、塑料和纸张废料', '竞争价格 — 即时付款', '专业收集车队'],
    },
  },
  {
    icon: Leaf,
    titleVI: 'Xử lý chất thải nguy hại',
    titleEN: 'Hazardous Waste Management',
    titleZH: '危险废物处理',
    descVI: 'Phối hợp Huê Phương VN xử lý và tái chế chất thải công nghiệp nguy hại theo giấy phép Bộ Nông nghiệp và Môi trường.',
    descEN: 'Partnering with Huê Phương VN to process and recycle industrial hazardous waste under permits from the Ministry of Agriculture and Environment.',
    descZH: '与Huê Phương VN合作，根据农业和环境部许可证处理和回收工业危险废物。',
    achievements: {
      vi: ['Giấy phép xử lý chất thải nguy hại', 'Phối hợp Huê Phương VN', 'Tuân thủ quy định môi trường'],
      en: ['Licensed hazardous waste handler', 'Partnership with Huê Phương VN', 'Environmental compliance'],
      zh: ['持危险废物处理许可证', '与Huê Phương VN合作', '符合环保法规'],
    },
  },
];

const milestones = [
  { year: '2015', vi: 'Thành lập công ty', en: 'Company founded', zh: '公司成立' },
  { year: '2017', vi: 'Mở rộng sang logistics xuất nhập khẩu', en: 'Expand into import-export logistics', zh: '扩展到进出口物流' },
  { year: '2019', vi: 'Ra mắt mảng xây dựng công nghiệp', en: 'Launch industrial construction division', zh: '推出工业建筑部门' },
  { year: '2021', vi: 'Hợp tác chiến lược với Huê Phương VN', en: 'Strategic partnership with Huê Phương VN', zh: '与Huê Phương VN战略合作' },
  { year: '2023', vi: 'Mở rộng quy mô dự án và đối tác', en: 'Scale up projects and partnerships', zh: '扩大项目与合作规模' },
  { year: '2025', vi: 'Thành lập CTCP Liên Minh Xanh LMX', en: 'Establish LMX Green Alliance JSC', zh: '成立LMX绿色联盟股份公司' },
];

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const title = { vi: 'Hoạt động doanh nghiệp', en: 'Business Activities', zh: '企业活动' };
  const subtitle = {
    vi: 'Hành trình phát triển bền vững',
    en: 'Our sustainable development journey',
    zh: '可持续发展历程',
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 flex items-center" style={{ background: '#015231', minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg"
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
        <LeafDecor variant="eco" count={8} color="#78d750" />
        <div className="container-max relative z-10 w-full">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#78d750' }}>
              {locale === 'vi' ? 'LMX Alliance' : locale === 'en' ? 'LMX Alliance' : 'LMX Alliance'}
            </p>
            <h1 className="mb-4" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', fontWeight: 700, color: '#fff' }}>
              {title[locale as keyof typeof title] ?? title.vi}
            </h1>
            <p className="max-w-xl text-base leading-relaxed" style={{ color: '#defbbc' }}>
              {subtitle[locale as keyof typeof subtitle] ?? subtitle.vi}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Activities grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 gap-10">
            {activities.map((act, idx) => {
              const Icon = act.icon;
              const title = (act as any)[`title${L}`];
              const desc  = (act as any)[`desc${L}`];
              const achList: string[] = (act.achievements as any)[locale] ?? act.achievements.vi;
              const isEven = idx % 2 === 0;
              return (
                <AnimateIn key={idx} delay={idx * 0.08} from={isEven ? 'left' : 'right'}>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-0 border overflow-hidden ${isEven ? '' : 'md:flex-row-reverse'}`}
                    style={{ borderColor: '#defbbc', borderRadius: '12px' }}
                  >
                    {/* Color panel */}
                    <div
                      className={`flex flex-col justify-center p-10 relative overflow-hidden ${isEven ? 'md:order-1' : 'md:order-2'}`}
                      style={{ background: idx % 3 === 0 ? '#015231' : idx % 3 === 1 ? '#8ec63f' : '#013d27', minHeight: '280px' }}
                    >
                      <div className="absolute top-4 right-4 opacity-10">
                        <Icon size={80} color="#fff" strokeWidth={1} />
                      </div>
                      <div
                        className="w-14 h-14 flex items-center justify-center mb-5 relative z-10"
                        style={{ background: 'rgba(168,204,40,0.25)', borderRadius: '12px' }}
                      >
                        <Icon size={28} color={idx % 3 === 1 ? '#013d27' : '#78d750'} strokeWidth={1.5} />
                      </div>
                      <h2 className="text-xl font-semibold mb-3 relative z-10" style={{ color: idx % 3 === 1 ? '#013d27' : '#fff' }}>{title}</h2>
                      <ul className="space-y-2 relative z-10">
                        {achList.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: idx % 3 === 1 ? '#013d27' : '#defbbc' }}>
                            <CheckCircle2 size={14} style={{ color: idx % 3 === 1 ? '#013d27' : '#78d750', flexShrink: 0 }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Content panel */}
                    <div
                      className={`flex flex-col justify-center p-10 bg-white ${isEven ? 'md:order-2' : 'md:order-1'}`}
                    >
                      <span
                        className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 text-white"
                        style={{ background: '#015231', borderRadius: '4px' }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-base leading-relaxed mb-6" style={{ color: '#374151' }}>{desc}</p>
                      <Link
                        href={`/${locale}/business-segments`}
                        className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                        style={{ color: '#015231' }}
                      >
                        {locale === 'vi' ? 'Xem lĩnh vực hoạt động' : locale === 'en' ? 'View business segments' : '查看业务领域'}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline / milestones */}
      <section className="section-padding relative overflow-hidden" style={{ background: '#f8fbf2' }}>
        <LeafDecor variant="leaf" count={6} color="#8ec63f" />
        <div className="container-max relative z-10">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Hành trình phát triển' : locale === 'en' ? 'Our journey' : '发展历程'}
            </p>
            <h2 className="mb-12" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Các mốc nổi bật' : locale === 'en' ? 'Key milestones' : '重要里程碑'}
            </h2>
          </AnimateIn>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-px"
              style={{ background: '#defbbc' }}
            />
            <div className="space-y-8">
              {milestones.map((m, idx) => {
                const label = (m as any)[locale] ?? m.vi;
                const isLeft = idx % 2 === 0;
                return (
                  <AnimateIn key={m.year} delay={idx * 0.1} from={isLeft ? 'left' : 'right'}>
                    <div className={`flex items-center gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className={`hidden md:block w-1/2 ${isLeft ? 'text-right pr-12' : 'pl-12'}`}>
                        <p className="font-semibold text-sm" style={{ color: '#374151' }}>{label}</p>
                      </div>
                      {/* Dot */}
                      <div
                        className="relative flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center z-10 ml-0 md:ml-0"
                        style={{ background: '#015231', border: '3px solid #78d750' }}
                      >
                        <span className="text-sm font-bold text-white">{m.year.slice(2)}</span>
                      </div>
                      <div className="flex-1 md:hidden pl-0">
                        <p className="font-semibold text-sm" style={{ color: '#374151' }}>{label}</p>
                      </div>
                      <div className={`hidden md:block w-1/2 ${isLeft ? 'pl-12' : 'text-right pr-12'}`} />
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden" style={{ background: '#f8fbf2', borderTop: '3px solid #8ec63f' }}>
        <LeafDecor variant="mixed" count={8} color="#8ec63f" />
        <div className="container-max text-center relative z-10">
          <AnimateIn>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#015231' }}>
              <Award size={32} style={{ color: '#78d750' }} strokeWidth={1.5} />
            </div>
            <h2 className="mb-4" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Hợp tác cùng LMX Alliance' : locale === 'en' ? 'Partner with LMX Alliance' : '与LMX Alliance合作'}
            </h2>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: '#374151' }}>
              {locale === 'vi'
                ? 'Chúng tôi sẵn sàng tư vấn và đồng hành cùng doanh nghiệp của bạn.'
                : locale === 'en'
                ? 'We are ready to advise and accompany your business.'
                : '我们随时准备为您的业务提供咨询和陪伴。'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="btn-primary"
              style={{ display: 'inline-flex' }}
            >
              {locale === 'vi' ? 'Liên hệ ngay' : locale === 'en' ? 'Contact us' : '立即联系'}
              <ArrowRight size={16} />
            </Link>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
