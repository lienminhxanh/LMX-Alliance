import { redirect } from 'next/navigation';

export default async function JobDetailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/careers`);
}
