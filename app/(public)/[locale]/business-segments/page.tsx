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

const SECTOR_ICONS = [Truck, Building2, Recycle, Leaf];
const SECTOR_COLORS = ['#015231', '#8ec63f', '#013d27', '#015231'];
const SECTOR_BG = ['#f8fbf2', '#015231', '#f8fbf2', '#013d27'];
const SECTOR_HIGHLIGHTS: Record<string, string[][]> = {
  vi: [
    ['Xuất nhập khẩu đa quốc gia', 'Xe tải 2–35 tấn', 'Thông quan 24/7', 'Phủ sóng 63 tỉnh'],
    ['Dân dụng & Công nghiệp', 'Nhà kho – Văn phòng', 'Chuẩn TCVN & ISO', '100+ công trình'],
    ['Kim loại – Nhựa – Giấy', 'Giá cạnh tranh', 'Thanh toán ngay', 'Đội xe thu gom'],
    ['Giấy phép Bộ NN&MT', 'Đúng chuẩn ISO 14001', 'Tái chế bền vững', 'Hợp tác Huê Phương VN'],
  ],
  en: [
    ['Multinational import-export', '2–35 ton trucks', '24/7 customs', '63 province coverage'],
    ['Civil & Industrial', 'Warehouses – Offices', 'TCVN & ISO standard', '100+ projects'],
    ['Metal – Plastic – Paper', 'Competitive pricing', 'Instant payment', 'Collection fleet'],
    ['MONRE licensed', 'ISO 14001 compliant', 'Sustainable recycling', 'Huê Phương VN partner'],
  ],
  zh: [
    ['跨国进出口', '2-35吨卡车', '24/7清关', '63省覆盖'],
    ['民用与工业', '仓库-办公室', 'TCVN和ISO标准', '100+项目'],
    ['金属-塑料-纸张', '竞争定价', '即时付款', '收集车队'],
    ['获MONRE许可', '符合ISO 14001', '可持续回收', 'Huê Phương VN合作'],
  ],
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
      <section className="relative overflow-hidden py-24" style={{ background: '#015231' }}>
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
          style={{ background: 'linear-gradient(90deg, rgba(1,82,49,0.92) 0%, rgba(1,82,49,0.72) 60%, rgba(1,82,49,0.5) 100%)' }}
          aria-hidden
        />
        <LeafDecor variant="branch" count={8} color="#78d750" />
        <div className="container-max relative z-10">
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
          <div className="flex flex-col gap-12">
            {sectors.map((sector, idx) => {
              const name    = (sector as any)[`name${L}`];
              const summary = (sector as any)[`summary${L}`];
              const Icon = SECTOR_ICONS[idx % SECTOR_ICONS.length];
              const accentBg = SECTOR_COLORS[idx % SECTOR_COLORS.length];
              const lightBg  = SECTOR_BG[idx % SECTOR_BG.length];
              const tags = highlights[idx] ?? [];
              const isEven = idx % 2 === 0;

              return (
                <AnimateIn key={sector.id} delay={idx * 0.08} from={isEven ? 'left' : 'right'}>
                  <div
                    className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative"
                    style={{ borderRadius: '14px', boxShadow: '0 4px 24px rgba(1,82,49,0.10)' }}
                  >
                    {/* ── Accent panel (alternates side) ── */}
                    <div
                      className={`relative flex flex-col justify-between p-8 lg:p-10 overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                      style={{ background: accentBg, minHeight: '280px' }}
                    >
                      {sector.banner && (
                        <>
                          <Image
                            src={sector.banner}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(180deg, ${accentBg}cc 0%, ${accentBg}e6 100%)` }}
                            aria-hidden
                          />
                        </>
                      )}

                      {/* Big watermark number */}
                      <span
                        className="absolute right-4 bottom-2 font-bold select-none pointer-events-none"
                        style={{ fontSize: '8rem', lineHeight: 1, color: 'rgba(255,255,255,0.06)' }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Eco icon box */}
                      <div className="relative z-10">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                          style={{ background: 'rgba(120,215,80,0.2)' }}
                        >
                          <Icon size={28} color="#78d750" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl lg:text-2xl font-semibold text-white leading-tight mb-3">
                          {name}
                        </h2>
                      </div>

                      {/* Highlight tags */}
                      <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium"
                            style={{ background: 'rgba(255,255,255,0.12)', color: '#defbbc' }}
                          >
                            <CheckCircle2 size={10} style={{ color: '#78d750', flexShrink: 0 }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ── Content panel ────────────────── */}
                    <div
                      className={`flex flex-col justify-between p-8 lg:p-10 bg-white ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                    >
                      {/* Step badge */}
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <span
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ background: '#f8fbf2', color: '#8ec63f', border: '1px solid #defbbc' }}
                          >
                            Lĩnh vực {String(idx + 1).padStart(2, '0')}
                          </span>
                          {/* Small leaf decor */}
                          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                            <path d="M16 2 C10 5, 4 11, 5 18 C6 24, 10 28, 16 30 C22 28, 26 24, 27 18 C28 11, 22 5, 16 2Z" fill="#defbbc"/>
                          </svg>
                        </div>

                        <p className="text-base leading-relaxed mb-6" style={{ color: '#374151' }}>
                          {summary}
                        </p>
                      </div>

                      {/* CTA row */}
                      <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid #f8fbf2' }}>
                        <Link
                          href={`/${locale}/business-segments/${sector.slug}`}
                          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white transition-all bg-[#8ec63f] hover:bg-[#015231] rounded-full"
                          aria-label={`${locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'View Details' : '查看详情'}: ${name}`}
                        >
                          {locale === 'vi' ? 'Xem chi tiết' : locale === 'en' ? 'View Details' : '查看详情'}
                          <ArrowRight size={14} />
                        </Link>
                        <Link
                          href={`/${locale}/contact`}
                          className="text-sm font-medium link-underline"
                          style={{ color: '#8ec63f' }}
                        >
                          {locale === 'vi' ? 'Liên hệ tư vấn' : locale === 'en' ? 'Get a quote' : '获取报价'}
                        </Link>
                      </div>
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
