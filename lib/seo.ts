import type { Metadata } from 'next';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lmx-alliance-five.vercel.app';

export const OG_LOCALE: Record<string, string> = {
  vi: 'vi_VN',
  en: 'en_US',
  zh: 'zh_CN',
};

export const SITE_NAME = 'LMX Alliance';

interface BuildMetaOpts {
  locale: string;
  title: string;
  description: string;
  /** Canonical path, e.g. "/vi/about" */
  path: string;
  /** Paths for alternate locales: { vi: "/vi/...", en: "/en/...", zh: "/zh/..." } */
  alternates?: Record<string, string>;
  image?: string;
  type?: 'website' | 'article';
}

export function buildMeta({
  locale,
  title,
  description,
  path,
  alternates,
  image,
  type = 'website',
}: BuildMetaOpts): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-default.png`;

  const langAlternates: Record<string, string> = {};
  if (alternates) {
    for (const [lang, p] of Object.entries(alternates)) {
      langAlternates[lang] = `${SITE_URL}${p}`;
    }
  }

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: Object.keys(langAlternates).length > 0 ? langAlternates : undefined,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? 'vi_VN',
      type,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
