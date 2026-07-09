import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Building2, Truck, Recycle, Leaf, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';
import Image from 'next/image';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Lĩnh vực hoạt động',
    en: 'Business Segments',
    zh: '业务领域',
  };
  const descs: Record<string, string> = {
    vi: 'LMX Alliance hoạt động trong 3 lĩnh vực chiến lược: Logistics & Xuất nhập khẩu, Xây lắp công trình, Thu mua phế liệu & Xử lý chất thải.',
    en: 'LMX Alliance operates in 3 strategic segments: Logistics & Import-Export, Construction, Scrap Procurement & Waste Management.',
    zh: 'LMX Alliance在3个战略领域运营：物流与进出口、建筑、废料采购与废物处理。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/business-segments`,
    alternates: {
      vi: '/vi/business-segments',
      en: '/en/business-segments',
      zh: '/zh/business-segments',
    },
  });
}

const SECTOR_ICONS: Record<string, typeof Truck> = {
  'logistics-xuat-nhap-khau': Truck,
  'xay-lap-cong-trinh': Building2,
  'phe-lieu-xu-ly-chat-thai': Recycle,
};
const SECTOR_COLORS: Record<string, string> = {
  'logistics-xuat-nhap-khau': '#015231',
  'xay-lap-cong-trinh': '#8ec63f',
  'phe-lieu-xu-ly-chat-thai': '#013d27',
};
const SECTOR_BG: Record<string, string> = {
  'logistics-xuat-nhap-khau': '#f8fbf2',
  'xay-lap-cong-trinh': '#015231',
  'phe-lieu-xu-ly-chat-thai': '#f8fbf2',
};
const SECTOR_HIGHLIGHTS: Record<string, Record<string, string[]>> = {
  vi: {
    'logistics-xuat-nhap-khau': ['Xuất nhập khẩu đa quốc gia', 'Xe tải 2–35 tấn', 'Thông quan 24/7', 'Phủ sóng toàn quốc'],
    'xay-lap-cong-trinh': ['Dân dụng & Công nghiệp', 'Nhà kho – Văn phòng', 'Tiêu chuẩn kỹ thuật TCVN', 'Nhiều công trình đã bàn giao'],
    'phe-lieu-xu-ly-chat-thai': ['Kim loại – Nhựa – Giấy', 'Giấy phép Bộ NN&MT', 'Tuân thủ quy định môi trường', 'Hợp tác Huê Phương VN'],
  },
  en: {
    'logistics-xuat-nhap-khau': ['Multinational import-export', '2–35 ton trucks', '24/7 customs', 'Nationwide coverage'],
    'xay-lap-cong-trinh': ['Civil & Industrial', 'Warehouses – Offices', 'TCVN technical standards', 'Multiple projects delivered'],
    'phe-lieu-xu-ly-chat-thai': ['Metal – Plastic – Paper', 'MONRE licensed', 'Environmental compliance', 'Huê Phương VN partner'],
  },
  zh: {
    'logistics-xuat-nhap-khau': ['跨国进出口', '2-35吨卡车', '24/7清关', '覆盖全国'],
    'xay-lap-cong-trinh': ['民用与工业', '仓库-办公室', '符合TCVN技术标准', '多个项目已交付'],
    'phe-lieu-xu-ly-chat-thai': ['金属-塑料-纸张', '获MONRE许可', '符合环保法规', 'Huê Phương VN合作'],
  },
};

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'sectors' });

  const sectors = await prisma.businessSector.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { orderIndex: 'asc' },
  });

  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
  const highlights = SECTOR_HIGHLIGHTS[locale] ?? SECTOR_HIGHLIGHTS.vi;

  return (
    <>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 flex items-center" style={{ background: 'var(--color-primary-dark)', minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157484/lmx-migration/cowrcqhaqvj6jkruhpfj.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.2) 100%)' }}
          aria-hidden
        />
        <LeafDecor variant="branch" count={8} color="#78d750" />
        <div className="container-max relative z-10 w-full">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#78d750' }}>
              LMX Alliance
            </p>
            <h1 className="mb-4 text-white" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', fontWeight: 700 }}>
              {t('title')}
            </h1>
            <p className="max-w-xl text-base leading-relaxed" style={{ color: '#defbbc' }}>
              {t('subtitle')}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Intro strip ─────────────────────────── */}
      <section className="py-10 border-b" style={{ borderColor: '#defbbc', background: '#f8fbf2' }}>
        <div className="container-max flex flex-wrap gap-8 justify-center">
          {(['Xanh – Sạch – Bền vững', '3 lĩnh vực chiến lược', 'Hoạt động toàn quốc'].map((tag, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#8ec63f' }} />
              <span className="text-sm font-medium" style={{ color: '#015231' }}>{tag}</span>
            </div>
          )))}
        </div>
      </section>

      {/* ── Sector cards ─────────────────────────── */}
      <section className="section-padding">
        <div className="container-max">
          <div className="flex flex-col gap-16 lg:gap-8">
            {sectors.map((sector, idx) => {
              const name    = (sector as any)[`name${L}`];
              const summary = (sector as any)[`summary${L}`];
              const Icon = SECTOR_ICONS[sector.slug] ?? Leaf;
              const tags = highlights[sector.slug] ?? [];
              const isEven = idx % 2 === 0;
              const localBanners: Record<string, string> = {
                'logistics-xuat-nhap-khau': '/images/about/sector-logistics.webp',
                'phe-lieu-xu-ly-chat-thai': '/images/about/sector-recycling.webp',
              };
              const bannerSrc = localBanners[sector.slug] || sector.banner;

              return (
                <AnimateIn key={sector.id} delay={0.1} from={isEven ? 'left' : 'right'}>
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}>
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative aspect-[4/3] overflow-hidden" style={{ borderRadius: '4px', boxShadow: '0 10px 40px rgba(1, 82, 49, 0.08)' }}>
                      {bannerSrc && (
                        <Image
                          src={bannerSrc}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      )}
                    </div>
                    
                    {/* Text Side */}
                    <div className="w-full lg:w-1/2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-[4px] flex items-center justify-center bg-[#f8fbf2]">
                          <Icon size={24} style={{ color: '#8ec63f' }} />
                        </div>
                        <span className="text-sm font-bold px-4 py-1.5 rounded-full" style={{ color: '#015231', background: '#defbbc' }}>
                          0{idx + 1}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl lg:text-3xl font-extrabold mb-5" style={{ color: '#015231', fontFamily: 'var(--font-display)' }}>
                        {name}
                      </h2>
                      
                      <p className="text-base leading-relaxed mb-8" style={{ color: '#4B5563' }}>
                        {summary}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#374151' }}>
                            <CheckCircle2 size={16} style={{ color: '#8ec63f', flexShrink: 0 }} />
                            {tag}
                          </div>
                        ))}
                      </div>
                      
                      <Link
                        href={`/${locale}/business-segments/${sector.slug}`}
                        className="inline-flex items-center gap-2 px-7 py-3 text-sm font-medium text-white transition-all hover:gap-3"
                        style={{ background: 'var(--color-primary-dark)', borderRadius: '4px' }}
                      >
                        {locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'View Details' : '查看详情'}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────── */}
      <section className="section-padding relative overflow-hidden" style={{ background: '#f8fbf2', borderTop: '3px solid #8ec63f' }}>
        <LeafDecor variant="eco" count={8} color="#8ec63f" />
        <div className="container-max text-center relative z-10">
          <AnimateIn>
            <Leaf size={36} style={{ color: '#8ec63f', margin: '0 auto 1rem' }} strokeWidth={1.5} />
            <h2 className="mb-3" style={{ color: '#015231' }}>
              {locale === 'vi' ? 'Cần tư vấn thêm?' : locale === 'en' ? 'Need more information?' : '需要更多信息？'}
            </h2>
            <p className="mb-7 max-w-md mx-auto text-sm" style={{ color: '#374151' }}>
              {locale === 'vi'
                ? 'Đội ngũ chuyên gia LMX Alliance sẵn sàng lắng nghe và đưa ra giải pháp phù hợp nhất.'
                : locale === 'en'
                ? 'Our LMX Alliance experts are ready to listen and offer the best solution.'
                : '我们的LMX Alliance专家随时准备倾听并提供最佳解决方案。'}
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
