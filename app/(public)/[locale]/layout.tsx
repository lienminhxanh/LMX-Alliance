import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { PartnerMarquee } from '@/components/public/PartnerMarquee';
import { FloatingContact } from '@/components/public/FloatingContact';
import { getCachedCompanySettings } from '@/lib/cached';
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Công ty Cổ phần Liên Minh Xanh LMX',
    en: 'LMX Green Alliance Joint Stock Company',
    zh: 'LMX绿色联盟股份公司',
  };
  const descs: Record<string, string> = {
    vi: 'Doanh nghiệp đa ngành cung cấp dịch vụ logistics, xây lắp công trình, thu mua phế liệu và xử lý chất thải nguy hại tại Việt Nam.',
    en: 'Multi-sector enterprise providing logistics, construction, scrap procurement and hazardous waste management services in Vietnam.',
    zh: '越南多元化企业，提供物流、建筑、废料采购和危险废物处理服务。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}`,
  });
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await getCachedCompanySettings();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <PartnerMarquee />
      <Footer />
      <FloatingContact phone={settings?.phone} zaloUrl={settings?.zaloUrl} messengerUrl={settings?.messengerUrl} />
    </NextIntlClientProvider>
  );
}
