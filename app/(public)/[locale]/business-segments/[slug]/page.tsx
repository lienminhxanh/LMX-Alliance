import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const sectors = await prisma.businessSector.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });
  return ['vi', 'en', 'zh'].flatMap((locale) =>
    sectors.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params;
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const sector = await prisma.businessSector.findUnique({
    where: { slug },
    select: {
      seoTitleVI: true,
      seoDescVI: true,
      nameVI: true, nameEN: true, nameZH: true,
      summaryVI: true, summaryEN: true, summaryZH: true,
      thumbnail: true,
    },
  });
  if (!sector) return {};

  // SEO fields only exist in VI; fall back to localised name/summary for EN & ZH
  const title = L === 'VI'
    ? sector.seoTitleVI
    : ((sector as any)[`name${L}`] as string | null) ?? sector.seoTitleVI ?? '';
  const description = L === 'VI'
    ? sector.seoDescVI
    : ((sector as any)[`summary${L}`] as string | null) ?? sector.seoDescVI ?? '';

  return buildMeta({
    locale,
    title,
    description,
    path: `/${locale}/business-segments/${slug}`,
    alternates: {
      vi: `/vi/business-segments/${slug}`,
      en: `/en/business-segments/${slug}`,
      zh: `/zh/business-segments/${slug}`,
    },
    image: sector.thumbnail ?? undefined,
  });
}

export default async function SectorDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'sectors' });

  const sector = await prisma.businessSector.findUnique({ where: { slug, status: 'PUBLISHED' } });
  if (!sector) notFound();

  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
  const name = (sector as any)[`name${L}`];
  const summary = (sector as any)[`summary${L}`];
  const content = (sector as any)[`content${L}`];
  const gallery = (sector.gallery as string[]) ?? [];

  return (
    <>
      <section className="relative overflow-hidden text-white py-20" style={{ background: '#015231' }}>
        {sector.banner && (
          <>
            <Image src={sector.banner} alt="" fill priority className="object-cover" aria-hidden />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(1,82,49,0.75) 0%, rgba(1,82,49,0.92) 100%)' }}
              aria-hidden
            />
          </>
        )}
        <div className="container-max relative z-10">
          <Link href={`/${locale}/business-segments`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> {t('backToList')}
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', color: '#fff' }}>{name}</h1>
          <p className="text-gray-300 mt-4 max-w-xl">{summary}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
              {gallery.length > 0 && (
                <div className="mt-10">
                  <h3 className="mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {locale === 'vi' ? 'Hình ảnh' : locale === 'en' ? 'Gallery' : '图库'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((img, i) => (
                      <div key={i} className="relative aspect-video overflow-hidden border border-[#defbbc]" style={{ borderRadius: '4px' }}>
                        <Image
                          src={img}
                          alt={`${name} — hình ảnh ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 267px"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="p-6 border border-[#defbbc] sticky top-20" style={{ borderRadius: '4px' }}>
                <h4 className="font-semibold text-[#015231] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {locale === 'vi' ? 'Liên hệ tư vấn' : locale === 'en' ? 'Contact Us' : '联系我们'}
                </h4>
                <p className="text-sm text-[#6B7280] mb-5">
                  {locale === 'vi' ? 'Hãy liên hệ với chúng tôi để được tư vấn chi tiết về dịch vụ này.' : locale === 'en' ? 'Contact us for detailed consultation on this service.' : '联系我们，获取关于此服务的详细咨询。'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-[#015231] text-white text-sm hover:bg-[#013d27] transition-colors"
                  style={{ borderRadius: 0 }}
                >
                  {locale === 'vi' ? 'Liên hệ ngay' : locale === 'en' ? 'Contact Now' : '立即联系'} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
