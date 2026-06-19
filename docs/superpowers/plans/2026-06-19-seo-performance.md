# GĐ2: SEO & Tối ưu hiệu năng — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm metadata động, sitemap, JSON-LD structured data, tối ưu hình ảnh với next/image để đạt Lighthouse ≥ 85.

**Architecture:** Tạo `lib/seo.ts` làm helper trung tâm, mỗi page export `generateMetadata()` dùng helper đó. Sitemap động lấy dữ liệu từ Prisma. JSON-LD embed inline trong Server Component. next/image thay thế `<img>` ở các điểm ảnh hưởng CLS/LCP.

**Tech Stack:** Next.js 16 (App Router), next-intl 4, Prisma, TypeScript strict.

## Global Constraints

- `NEXT_PUBLIC_SITE_URL` = `https://lmx-alliance-five.vercel.app` (thay bằng domain thật khi có)
- 3 locales: `vi` (default), `en`, `zh`
- Không dùng thư viện nào mới — JSON-LD là plain object, không cần `next-seo`
- `<Image>` từ `next/image` chỉ dùng cho ảnh có kích thước xác định; ảnh content HTML giữ nguyên `<img>`
- Không thay đổi schema Prisma trong phase này
- Mọi commit theo Conventional Commits

---

## File Structure

| File | Vai trò |
|------|---------|
| `lib/seo.ts` | **MỚI** — SITE_URL constant, `buildMeta()` helper, OG locale map |
| `app/sitemap.ts` | **MỚI** — Dynamic sitemap trả về tất cả trang static + dynamic |
| `app/robots.ts` | **MỚI** — robots.txt cho phép crawl, trỏ tới sitemap |
| `app/(public)/[locale]/layout.tsx` | **SỬA** — `generateMetadata` mặc định cho toàn locale |
| `app/(public)/[locale]/page.tsx` | **SỬA** — metadata i18n + OG + JSON-LD Organization |
| `app/(public)/[locale]/about/page.tsx` | **SỬA** — metadata + JSON-LD Organization (chi tiết) + `<Image>` |
| `app/(public)/[locale]/news/page.tsx` | **SỬA** — metadata |
| `app/(public)/[locale]/news/[slug]/page.tsx` | **SỬA** — metadata động từ DB + JSON-LD NewsArticle |
| `app/(public)/[locale]/contact/page.tsx` | **SỬA** — metadata |
| `app/(public)/[locale]/careers/page.tsx` | **SỬA** — metadata |
| `app/(public)/[locale]/shareholder-relations/page.tsx` | **SỬA** — metadata |
| `app/(public)/[locale]/business-segments/page.tsx` | **SỬA** — metadata |
| `app/(public)/[locale]/business-segments/[slug]/page.tsx` | **SỬA** — metadata i18n-aware + OG |

---

## Task 1: lib/seo.ts — SEO Helper

**Files:**
- Tạo: `lib/seo.ts`

**Interfaces:**
- Produces: `SITE_URL: string`, `OG_LOCALE: Record<string,string>`, `buildMeta(opts): Metadata`

---

- [ ] **Step 1: Tạo `lib/seo.ts`**

```typescript
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
```

- [ ] **Step 2: Tạo placeholder OG image**

Tạo file `public/og-default.png` — kéo ảnh 1200×630 đơn giản có logo LMX (hoặc dùng ảnh tạm). Nếu chưa có ảnh, tạo file text tạm để không báo lỗi:

```bash
# Bỏ qua bước này nếu chưa có ảnh thiết kế
# File được serve tĩnh từ /public
```

*(Nếu chưa có ảnh OG thực, buildMeta vẫn hoạt động — og.images sẽ trỏ tới 404 nhưng không gây lỗi build)*

- [ ] **Step 3: Commit**

```bash
git add lib/seo.ts
git commit -m "feat(seo): add buildMeta helper and SITE_URL constant"
```

---

## Task 2: Sitemap XML + robots.txt

**Files:**
- Tạo: `app/sitemap.ts`
- Tạo: `app/robots.ts`

**Interfaces:**
- Consumes: `SITE_URL` từ `lib/seo.ts`, Prisma `newsArticle`, `businessSector`

---

- [ ] **Step 1: Tạo `app/sitemap.ts`**

```typescript
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { prisma } from '@/lib/prisma';

const locales = ['vi', 'en', 'zh'];

const staticPaths = [
  '',           // homepage
  '/about',
  '/contact',
  '/careers',
  '/news',
  '/business-segments',
  '/shareholder-relations',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages × 3 locales
  for (const path of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic news articles
  const articles = await prisma.newsArticle.findMany({
    where: { status: 'PUBLISHED' },
    select: { slugVI: true, slugEN: true, slugZH: true, updatedAt: true },
  });

  for (const a of articles) {
    const slugs: Record<string, string | null> = { vi: a.slugVI, en: a.slugEN, zh: a.slugZH };
    for (const [locale, slug] of Object.entries(slugs)) {
      if (!slug) continue;
      entries.push({
        url: `${SITE_URL}/${locale}/news/${slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  // Dynamic business sectors
  const sectors = await prisma.businessSector.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  for (const s of sectors) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/business-segments/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
```

- [ ] **Step 2: Tạo `app/robots.ts`**

```typescript
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verify build không lỗi**

```bash
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat(seo): add dynamic sitemap.xml and robots.txt"
```

---

## Task 3: Metadata cho tất cả static pages

**Files:**
- Sửa: `app/(public)/[locale]/layout.tsx`
- Sửa: `app/(public)/[locale]/page.tsx`
- Sửa: `app/(public)/[locale]/about/page.tsx`
- Sửa: `app/(public)/[locale]/news/page.tsx`
- Sửa: `app/(public)/[locale]/contact/page.tsx`
- Sửa: `app/(public)/[locale]/careers/page.tsx`
- Sửa: `app/(public)/[locale]/shareholder-relations/page.tsx`
- Sửa: `app/(public)/[locale]/business-segments/page.tsx`

**Interfaces:**
- Consumes: `buildMeta` từ `lib/seo.ts`

---

### 3a — Locale layout: metadata mặc định

- [ ] **Step 1: Thêm `generateMetadata` vào `app/(public)/[locale]/layout.tsx`**

Thêm vào đầu file (sau các imports hiện có):

```typescript
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
```

### 3b — Homepage

- [ ] **Step 2: Sửa `generateMetadata` trong `app/(public)/[locale]/page.tsx`**

Thay thế toàn bộ hàm `generateMetadata` hiện tại:

```typescript
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Trang chủ',
    en: 'Home',
    zh: '首页',
  };
  const descs: Record<string, string> = {
    vi: 'LMX Alliance — Giải pháp toàn diện trong logistics, xây lắp công trình, thu mua phế liệu và xử lý chất thải nguy hại. An toàn – Hiệu quả – Minh bạch.',
    en: 'LMX Alliance — Comprehensive solutions in logistics, construction, scrap procurement and hazardous waste management. Safe – Efficient – Transparent.',
    zh: 'LMX Alliance — 物流、建筑、废料采购和危险废物处理综合解决方案。安全 – 高效 – 透明。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}`,
    alternates: { vi: '/vi', en: '/en', zh: '/zh' },
  });
}
```

### 3c — About page

- [ ] **Step 3: Thêm `generateMetadata` vào `app/(public)/[locale]/about/page.tsx`**

Thêm sau `import` block hiện có:

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Giới thiệu',
    en: 'About Us',
    zh: '关于我们',
  };
  const descs: Record<string, string> = {
    vi: 'Tìm hiểu về Công ty Cổ phần Liên Minh Xanh LMX — lịch sử thành lập, sứ mệnh, tầm nhìn, giá trị cốt lõi và đội ngũ lãnh đạo.',
    en: 'Learn about LMX Green Alliance JSC — our founding story, mission, vision, core values and leadership team.',
    zh: '了解LMX绿色联盟股份公司 — 成立历史、使命、愿景、核心价值观和领导团队。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/about`,
    alternates: { vi: '/vi/about', en: '/en/about', zh: '/zh/about' },
  });
}
```

### 3d — News list page

- [ ] **Step 4: Thêm `generateMetadata` vào `app/(public)/[locale]/news/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Tin tức', en: 'News', zh: '新闻' };
  const descs: Record<string, string> = {
    vi: 'Cập nhật tin tức mới nhất từ LMX Alliance — hoạt động kinh doanh, dự án, tuyển dụng và phát triển bền vững.',
    en: 'Latest news from LMX Alliance — business activities, projects, recruitment and sustainability.',
    zh: '来自LMX Alliance的最新消息 — 商业活动、项目、招聘和可持续发展。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/news`,
    alternates: { vi: '/vi/news', en: '/en/news', zh: '/zh/news' },
  });
}
```

### 3e — Contact page

- [ ] **Step 5: Thêm `generateMetadata` vào `app/(public)/[locale]/contact/page.tsx`**

```typescript
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
```

### 3f — Careers page

- [ ] **Step 6: Thêm `generateMetadata` vào `app/(public)/[locale]/careers/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { vi: 'Tuyển dụng', en: 'Careers', zh: '招聘' };
  const descs: Record<string, string> = {
    vi: 'Cơ hội nghề nghiệp tại LMX Alliance — môi trường chuyên nghiệp, phát triển bền vững và phúc lợi cạnh tranh.',
    en: 'Career opportunities at LMX Alliance — professional environment, sustainable growth and competitive benefits.',
    zh: 'LMX Alliance的职业机会 — 专业环境、可持续发展和有竞争力的福利。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/careers`,
    alternates: { vi: '/vi/careers', en: '/en/careers', zh: '/zh/careers' },
  });
}
```

### 3g — Shareholder Relations page

- [ ] **Step 7: Thêm `generateMetadata` vào `app/(public)/[locale]/shareholder-relations/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Quan hệ cổ đông',
    en: 'Shareholder Relations',
    zh: '股东关系',
  };
  const descs: Record<string, string> = {
    vi: 'Thông tin quan hệ cổ đông LMX Alliance — tài liệu, báo cáo và cập nhật dành cho nhà đầu tư.',
    en: 'LMX Alliance shareholder relations — documents, reports and investor updates.',
    zh: 'LMX Alliance股东关系 — 文件、报告和投资者更新。',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/shareholder-relations`,
    alternates: {
      vi: '/vi/shareholder-relations',
      en: '/en/shareholder-relations',
      zh: '/zh/shareholder-relations',
    },
  });
}
```

### 3h — Business Segments list page

- [ ] **Step 8: Thêm `generateMetadata` vào `app/(public)/[locale]/business-segments/page.tsx`**

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

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
```

- [ ] **Step 9: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 10: Commit**

```bash
git add app/(public)/\[locale\]/layout.tsx \
        app/(public)/\[locale\]/page.tsx \
        app/(public)/\[locale\]/about/page.tsx \
        app/(public)/\[locale\]/news/page.tsx \
        app/(public)/\[locale\]/contact/page.tsx \
        app/(public)/\[locale\]/careers/page.tsx \
        app/(public)/\[locale\]/shareholder-relations/page.tsx \
        app/(public)/\[locale\]/business-segments/page.tsx
git commit -m "feat(seo): add i18n metadata + OG tags to all static pages"
```

---

## Task 4: Metadata động cho dynamic pages

**Files:**
- Sửa: `app/(public)/[locale]/news/[slug]/page.tsx`
- Sửa: `app/(public)/[locale]/business-segments/[slug]/page.tsx`

**Interfaces:**
- Consumes: `buildMeta` từ `lib/seo.ts`, Prisma `newsArticle`, `businessSector`

---

- [ ] **Step 1: Sửa `news/[slug]/page.tsx` — thêm `generateMetadata`**

Thêm sau imports hiện có:

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params;
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
  const slugField = `slug${L}` as 'slugVI' | 'slugEN' | 'slugZH';

  const article = await prisma.newsArticle.findFirst({
    where: { [slugField]: slug, status: 'PUBLISHED' },
    select: {
      titleVI: true, titleEN: true, titleZH: true,
      summaryVI: true, summaryEN: true, summaryZH: true,
      slugVI: true, slugEN: true, slugZH: true,
      thumbnail: true,
    },
  });

  if (!article) return {};

  const title = (article as any)[`title${L}`] as string;
  const description = ((article as any)[`summary${L}`] as string | null)
    ?? title;

  return buildMeta({
    locale,
    title,
    description,
    path: `/${locale}/news/${slug}`,
    alternates: {
      vi: article.slugVI ? `/vi/news/${article.slugVI}` : `/vi/news`,
      en: article.slugEN ? `/en/news/${article.slugEN}` : `/en/news`,
      zh: article.slugZH ? `/zh/news/${article.slugZH}` : `/zh/news`,
    },
    image: article.thumbnail ?? undefined,
    type: 'article',
  });
}
```

- [ ] **Step 2: Sửa `business-segments/[slug]/page.tsx` — cải thiện `generateMetadata`**

Thay thế hàm `generateMetadata` hiện tại (chỉ dùng VI):

```typescript
import type { Metadata } from 'next';
import { buildMeta } from '@/lib/seo';

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params;
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const sector = await prisma.businessSector.findUnique({
    where: { slug },
    select: {
      seoTitleVI: true, seoTitleEN: true, seoTitleZH: true,
      seoDescVI: true, seoDescEN: true, seoDescZH: true,
      thumbnail: true,
    },
  });
  if (!sector) return {};

  const title = ((sector as any)[`seoTitle${L}`] as string | null)
    ?? (sector.seoTitleVI ?? '');
  const description = ((sector as any)[`seoDesc${L}`] as string | null)
    ?? (sector.seoDescVI ?? '');

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
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add app/(public)/\[locale\]/news/\[slug\]/page.tsx \
        app/(public)/\[locale\]/business-segments/\[slug\]/page.tsx
git commit -m "feat(seo): add dynamic metadata for news and sector detail pages"
```

---

## Task 5: JSON-LD Structured Data

**Files:**
- Sửa: `app/(public)/[locale]/page.tsx` — Organization schema
- Sửa: `app/(public)/[locale]/news/[slug]/page.tsx` — NewsArticle schema

---

### 5a — Organization JSON-LD trên Homepage

- [ ] **Step 1: Thêm JSON-LD vào Homepage**

Trong `app/(public)/[locale]/page.tsx`, trong `return (...)`, thêm `<script>` tag **trước** JSX content đầu tiên:

```tsx
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Công ty Cổ phần Liên Minh Xanh LMX',
  alternateName: 'LMX Alliance',
  url: 'https://lmx-alliance-five.vercel.app',
  logo: 'https://lmx-alliance-five.vercel.app/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+84-931-824-025',
    contactType: 'customer service',
    areaServed: 'VN',
    availableLanguage: ['Vietnamese', 'English'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Số 104 Đường Lò Lu',
    addressLocality: 'Long Phước',
    addressRegion: 'TP. Hồ Chí Minh',
    addressCountry: 'VN',
  },
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
    {/* ... rest of existing JSX ... */}
  </>
);
```

### 5b — NewsArticle JSON-LD trên News Detail

- [ ] **Step 2: Thêm NewsArticle JSON-LD vào `news/[slug]/page.tsx`**

Ngay trong `return (...)`, thêm trước content hiện tại:

```tsx
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: (article as any)[`title${L}`],
  description: (article as any)[`summary${L}`] ?? '',
  datePublished: article.publishedAt?.toISOString() ?? new Date().toISOString(),
  dateModified: article.updatedAt.toISOString(),
  publisher: {
    '@type': 'Organization',
    name: 'LMX Alliance',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lmx-alliance-five.vercel.app/logo.png',
    },
  },
  image: article.thumbnail ? [article.thumbnail] : [],
  url: `https://lmx-alliance-five.vercel.app/${locale}/news/${slug}`,
};

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
    />
    {/* ... rest of existing JSX ... */}
  </>
);
```

*(Cần thêm `updatedAt` và `publishedAt` vào Prisma select query hiện tại trong cùng file)*

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/(public)/\[locale\]/page.tsx \
        app/(public)/\[locale\]/news/\[slug\]/page.tsx
git commit -m "feat(seo): add JSON-LD structured data for Organization and NewsArticle"
```

---

## Task 6: next/image Optimization

**Files:**
- Sửa: `app/(public)/[locale]/about/page.tsx` — `<img>` → `<Image>` (certificate + leader photos)
- Sửa: `app/(public)/[locale]/business-segments/[slug]/page.tsx` — gallery `<img>` → `<Image>`
- Sửa: `app/(public)/[locale]/page.tsx` — sector thumbnail nếu có

**Interfaces:**
- `Image` từ `next/image` — require `width`, `height` hoặc `fill`

---

- [ ] **Step 1: About page — certificate image**

Trong `app/(public)/[locale]/about/page.tsx`:

1. Thêm import: `import Image from 'next/image';`
2. Thay `<img src="/docs/giay-phep-dkdn.png" ...>` bằng:

```tsx
<Image
  src="/docs/giay-phep-dkdn.png"
  alt="Giấy chứng nhận đăng ký doanh nghiệp — LMX Alliance"
  width={784}
  height={1123}
  className="w-full block transition-opacity duration-200 group-hover:opacity-90"
/>
```

- [ ] **Step 2: About page — leader photos**

Thay `<img src={leader.photo} ...>` bằng:

```tsx
<Image
  src={leader.photo}
  alt={name}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-105"
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
/>
```

*(Div bọc ngoài đã có `aspect-[3/4] overflow-hidden` và `position: relative` — `fill` cần parent có `position: relative`)*

Kiểm tra: div wrapper `"aspect-[3/4] overflow-hidden"` — thêm `style={{ position: 'relative' }}` vào div đó nếu chưa có.

- [ ] **Step 3: Business sector gallery**

Trong `app/(public)/[locale]/business-segments/[slug]/page.tsx`, tìm gallery render. Nếu có `<img>` cho gallery:

```tsx
import Image from 'next/image';

// Thay <img src={imgUrl} /> bằng:
<div className="relative aspect-video overflow-hidden" style={{ borderRadius: '4px' }}>
  <Image
    src={imgUrl}
    alt={`${name} — hình ảnh ${idx + 1}`}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add app/(public)/\[locale\]/about/page.tsx \
        app/(public)/\[locale\]/business-segments/\[slug\]/page.tsx
git commit -m "perf: replace img with next/image for CLS/LCP optimization"
```

---

## Task 7: Kiểm tra Lighthouse & Push

**Không có code changes — đây là task đo lường và fix.**

---

- [ ] **Step 1: Build production local**

```bash
npm run build
```

Expected: build thành công, không có TypeScript errors.

- [ ] **Step 2: Verify sitemap + robots**

Mở trình duyệt:
- `https://lmx-alliance-five.vercel.app/sitemap.xml` → XML với ≥ 21 entries (7 paths × 3 locales + dynamic)
- `https://lmx-alliance-five.vercel.app/robots.txt` → "User-agent: *\nAllow: /\nSitemap: ..."

- [ ] **Step 3: Verify metadata với browser DevTools**

Mở DevTools → Elements → `<head>`:
- `<title>`: "Trang chủ | LMX Alliance"
- `<meta name="description">`: có nội dung đúng
- `<meta property="og:title">`: có
- `<link rel="canonical">`: trỏ tới URL đúng
- `<script type="application/ld+json">`: có JSON-LD

- [ ] **Step 4: Verify JSON-LD với Google Rich Results Test**

Dùng https://search.google.com/test/rich-results để kiểm tra homepage và một news article.

- [ ] **Step 5: Push lên Vercel**

```bash
git push
```

Sau khi Vercel build xong, chạy Lighthouse trên production:
- Chrome DevTools → Lighthouse → chạy cho `/vi`, `/vi/about`, `/vi/news/[slug]`
- Target: Performance ≥ 85, SEO = 100, Accessibility ≥ 90

- [ ] **Step 6: Fix các lỗi Lighthouse phát hiện (nếu có)**

Common fixes:
- `<html lang>` không đúng: Sửa trong `app/(public)/[locale]/layout.tsx` → set `lang={locale}` động
- Missing alt text: Kiểm tra tất cả `<img>` / `<Image>` còn lại
- Render-blocking resources: Kiểm tra Google Fonts trong `globals.css` — thêm `&display=swap` (đã có)

- [ ] **Step 7: Log kết quả vào dev-log**

Ghi điểm Lighthouse vào `docs/dev-log.md` cho ngày 20/06.

- [ ] **Step 8: Commit final**

```bash
git add docs/dev-log.md
git commit -m "docs: log Lighthouse scores after SEO phase"
git push
```

---

## Self-Review Checklist

- [x] **2.1 Metadata động**: Tất cả 10 page files đều có `generateMetadata` — ✅ covered tasks 3+4
- [x] **2.2 Sitemap + robots**: `app/sitemap.ts` + `app/robots.ts` — ✅ task 2
- [x] **2.3 next/image**: certificate, leader photos, sector gallery — ✅ task 6
- [x] **2.4 Lighthouse ≥ 85**: Task 7 đo sau khi deploy
- [x] **2.5 JSON-LD**: Organization (homepage) + NewsArticle (news detail) — ✅ task 5
- [x] Hreflang `alternates.languages` trong `buildMeta` — ✅ task 1
- [x] `lang={locale}` dynamic trên `<html>` — task 7 step 6 (nếu cần)
- [x] `metadataBase` set trong `buildMeta` — ✅ task 1
- [x] robots.txt disallow `/admin/` và `/api/` — ✅ task 2
