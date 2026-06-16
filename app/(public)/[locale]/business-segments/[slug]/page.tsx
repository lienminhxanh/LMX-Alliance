import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sector = await prisma.businessSector.findUnique({ where: { slug } });
  if (!sector) return {};
  return { title: sector.seoTitleVI, description: sector.seoDescVI };
}

export default async function SectorDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
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
      <section className="bg-[#1F2937] text-white py-20">
        <div className="container-max">
          <Link href={`/${locale}/business-segments`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> {t('backToList')}
          </Link>
          <h1 className="text-white" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)' }}>{name}</h1>
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
                      <img key={i} src={img} alt={`${name} ${i + 1}`} className="w-full aspect-video object-cover border border-[#E8E9ED]" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="p-6 border border-[#E8E9ED] sticky top-20" style={{ borderRadius: '4px' }}>
                <h4 className="font-semibold text-[#1F2937] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {locale === 'vi' ? 'Liên hệ tư vấn' : locale === 'en' ? 'Contact Us' : '联系我们'}
                </h4>
                <p className="text-sm text-[#6B7280] mb-5">
                  {locale === 'vi' ? 'Hãy liên hệ với chúng tôi để được tư vấn chi tiết về dịch vụ này.' : locale === 'en' ? 'Contact us for detailed consultation on this service.' : '联系我们，获取关于此服务的详细咨询。'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-[#1F2937] text-white text-sm hover:bg-[#374151] transition-colors"
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
