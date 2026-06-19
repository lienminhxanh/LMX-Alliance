import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Liên hệ', en: 'Contact', zh: '联系我们' };
  const descs: Record<string, string> = {
    vi: 'Liên hệ với LMX Alliance — Số 104 Đường Lò Lu, Long Phước, TP.HCM. Hotline: 0931.824.025 / 0937.798.377.',
    en: 'Contact LMX Alliance — 104 Lo Lu Street, Long Phuoc, Ho Chi Minh City. Hotline: 0931.824.025 / 0937.798.377.',
    zh: '联系LMX Alliance — 胡志明市Long Phước区罗炉路104号。热线：0931.824.025 / 0937.798.377。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/contact`,
    alternates: { vi: '/vi/contact', en: '/en/contact', zh: '/zh/contact' },
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
