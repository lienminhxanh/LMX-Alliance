import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { routing } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { FloatingContact } from '@/components/public/FloatingContact';
import { prisma } from '@/lib/prisma';

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
  const messages = await getMessages();
  const settings = await prisma.companySettings.findFirst();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact phone={settings?.phone} zaloUrl={settings?.zaloUrl} messengerUrl={settings?.messengerUrl} />
    </NextIntlClientProvider>
  );
}
