import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SectorForm } from '../SectorForm';

export default async function EditSectorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sector = await prisma.businessSector.findUnique({ where: { id } });
  if (!sector) notFound();

  return (
    <SectorForm
      initialData={{
        id: sector.id,
        slug: sector.slug,
        nameVI: sector.nameVI, nameEN: sector.nameEN, nameZH: sector.nameZH,
        summaryVI: sector.summaryVI, summaryEN: sector.summaryEN, summaryZH: sector.summaryZH,
        contentVI: sector.contentVI, contentEN: sector.contentEN, contentZH: sector.contentZH,
        banner: sector.banner, thumbnail: sector.thumbnail,
        gallery: (sector.gallery as string[]) ?? [],
        seoTitleVI: sector.seoTitleVI, seoDescVI: sector.seoDescVI,
        status: sector.status, orderIndex: sector.orderIndex,
      }}
    />
  );
}
