import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { NewsForm } from '../NewsForm';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.newsArticle.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <NewsForm
      initialData={{
        id: article.id,
        titleVI: article.titleVI, titleEN: article.titleEN, titleZH: article.titleZH,
        slugVI: article.slugVI, slugEN: article.slugEN, slugZH: article.slugZH,
        summaryVI: article.summaryVI, summaryEN: article.summaryEN, summaryZH: article.summaryZH,
        contentVI: article.contentVI, contentEN: article.contentEN, contentZH: article.contentZH,
        thumbnail: article.thumbnail, category: article.category, author: article.author,
        status: article.status,
        publishedAt: article.publishedAt?.toISOString().slice(0, 16) ?? null,
        scheduledAt: article.scheduledAt?.toISOString().slice(0, 16) ?? null,
      }}
    />
  );
}
