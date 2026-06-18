import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Target, Eye, Shield, Users, TrendingUp, Leaf, Award, CheckCircle2, FileText, Link2 } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';

const coreValues = [
  {
    icon: Shield,
    titleVI: 'Chính trực', titleEN: 'Integrity', titleZH: '诚信',
    descVI: 'Trung thực và minh bạch trong mọi hoạt động kinh doanh, tuân thủ nghiêm ngặt quy định pháp luật.',
    descEN: 'Honest and transparent in all business activities, strictly complying with legal regulations.',
    descZH: '在所有商业活动中诚实透明，严格遵守法律规定。',
  },
  {
    icon: Users,
    titleVI: 'Hợp tác', titleEN: 'Collaboration', titleZH: '合作',
    descVI: 'Xây dựng quan hệ đối tác bền vững với khách hàng, đối tác và cộng đồng.',
    descEN: 'Building sustainable partnerships with clients, partners and the community.',
    descZH: '与客户、合作伙伴和社区建立可持续的合作关系。',
  },
  {
    icon: TrendingUp,
    titleVI: 'Hiệu quả', titleEN: 'Efficiency', titleZH: '高效',
    descVI: 'Cung cấp giải pháp toàn diện, hiệu quả, tối ưu chi phí cho khách hàng và đối tác.',
    descEN: 'Providing comprehensive, efficient and cost-effective solutions for clients and partners.',
    descZH: '为客户和合作伙伴提供全面、高效、具有成本效益的解决方案。',
  },
  {
    icon: Leaf,
    titleVI: 'Bền vững', titleEN: 'Sustainability', titleZH: '可持续',
    descVI: 'Phát triển kinh doanh gắn liền với bảo vệ môi trường và phát triển kinh tế xanh.',
    descEN: 'Business development aligned with environmental protection and green economy development.',
    descZH: '业务发展与环境保护和绿色经济发展相结合。',
  },
];

const sectors = [
  {
    no: '01',
    titleVI: 'Xuất nhập khẩu & Logistics',
    titleEN: 'Import-Export & Logistics',
    titleZH: '进出口与物流',
    descVI: 'Giao nhận và vận tải hàng hóa xuất nhập khẩu, tối ưu chuỗi cung ứng.',
    descEN: 'Freight forwarding and transport for import-export goods, supply chain optimization.',
    descZH: '进出口货物货运代理和运输，供应链优化。',
  },
  {
    no: '02',
    titleVI: 'Xây dựng công nghiệp',
    titleEN: 'Industrial Construction',
    titleZH: '工业建设',
    descVI: 'Thi công xây lắp công trình dân dụng và công nghiệp theo tiêu chuẩn kỹ thuật cao.',
    descEN: 'Construction of civil and industrial works to high technical standards.',
    descZH: '按照高技术标准建造民用和工业建筑。',
  },
  {
    no: '03',
    titleVI: 'Thu mua phế liệu',
    titleEN: 'Scrap Procurement',
    titleZH: '废料采购',
    descVI: 'Thu mua và kinh doanh phế liệu, tái chế vật liệu góp phần kinh tế tuần hoàn.',
    descEN: 'Purchasing and trading scrap materials, recycling to contribute to the circular economy.',
    descZH: '采购和销售废料，回收材料以促进循环经济。',
  },
  {
    no: '04',
    titleVI: 'Xử lý chất thải nguy hại',
    titleEN: 'Hazardous Waste Management',
    titleZH: '危险废物处理',
    descVI: 'Liên kết với Huê Phương VN xử lý chất thải nguy hại đúng quy định pháp luật và tiêu chuẩn môi trường.',
    descEN: 'Partnering with Huê Phương VN to manage hazardous waste in compliance with legal and environmental standards.',
    descZH: '与Huê Phương VN合作，按照法律和环境标准处理危险废物。',
  },
];

const achievements = [
  { icon: Award,         value: '10+',  descVI: 'Năm kinh nghiệm',       descEN: 'Years of experience',    descZH: '年经验' },
  { icon: CheckCircle2,  value: '100+', descVI: 'Dự án hoàn thành',       descEN: 'Projects completed',     descZH: '完成项目' },
  { icon: Users,         value: '200+', descVI: 'Nhân sự chuyên nghiệp',  descEN: 'Professional staff',     descZH: '专业员工' },
  { icon: Target,        value: '50+',  descVI: 'Đối tác chiến lược',     descEN: 'Strategic partners',     descZH: '战略合作伙伴' },
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
              {locale === 'vi' ? 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX'
                : locale === 'en' ? 'LMX Green Alliance Joint Stock Company'
                : 'LMX绿色联盟股份公司'}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed" style={{ color: '#a7f3d0' }}>
              {locale === 'vi'
                ? 'Trân trọng cảm ơn Quý Khách hàng và Quý Đối tác đã tin tưởng và đồng hành cùng Công ty. Sự hợp tác của Quý vị là nền tảng để LMX không ngừng nâng cao chất lượng dịch vụ và phát triển các giải pháp an toàn, hiệu quả và bền vững.'
                : locale === 'en'
                ? 'We sincerely thank our clients and partners for their trust and companionship. Your cooperation is the foundation for LMX to continuously improve service quality and develop safe, effective, and sustainable solutions.'
                : '衷心感谢贵客户和合作伙伴的信任与陪伴。您的合作是LMX不断提升服务质量、发展安全、高效、可持续解决方案的基础。'}
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
                    <p className="text-3xl font-bold text-white mb-1">{a.value}</p>
                    <p className="text-xs" style={{ color: '#a7f3d0' }}>{desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Thư ngỏ ──────────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#047857' }}>
                {locale === 'vi' ? 'Thư ngỏ' : locale === 'en' ? 'Open Letter' : '致辞'}
              </p>
              <h2 className="mb-6" style={{ color: '#064e3b' }}>
                {locale === 'vi' ? 'Kính gửi Quý Khách hàng & Đối tác'
                  : locale === 'en' ? 'Dear Clients & Partners'
                  : '尊敬的客户与合作伙伴'}
              </h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: '#374151' }}>
                <p>
                  {locale === 'vi'
                    ? 'Trong bối cảnh yêu cầu về quản lý môi trường, an toàn chất thải và phát triển kinh tế xanh ngày càng được chú trọng, Công ty Cổ phần Liên Minh Xanh (LMX) được thành lập với định hướng trở thành doanh nghiệp đa lĩnh vực, cung cấp giải pháp toàn diện – hiệu quả – minh bạch, tuân thủ nghiêm ngặt các quy định pháp luật, góp phần bảo vệ môi trường và tạo giá trị bền vững cho cộng đồng.'
                    : locale === 'en'
                    ? 'In the context of increasing demands for environmental management, waste safety, and green economic development, LMX Green Alliance Joint Stock Company was founded with the mission of becoming a multi-sector enterprise providing comprehensive, efficient, and transparent solutions — strictly complying with legal regulations, contributing to environmental protection and creating sustainable value for the community.'
                    : '在环境管理、废物安全和绿色经济发展要求日益受到重视的背景下，LMX绿色联盟股份公司成立，旨在成为多元化企业，提供全面、高效、透明的解决方案，严格遵守法律法规，为环境保护和社区可持续发展做出贡献。'}
                </p>
                <p>
                  {locale === 'vi'
                    ? 'Với định hướng phát triển bền vững, LMX cam kết mang đến giải pháp dịch vụ đồng bộ, an toàn và hiệu quả, đáp ứng tối đa nhu cầu của khách hàng và đối tác, đồng thời đóng góp tích cực vào mục tiêu phát triển kinh tế xanh và bảo vệ môi trường.'
                    : locale === 'en'
                    ? 'With a sustainable development orientation, LMX is committed to delivering synchronous, safe and effective service solutions, maximally meeting the needs of clients and partners, while positively contributing to the green economic development and environmental protection goals.'
                    : '秉持可持续发展方向，LMX致力于提供同步、安全、高效的服务解决方案，最大程度满足客户和合作伙伴的需求，同时积极为绿色经济发展和环境保护目标做出贡献。'}
                </p>
              </div>
            </AnimateIn>

            {/* Business sectors */}
            <AnimateIn delay={0.1}>
              <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: '#6B7280' }}>
                {locale === 'vi' ? 'Lĩnh vực hoạt động chính'
                  : locale === 'en' ? 'Core Business Sectors'
                  : '主要业务领域'}
              </p>
              <div className="space-y-3">
                {sectors.map((s) => {
                  const title = (s as any)[`title${L}`];
                  const desc  = (s as any)[`desc${L}`];
                  return (
                    <div key={s.no} className="flex gap-4 p-4 border" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                      <span className="text-sm font-bold flex-shrink-0 mt-0.5" style={{ color: '#047857' }}>{s.no}</span>
                      <div>
                        <p className="font-semibold text-sm mb-0.5" style={{ color: '#064e3b' }}>{title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────── */}
      <section className="section-padding" style={{ background: '#F5F6F8' }}>
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>
              {locale === 'vi' ? 'Định hướng phát triển' : locale === 'en' ? 'Our Direction' : '发展方向'}
            </p>
            <h2 className="mb-10">{t('mission.title')} &amp; {t('vision.title')}</h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimateIn delay={0.05}>
              <div className="p-8 border h-full group card-lift bg-white" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-5" style={{ background: '#f0fdf4', borderRadius: '4px' }}>
                  <Target size={22} style={{ color: '#047857' }} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{t('mission.title')}</h3>
                <p className="leading-relaxed" style={{ color: '#6B7280' }}>
                  {locale === 'vi'
                    ? 'Cung cấp giải pháp toàn diện – hiệu quả – minh bạch trong các lĩnh vực logistics, xây dựng, thu mua phế liệu và xử lý chất thải, tuân thủ nghiêm ngặt các quy định pháp luật, góp phần bảo vệ môi trường và tạo giá trị bền vững cho cộng đồng.'
                    : locale === 'en'
                    ? 'Providing comprehensive, efficient and transparent solutions in logistics, construction, scrap procurement, and waste management — strictly complying with regulations, protecting the environment and creating sustainable value for the community.'
                    : '在物流、建设、废料采购和废物处理领域提供全面、高效、透明的解决方案，严格遵守法规，保护环境，为社区创造可持续价值。'}
                </p>
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

            <AnimateIn delay={0.1}>
              <div className="p-8 h-full text-white" style={{ background: '#064e3b', borderRadius: '4px' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-5" style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '4px' }}>
                  <Eye size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#fff' }}>{t('vision.title')}</h3>
                <p className="leading-relaxed" style={{ color: '#a7f3d0' }}>
                  {locale === 'vi'
                    ? 'Trở thành doanh nghiệp đa lĩnh vực hàng đầu, dẫn đầu về kinh tế xanh tại Việt Nam — đồng thời là đối tác tin cậy về giải pháp môi trường bền vững trong khu vực Đông Nam Á.'
                    : locale === 'en'
                    ? 'Becoming a leading multi-sector enterprise at the forefront of green economy in Vietnam — and a trusted partner for sustainable environmental solutions in the Southeast Asian region.'
                    : '成为越南绿色经济领域领先的多元化企业，同时成为东南亚地区可持续环境解决方案的可信赖合作伙伴。'}
                </p>
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid #065f46' }}>
                  <ul className="space-y-2">
                    {(locale === 'vi'
                      ? ['Dẫn đầu về kinh tế xanh tại Việt Nam', 'Mở rộng dịch vụ ra khu vực Đông Nam Á', 'Phát triển bền vững và bảo vệ môi trường']
                      : locale === 'en'
                      ? ['Lead green economy in Vietnam', 'Expand services across Southeast Asia', 'Sustainable development & environment']
                      : ['引领越南绿色经济', '在东南亚拓展服务', '可持续发展与环境保护']
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
      <section className="section-padding">
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
                  <div className="card-lift bg-white p-6 border h-full" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: '#f0fdf4', borderRadius: '4px' }}>
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

      {/* ── Pháp lý công ty ──────────────────────── */}
      <section className="section-padding" style={{ background: '#F5F6F8' }}>
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#047857' }}>
              {locale === 'vi' ? 'Pháp lý' : locale === 'en' ? 'Legal' : '法律'}
            </p>
            <h2 className="mb-10" style={{ color: '#064e3b' }}>
              {locale === 'vi' ? 'Pháp lý công ty'
                : locale === 'en' ? 'Company Legal Documents'
                : '公司法律文件'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <AnimateIn>
              <div className="p-6 bg-white border" style={{ borderColor: '#E8E9ED', borderRadius: '4px' }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0" style={{ background: '#f0fdf4', borderRadius: '4px' }}>
                    <FileText size={22} style={{ color: '#047857' }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: '#064e3b' }}>
                      {locale === 'vi' ? 'Giấy chứng nhận đăng ký doanh nghiệp'
                        : locale === 'en' ? 'Business Registration Certificate'
                        : '营业执照'}
                    </h4>
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      {locale === 'vi' ? 'Cấp bởi Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh'
                        : locale === 'en' ? 'Issued by the Department of Planning and Investment of Ho Chi Minh City'
                        : '由胡志明市计划和投资局颁发'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    {
                      label: locale === 'vi' ? 'Tên công ty' : locale === 'en' ? 'Company name' : '公司名称',
                      value: locale === 'vi' ? 'Công ty Cổ phần Liên Minh Xanh LMX'
                        : locale === 'en' ? 'LMX Green Alliance Joint Stock Company'
                        : 'LMX绿色联盟股份公司',
                    },
                    {
                      label: locale === 'vi' ? 'Loại hình' : locale === 'en' ? 'Business type' : '企业类型',
                      value: locale === 'vi' ? 'Công ty cổ phần' : locale === 'en' ? 'Joint Stock Company' : '股份公司',
                    },
                    {
                      label: locale === 'vi' ? 'Trụ sở' : locale === 'en' ? 'Headquarters' : '总部',
                      value: settings?.address || 'TP. Hồ Chí Minh, Việt Nam',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="font-medium flex-shrink-0" style={{ color: '#6B7280', minWidth: '6rem' }}>{label}:</span>
                      <span style={{ color: '#374151' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              {/* Certificate placeholder — replace with actual image when available */}
              <div
                className="flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: '#d1fae5', borderRadius: '4px', minHeight: '220px', background: '#f0fdf4' }}
              >
                <div className="text-center p-8">
                  <FileText size={40} strokeWidth={1} style={{ color: '#a7f3d0', margin: '0 auto 12px' }} />
                  <p className="text-sm font-medium" style={{ color: '#047857' }}>
                    {locale === 'vi' ? 'Giấy ĐKDN' : locale === 'en' ? 'Business Certificate' : '营业执照'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    {locale === 'vi' ? '(Hình ảnh sẽ được cập nhật)'
                      : locale === 'en' ? '(Image to be updated)'
                      : '（图片待更新）'}
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Liên kết Huê Phương VN ───────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#047857' }}>
              {locale === 'vi' ? 'Đối tác chiến lược' : locale === 'en' ? 'Strategic Partner' : '战略合作伙伴'}
            </p>
            <h2 className="mb-10" style={{ color: '#064e3b' }}>
              {locale === 'vi' ? 'Liên kết giữa LMX và Huê Phương VN'
                : locale === 'en' ? 'LMX & Huê Phương VN Partnership'
                : 'LMX与Huê Phương VN合作关系'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <AnimateIn>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: '#374151' }}>
                <p>
                  {locale === 'vi'
                    ? 'Sự liên kết giữa LIÊN MINH XANH LMX và CÔNG TY TNHH MTV MÔI TRƯỜNG XANH HUÊ PHƯƠNG VN được xây dựng nhằm cung cấp giải pháp thu gom, vận chuyển và xử lý chất thải, đặc biệt là chất thải nguy hại, theo đúng quy định pháp luật và tiêu chuẩn môi trường.'
                    : locale === 'en'
                    ? 'The partnership between LMX GREEN ALLIANCE and HUÊ PHƯƠNG VN GREEN ENVIRONMENT CO., LTD. was established to provide waste collection, transportation, and treatment solutions — especially hazardous waste — in full compliance with legal regulations and environmental standards.'
                    : 'LMX绿色联盟与Huê Phương VN绿色环境有限公司之间的合作关系旨在提供废物收集、运输和处理解决方案，特别是危险废物，完全符合法律法规和环境标准。'}
                </p>
                <p>
                  {locale === 'vi'
                    ? 'Thông qua sự phối hợp về nguồn lực và chuyên môn của hai đơn vị, quá trình quản lý và xử lý chất thải được thực hiện an toàn, hiệu quả và bền vững.'
                    : locale === 'en'
                    ? 'Through the coordination of resources and expertise between the two entities, waste management and treatment processes are carried out safely, efficiently, and sustainably.'
                    : '通过两个单位资源和专业知识的协调配合，废物管理和处理过程安全、高效、可持续。'}
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <div className="p-6 border" style={{ borderColor: '#E8E9ED', borderRadius: '4px', background: '#FAFAFA' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: '#f0fdf4', borderRadius: '4px' }}>
                    <Link2 size={18} style={{ color: '#047857' }} />
                  </div>
                  <h4 className="font-semibold" style={{ color: '#064e3b' }}>
                    {locale === 'vi' ? 'Công ty TNHH MTV Môi Trường Xanh Huê Phương VN'
                      : locale === 'en' ? 'Huê Phương VN Green Environment Co., Ltd.'
                      : 'Huê Phương VN绿色环境有限公司'}
                  </h4>
                </div>
                <ul className="space-y-3 text-sm" style={{ color: '#374151' }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#047857' }} />
                    <span>
                      {locale === 'vi'
                        ? 'Xử lý và tái chế chất thải công nghiệp theo giấy phép của Bộ Nông nghiệp và Môi trường'
                        : locale === 'en'
                        ? 'Processing and recycling industrial waste under permits from the Ministry of Agriculture and Environment'
                        : '根据农业和环境部许可证处理和回收工业废物'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#047857' }} />
                    <span>
                      {locale === 'vi'
                        ? 'Tư vấn pháp lý và kỹ thuật về quản lý chất thải nguy hại'
                        : locale === 'en'
                        ? 'Legal and technical consulting on hazardous waste management'
                        : '危险废物管理的法律和技术咨询'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#047857' }} />
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
        <section className="section-padding">
          <div className="container-max">
            <AnimateIn>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#047857' }}>
                {locale === 'vi' ? 'Thông tin liên hệ' : locale === 'en' ? 'Contact Info' : '联系信息'}
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
                <div className="p-6 border" style={{ borderColor: '#E8E9ED', borderRadius: '4px', background: '#FAFAFA' }}>
                  <div className="space-y-5">
                    {[
                      { label: locale === 'vi' ? 'Địa chỉ' : locale === 'en' ? 'Address' : '地址', value: settings.address },
                      { label: locale === 'vi' ? 'Điện thoại' : locale === 'en' ? 'Phone' : '电话', value: settings.phone },
                      { label: 'Email', value: settings.email },
                      { label: 'Website', value: settings.website },
                    ].map(({ label, value }) => value ? (
                      <div key={label} className="flex gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider flex-shrink-0 pt-0.5" style={{ color: '#047857', width: '5rem' }}>
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
