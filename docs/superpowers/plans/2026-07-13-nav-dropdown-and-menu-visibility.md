# Header Dropdown Navigation + Admin Menu Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hover/tap dropdown submenus to the public header (About, Shareholder Relations, Business Segments, Activities) that link to same-page sections or sub-routes, plus a SUPER_ADMIN-only admin screen to show/hide entire nav items or individual dropdown children.

**Architecture:** A code-defined nav tree (`lib/nav-config.ts`) is the single source of truth for structure; a `MenuItemVisibility` Prisma table (fail-open — missing row = visible) stores per-key on/off state, toggled from a new `app/admin/menus` screen via a Server Action. `app/(public)/[locale]/layout.tsx` reads the hidden-key set and active business sectors once per request and passes them into a rewritten `Header.tsx`, which filters `NAV_CONFIG` and renders a new `NavDropdown` component for any item with visible children. Anchor-type children scroll to `id`-tagged `<section>`s added to `about/page.tsx` and `ActivitiesClient.tsx`; a tiny `HashScrollHandler` client component smooth-scrolls to `#hash` targets after cross-page navigation.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Prisma/PostgreSQL (`db push`, no migrations folder), NextAuth session (`session.user.role`), next-intl, Tailwind, Server Actions, `unstable_cache`/`revalidatePath`/`revalidateTag`.

## Global Constraints

- No automated tests. This repo has no test framework (no vitest/jest/Playwright/testing-library) installed, and the user explicitly chose **"Skip automated tests, verify manually."** Do not install one. Every task ends with a manual dev-server/browser verification step instead of a test run.
- No DB migrations folder exists — always use `npm run db:push` (never `prisma migrate`).
- Public site: green palette (`#8ec63f`, `#015231`, `#013d27`, `#defbbc`, `#f8fbf2`), sharp/near-sharp corners (max `4px` radius), no gradients beyond what already exists in `Header.tsx`.
- Admin panel: charcoal palette (`#1F2937`), `var(--font-display)` for headings, hardcoded English strings only (admin is not multi-language), sharp-cornered checkboxes (`style={{ borderRadius: 0 }}`).
- Menu structure is fixed in code — admins only get on/off visibility, never labels/reordering/add/remove.
- Hiding an item is nav-only — the route itself must keep working.
- Visibility is global across all locales (one `MenuItemVisibility` table, no per-locale rows).
- Business Segments' dynamic children stay gated by `BusinessSector.status`, never by `MenuItemVisibility` — do not add toggle rows for individual sectors.
- Every admin mutation must call `logAudit(...)` (see `lib/audit-log.ts`), matching the `actions/sectors.ts` pattern exactly.
- Out of scope, do not touch: generic bulk admin actions, the floating circular quick-nav component, a full menu builder (custom labels/reorder/add/remove).

---

## File Structure

| File | Responsibility |
|---|---|
| `prisma/schema.prisma` | Add `MenuItemVisibility` model |
| `lib/nav-config.ts` (new) | `NavItem`/`NavChild` types, `NAV_CONFIG`, `filterVisibleNav()` |
| `lib/queries.ts` | Add `getHiddenMenuKeys` cached query |
| `actions/menus.ts` (new) | `toggleMenuItemVisibility` Server Action |
| `app/admin/menus/page.tsx` (new) | Admin visibility list (SUPER_ADMIN only) |
| `app/admin/menus/MenuVisibilityToggle.tsx` (new) | Client checkbox wired to the Server Action |
| `components/admin/Sidebar.tsx` | Add "Menus" nav link |
| `content/vi.json`, `content/en.json`, `content/zh.json` | Add `nav.aboutSections.*`, `nav.activitiesSections.*` |
| `components/public/HashScrollHandler.tsx` (new) | Smooth-scrolls to `#hash` on mount |
| `app/(public)/[locale]/about/page.tsx` | Add 5 section `id`s + render `<HashScrollHandler />` |
| `app/(public)/[locale]/activities/ActivitiesClient.tsx` | Add `id` prop to sliders + render `<HashScrollHandler />` |
| `components/public/NavDropdown.tsx` (new) | Hover/focus dropdown panel |
| `components/public/Header.tsx` | Rewrite to consume `NAV_CONFIG` + dropdowns |
| `app/(public)/[locale]/layout.tsx` | Fetch hidden keys + business sectors, pass to `Header` |

---

## Task 1: `MenuItemVisibility` data model

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: Prisma model `MenuItemVisibility { key: string (PK), isVisible: boolean, updatedAt: Date, updatedById: string | null }`. Missing row for a `key` means visible (fail-open).

- [ ] **Step 1: Add the model**

Append to the end of `prisma/schema.prisma` (after the `PageView` model, before EOF):

```prisma
model MenuItemVisibility {
  key         String   @id
  isVisible   Boolean  @default(true)
  updatedAt   DateTime @updatedAt
  updatedById String?
}
```

`updatedById` is a plain `String?`, not a `@relation` — this matches the existing `MediaFile.uploadedBy` convention (schema.prisma:351), the only other "who did X" field in the schema.

- [ ] **Step 2: Generate the client**

Run: `npm run db:generate`
Expected: `✔ Generated Prisma Client` with no errors.

- [ ] **Step 3: Push the schema**

Run: `npm run db:push`
Expected output includes:
```
Your database is now in sync with your Prisma schema.
```

- [ ] **Step 4: Manual verification**

Run: `npx prisma studio` (or check via psql) and confirm a `MenuItemVisibility` table exists with columns `key, isVisible, updatedAt, updatedById`. Close prisma studio (Ctrl+C) when done.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(db): add MenuItemVisibility model"
```

---

## Task 2: Nav config source of truth

**Files:**
- Create: `lib/nav-config.ts`

**Interfaces:**
- Produces:
  - `type NavChild = { key: string; labelKey: string; type: 'anchor' | 'route'; target: string }`
  - `type NavItem = { key: string; labelKey: string; href: string; children?: NavChild[]; dynamicChildren?: 'business-sectors' }`
  - `NAV_CONFIG: NavItem[]`
  - `filterVisibleNav(config: NavItem[], hiddenKeys: Set<string>): NavItem[]`
- Consumes: nothing (pure module).

- [ ] **Step 1: Write the file**

```ts
// lib/nav-config.ts

export type NavChild =
  | { key: string; labelKey: string; type: 'anchor'; target: string }
  | { key: string; labelKey: string; type: 'route'; target: string };

export type NavItem = {
  key: string;
  labelKey: string;
  href: string;
  children?: NavChild[];
  dynamicChildren?: 'business-sectors';
};

export const NAV_CONFIG: NavItem[] = [
  { key: 'home', labelKey: 'home', href: '/' },
  {
    key: 'about',
    labelKey: 'about',
    href: '/about',
    children: [
      { key: 'about.intro', labelKey: 'intro', type: 'anchor', target: 'intro' },
      { key: 'about.openLetter', labelKey: 'openLetter', type: 'anchor', target: 'open-letter' },
      { key: 'about.values', labelKey: 'values', type: 'anchor', target: 'values' },
      { key: 'about.legal', labelKey: 'legal', type: 'anchor', target: 'legal-documents' },
      { key: 'about.leadership', labelKey: 'leadership', type: 'anchor', target: 'leadership' },
    ],
  },
  {
    key: 'business-segments',
    labelKey: 'business',
    href: '/business-segments',
    dynamicChildren: 'business-sectors',
  },
  {
    key: 'shareholder-relations',
    labelKey: 'investor',
    href: '/shareholder-relations',
    children: [
      { key: 'shareholder-relations.governance', labelKey: 'governance', type: 'route', target: '/shareholder-relations/governance' },
      { key: 'shareholder-relations.financial-reports', labelKey: 'financialReports', type: 'route', target: '/shareholder-relations/financial-reports' },
      { key: 'shareholder-relations.annual-reports', labelKey: 'annualReports', type: 'route', target: '/shareholder-relations/annual-reports' },
    ],
  },
  { key: 'news', labelKey: 'news', href: '/news' },
  { key: 'careers', labelKey: 'careers', href: '/careers' },
  {
    key: 'activities',
    labelKey: 'activities',
    href: '/activities',
    children: [
      { key: 'activities.internal', labelKey: 'internal', type: 'anchor', target: 'internal-activities' },
      { key: 'activities.social', labelKey: 'social', type: 'anchor', target: 'social-activities' },
    ],
  },
];

export function filterVisibleNav(config: NavItem[], hiddenKeys: Set<string>): NavItem[] {
  return config
    .filter((item) => !hiddenKeys.has(item.key))
    .map((item) => {
      if (!item.children) return item;
      return { ...item, children: item.children.filter((child) => !hiddenKeys.has(child.key)) };
    });
}
```

- [ ] **Step 2: Manual verification**

Run: `npx tsx -e "const { NAV_CONFIG, filterVisibleNav } = require('./lib/nav-config.ts'); const filtered = filterVisibleNav(NAV_CONFIG, new Set(['shareholder-relations', 'about.leadership'])); console.log(filtered.map((i) => i.key)); console.log(filtered.find((i) => i.key === 'about')?.children?.map((c) => c.key));"`

Expected: first line does NOT include `shareholder-relations`; second line lists About's children WITHOUT `about.leadership`.

- [ ] **Step 3: Commit**

```bash
git add lib/nav-config.ts
git commit -m "feat(nav): add NAV_CONFIG and filterVisibleNav"
```

---

## Task 3: Hidden-keys query

**Files:**
- Modify: `lib/queries.ts`

**Interfaces:**
- Consumes: `prisma.menuItemVisibility` (Task 1).
- Produces: `getHiddenMenuKeys: () => Promise<string[]>`, cache tag `'menu-visibility'`.

- [ ] **Step 1: Append the query**

Add to the end of `lib/queries.ts`:

```ts
export const getHiddenMenuKeys = unstable_cache(
  async () => {
    const rows = await prisma.menuItemVisibility.findMany({ where: { isVisible: false }, select: { key: true } });
    return rows.map((r) => r.key);
  },
  ['hidden-menu-keys'],
  { revalidate: 3600, tags: ['menu-visibility'] }
);
```

- [ ] **Step 2: Manual verification**

Run: `npx tsx -e "import('./lib/queries.ts').then(async (m) => { console.log(await m.getHiddenMenuKeys()); process.exit(0); })"`
Expected: `[]` (no rows exist yet — matches fail-open default).

- [ ] **Step 3: Commit**

```bash
git add lib/queries.ts
git commit -m "feat(nav): add getHiddenMenuKeys cached query"
```

---

## Task 4: Toggle Server Action

**Files:**
- Create: `actions/menus.ts`

**Interfaces:**
- Consumes: `prisma.menuItemVisibility` (Task 1), `auth()` from `lib/auth.ts`, `logAudit` from `lib/audit-log.ts`.
- Produces: `toggleMenuItemVisibility(key: string, isVisible: boolean): Promise<void>`.

- [ ] **Step 1: Write the action**

```ts
// actions/menus.ts
'use server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { logAudit } from '@/lib/audit-log';
import { revalidatePath, revalidateTag } from 'next/cache';

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  if ((session.user as any).role !== 'SUPER_ADMIN') throw new Error('Forbidden');
  return session.user;
}

export async function toggleMenuItemVisibility(key: string, isVisible: boolean) {
  const user = await requireSuperAdmin();
  await prisma.menuItemVisibility.upsert({
    where: { key },
    create: { key, isVisible, updatedById: user.id },
    update: { isVisible, updatedById: user.id },
  });
  await logAudit({ userId: user.id!, action: 'UPDATE', entity: 'MenuItemVisibility', entityId: key, details: { isVisible } });
  revalidatePath('/admin/menus');
  revalidateTag('menu-visibility');
}
```

`revalidateTag('menu-visibility')` is the one deliberate exception to this codebase's usual "admin edits refresh public data only via the time-based `revalidate` window" pattern (no other `actions/*.ts` file calls `revalidateTag`) — justified because the spec calls for the toggle's effect on the public nav to be near-instant, not wait up to an hour.

- [ ] **Step 2: Manual verification**

This is exercised end-to-end in Task 5 (there's no UI to call it from yet). Confirm it compiles: run `npx tsc --noEmit` and check there are no new errors referencing `actions/menus.ts`.

- [ ] **Step 3: Commit**

```bash
git add actions/menus.ts
git commit -m "feat(nav): add toggleMenuItemVisibility server action"
```

---

## Task 5: Admin visibility screen

**Files:**
- Create: `app/admin/menus/page.tsx`
- Create: `app/admin/menus/MenuVisibilityToggle.tsx`
- Modify: `components/admin/Sidebar.tsx`

**Interfaces:**
- Consumes: `NAV_CONFIG` (Task 2), `toggleMenuItemVisibility` (Task 4), `auth()`, `prisma.menuItemVisibility`.
- Produces: `/admin/menus` route; `MenuVisibilityToggle({ itemKey, initialVisible }: { itemKey: string; initialVisible: boolean })` client component.

- [ ] **Step 1: Write the toggle client component**

```tsx
// app/admin/menus/MenuVisibilityToggle.tsx
'use client';
import { useState, useTransition } from 'react';
import { toggleMenuItemVisibility } from '@/actions/menus';

export function MenuVisibilityToggle({ itemKey, initialVisible }: { itemKey: string; initialVisible: boolean }) {
  const [visible, setVisible] = useState(initialVisible);
  const [isPending, startTransition] = useTransition();

  const handleChange = (checked: boolean) => {
    const previous = visible;
    setVisible(checked);
    startTransition(async () => {
      try {
        await toggleMenuItemVisibility(itemKey, checked);
      } catch {
        setVisible(previous);
        alert('Failed to update visibility.');
      }
    });
  };

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={visible}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.checked)}
        className="h-4 w-4 border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
        style={{ borderRadius: 0 }}
      />
      <span className="text-xs text-[#6B7280]">{visible ? 'Visible' : 'Hidden'}</span>
    </label>
  );
}
```

- [ ] **Step 2: Write the admin page**

```tsx
// app/admin/menus/page.tsx
import { Fragment } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { NAV_CONFIG } from '@/lib/nav-config';
import { MenuVisibilityToggle } from './MenuVisibilityToggle';

const DISPLAY_LABELS: Record<string, string> = {
  about: 'About',
  'about.intro': 'Company Introduction',
  'about.openLetter': 'Open Letter',
  'about.values': 'Core Values',
  'about.legal': 'Legal Documents',
  'about.leadership': 'Leadership',
  'business-segments': 'Business Segments',
  'shareholder-relations': 'Shareholder Relations',
  'shareholder-relations.governance': 'Governance',
  'shareholder-relations.financial-reports': 'Financial Reports',
  'shareholder-relations.annual-reports': 'Annual Reports',
  news: 'News',
  careers: 'Careers',
  activities: 'Activities',
  'activities.internal': 'Internal Activities',
  'activities.social': 'Social Activities',
};

export default async function MenusAdminPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  if ((session.user as any)?.role !== 'SUPER_ADMIN') redirect('/admin/dashboard');

  const rows = await prisma.menuItemVisibility.findMany();
  const hiddenKeys = new Set(rows.filter((r) => !r.isVisible).map((r) => r.key));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1F2937]" style={{ fontFamily: 'var(--font-display)' }}>Menus</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Show or hide items in the public site header. Hiding a page removes it from the nav only — direct links keep working.
        </p>
      </div>
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E9ED]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Item</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase">Visible</th>
            </tr>
          </thead>
          <tbody>
            {NAV_CONFIG.filter((item) => item.key !== 'home').map((item) => (
              <Fragment key={item.key}>
                <tr className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                  <td className="px-4 py-3 font-medium text-[#1F2937]">{DISPLAY_LABELS[item.key] ?? item.key}</td>
                  <td className="px-4 py-3 text-right">
                    <MenuVisibilityToggle itemKey={item.key} initialVisible={!hiddenKeys.has(item.key)} />
                  </td>
                </tr>
                {item.dynamicChildren && (
                  <tr className="border-b border-[#F5F6F8]">
                    <td colSpan={2} className="px-4 py-2 pl-8 text-xs text-[#6B7280]">
                      Sub-items are managed via Business Sectors, not here.
                    </td>
                  </tr>
                )}
                {item.children?.map((child) => (
                  <tr key={child.key} className="border-b border-[#F5F6F8] hover:bg-[#F5F6F8]">
                    <td className="px-4 py-3 pl-8 text-[#374151]">{DISPLAY_LABELS[child.key] ?? child.key}</td>
                    <td className="px-4 py-3 text-right">
                      <MenuVisibilityToggle itemKey={child.key} initialVisible={!hiddenKeys.has(child.key)} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Add the sidebar link**

In `components/admin/Sidebar.tsx`, modify the icon import (line 6-10):

```tsx
import {
  LayoutDashboard, Settings, Home, Layers, Newspaper,
  Briefcase, TrendingUp, Users2, Handshake, FolderOpen,
  Image, MessageSquare, Users, FileText, LogOut, ChevronRight, Menu
} from 'lucide-react';
```

Then modify `navItems` (line 24-25) to insert the new entry before Settings:

```tsx
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/menus', label: 'Menus', icon: Menu },
  { href: '/admin/settings/company', label: 'Settings', icon: Settings },
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Log in as a SUPER_ADMIN user, open `http://localhost:3000/admin/menus`.
- Confirm the "Menus" link appears in the sidebar between Users and Settings.
- Confirm the table lists About (with 5 indented children), Business Segments (with the "managed via Business Sectors" note, no toggle children), Shareholder Relations (with 3 indented children), News, Careers, Activities (with 2 indented children).
- Toggle "Shareholder Relations" off. Confirm the checkbox switches to "Hidden" immediately without a page reload.
- Refresh the page. Confirm it's still showing "Hidden" (persisted).
- Toggle it back on.
- Log in as a non-SUPER_ADMIN user (e.g. CONTENT_MANAGER) and confirm navigating to `/admin/menus` redirects to `/admin/dashboard`.

- [ ] **Step 5: Commit**

```bash
git add app/admin/menus components/admin/Sidebar.tsx
git commit -m "feat(admin): add menu visibility toggle screen"
```

---

## Task 6: i18n keys for dropdown children

**Files:**
- Modify: `content/vi.json`
- Modify: `content/en.json`
- Modify: `content/zh.json`

**Interfaces:**
- Produces: `nav.aboutSections.{intro,openLetter,values,legal,leadership}`, `nav.activitiesSections.{internal,social}` in all 3 locale files. (`investor.documents.{governance,financialReports,annualReports}` already exists — no change needed there.)

- [ ] **Step 1: Edit `content/vi.json`**

Change:
```json
    "activities": "Hoạt động",
    "contact": "Liên hệ"
  },
```
to:
```json
    "activities": "Hoạt động",
    "contact": "Liên hệ",
    "aboutSections": {
      "intro": "Giới thiệu chung",
      "openLetter": "Thư ngỏ",
      "values": "Giá trị cốt lõi",
      "legal": "Pháp lý công ty",
      "leadership": "Ban lãnh đạo"
    },
    "activitiesSections": {
      "internal": "Hoạt động nội bộ",
      "social": "Hoạt động xã hội"
    }
  },
```

- [ ] **Step 2: Edit `content/en.json`**

Change:
```json
    "activities": "Activities",
    "contact": "Contact"
  },
```
to:
```json
    "activities": "Activities",
    "contact": "Contact",
    "aboutSections": {
      "intro": "Company Introduction",
      "openLetter": "Open Letter",
      "values": "Core Values",
      "legal": "Legal Documents",
      "leadership": "Leadership Team"
    },
    "activitiesSections": {
      "internal": "Internal Activities",
      "social": "Social Activities"
    }
  },
```

- [ ] **Step 3: Edit `content/zh.json`**

Change:
```json
    "activities": "企业活动",
    "contact": "联系我们"
  },
```
to:
```json
    "activities": "企业活动",
    "contact": "联系我们",
    "aboutSections": {
      "intro": "公司简介",
      "openLetter": "致辞",
      "values": "核心价值",
      "legal": "公司法律文件",
      "leadership": "领导团队"
    },
    "activitiesSections": {
      "internal": "内部活动",
      "social": "社会活动"
    }
  },
```

- [ ] **Step 4: Manual verification**

Run: `node -e "['vi','en','zh'].forEach(l => { const j = require('./content/' + l + '.json'); console.log(l, JSON.stringify(j.nav.aboutSections), JSON.stringify(j.nav.activitiesSections)); })"`
Expected: valid JSON parses for all 3, each printing 5 and 2 keys respectively with no `undefined`.

- [ ] **Step 5: Commit**

```bash
git add content/vi.json content/en.json content/zh.json
git commit -m "feat(i18n): add nav dropdown child labels"
```

---

## Task 7: Section anchors + hash scroll handler

**Files:**
- Create: `components/public/HashScrollHandler.tsx`
- Modify: `app/(public)/[locale]/about/page.tsx`
- Modify: `app/(public)/[locale]/activities/ActivitiesClient.tsx`

**Interfaces:**
- Produces: `<HashScrollHandler />` (no props, renders `null`), 5 new `id`s on About's sections (`intro`, `open-letter`, `values`, `legal-documents`, `leadership`), 2 new `id`s on Activities' sliders (`internal-activities`, `social-activities`).

- [ ] **Step 1: Write `HashScrollHandler`**

```tsx
// components/public/HashScrollHandler.tsx
'use client';

import { useEffect } from 'react';

export function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
```

- [ ] **Step 2: Add `id`s and the handler to `about/page.tsx`**

Add the import (after the existing `buildMeta` import, line 8):

```tsx
import { buildMeta } from '@/lib/seo';
import { HashScrollHandler } from '@/components/public/HashScrollHandler';
```

Render the handler as the first child inside the outer fragment (line 90-92):

```tsx
  return (
    <>
      <HashScrollHandler />
      {/* ── Hero ─────────────────────────────────── */}
```

Add `id="intro"` (line 144-146):
```tsx
      {/* ── Giới thiệu công ty ────────────────────── */}
      {settings && (
        <section className="section-padding" id="intro">
```

Add `id="open-letter"` (line 182-184):
```tsx
      {/* ── Thư ngỏ ──────────────────────────────── */}
      {settings && (
        <section className="section-padding" id="open-letter" style={{ background: '#f8fbf2' }}>
```

Add `id="values"` (line 240-241):
```tsx
      {/* ── Core Values ──────────────────────────── */}
      <section className="section-padding" id="values">
```

Add `id="legal-documents"` (line 305-306):
```tsx
      {/* ── Pháp lý công ty ──────────────────────── */}
      <section className="section-padding" id="legal-documents" style={{ background: '#f8fbf2' }}>
```

Add `id="leadership"` (line 524-525, inside the leadership IIFE's `return`):
```tsx
        return (
          <section className="section-padding" id="leadership" style={{ background: '#f8fbf2' }}>
```

- [ ] **Step 3: Add `id` prop and the handler to `ActivitiesClient.tsx`**

Add the import (after the `AnimateIn` import, line 6):

```tsx
import { AnimateIn } from '@/components/ui/AnimateIn';
import { HashScrollHandler } from '@/components/public/HashScrollHandler';
```

Extend `ActivitySliderProps` and the component signature (line 14-20):

```tsx
interface ActivitySliderProps {
  title: string;
  items: ActivityItem[];
  locale: string;
  id?: string;
}

function ActivitySlider({ title, items, locale, id }: ActivitySliderProps) {
```

Apply the `id` to the slider's root div (line 42-46):

```tsx
  return (
    <div 
      id={id}
      className="relative group py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
```

Render the handler and pass the two ids through (line 147-158):

```tsx
  return (
    <div className="space-y-16">
      <HashScrollHandler />
      {/* Internal Activities Slider */}
      <AnimateIn>
        <ActivitySlider title={internalTitle} items={internalItems} locale={locale} id="internal-activities" />
      </AnimateIn>

      {/* Social Activities Slider */}
      <AnimateIn delay={0.1}>
        <ActivitySlider title={socialTitle} items={socialItems} locale={locale} id="social-activities" />
      </AnimateIn>
    </div>
  );
}
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Visit `http://localhost:3000/vi/about#leadership` directly — confirm the page loads scrolled (smoothly, not instantly) to the Leadership section. Repeat for `#intro`, `#open-letter`, `#values`, `#legal-documents`. Visit `http://localhost:3000/vi/activities#social-activities` and confirm it scrolls to the Social Activities slider.

- [ ] **Step 5: Commit**

```bash
git add components/public/HashScrollHandler.tsx "app/(public)/[locale]/about/page.tsx" "app/(public)/[locale]/activities/ActivitiesClient.tsx"
git commit -m "feat(nav): add section anchor ids and hash scroll handler"
```

---

## Task 8: Public dropdown navigation

**Files:**
- Create: `components/public/NavDropdown.tsx`
- Modify: `components/public/Header.tsx`
- Modify: `app/(public)/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `NAV_CONFIG`, `filterVisibleNav` (Task 2), `getHiddenMenuKeys` (Task 3), `getActiveBusinessSectors` (existing, `lib/queries.ts`), section `id`s (Task 7), `nav.aboutSections`/`nav.activitiesSections` (Task 6).
- Produces: `<NavDropdown>` component; `<Header hiddenKeys={string[]} businessSectors={BusinessSectorLite[]} />` (new required props).

- [ ] **Step 1: Write `NavDropdown`**

```tsx
// components/public/NavDropdown.tsx
'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResolvedNavChild {
  key: string;
  label: string;
  type: 'anchor' | 'route';
  target: string;
}

interface NavDropdownProps {
  href: string;
  label: string;
  active: boolean;
  children: ResolvedNavChild[];
  onAnchorClick: (target: string) => void;
}

export function NavDropdown({ href, label, active, children, onAnchorClick }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <Link
        ref={triggerRef}
        href={href}
        className={cn(
          'flex items-center gap-1 px-3 py-5 text-sm transition-colors border-b-2',
          active
            ? 'border-[#8ec63f] text-[var(--color-primary-dark)] font-semibold'
            : 'border-transparent text-[#374151] hover:text-[var(--color-primary-dark)]'
        )}
      >
        {label}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </Link>

      {open && (
        <div
          className="absolute left-0 top-full bg-white z-50 min-w-[220px] py-2"
          style={{ borderRadius: '4px', border: '1px solid #defbbc', boxShadow: '0 8px 24px rgba(1,82,49,0.1)' }}
        >
          {children.map((child) =>
            child.type === 'anchor' ? (
              <button
                key={child.key}
                onClick={() => { setOpen(false); onAnchorClick(child.target); }}
                className="block w-full text-left px-4 py-2 text-sm text-[#374151] hover:text-[var(--color-primary-dark)] hover:bg-[#f8fbf2] transition-colors"
              >
                {child.label}
              </button>
            ) : (
              <Link
                key={child.key}
                href={child.target}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-[#374151] hover:text-[var(--color-primary-dark)] hover:bg-[#f8fbf2] transition-colors"
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `Header.tsx`**

Replace the entire file:

```tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useMemo, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_CONFIG, filterVisibleNav, type NavItem } from '@/lib/nav-config';
import { NavDropdown, type ResolvedNavChild } from './NavDropdown';

const localeLabels: Record<string, string> = { vi: 'VI', en: 'EN', zh: '中' };
const locales = ['vi', 'en', 'zh'];

const flags: Record<string, React.ReactNode> = {
  vi: (
    <svg viewBox="0 0 30 20" className="w-5 h-3.5 shadow-sm border border-gray-200 rounded-sm">
      <rect width="30" height="20" fill="#da251d" />
      <polygon points="15,4 16.2,8.5 21,8.5 17.1,11.3 18.6,16 15,13 11.4,16 12.9,11.3 9,8.5 13.8,8.5" fill="#ffff00" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" className="w-5 h-3.5 shadow-sm border border-gray-200 rounded-sm">
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#s)" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 30 20" className="w-5 h-3.5 shadow-sm border border-gray-200 rounded-sm">
      <rect width="30" height="20" fill="#ee1c25" />
      <polygon points="5,5 5.6,3.2 6.2,5 7.8,5 6.5,6 7,7.8 5.6,6.7 4.2,7.8 4.7,6 3.4,5" fill="#ffde00" />
      <polygon points="10,2 10.2,1.3 10.4,2 11,2 10.5,2.4 10.7,3 10.2,2.6 9.7,3 9.9,2.4 9.4,2" fill="#ffde00" />
      <polygon points="12,4 12.2,3.3 12.4,4 13,4 12.5,4.4 12.7,5 12.2,4.6 11.7,5 11.9,4.4 11.4,4" fill="#ffde00" />
      <polygon points="12,7 12.2,6.3 12.4,7 13,7 12.5,7.4 12.7,8 12.2,7.6 11.7,8 11.9,7.4 11.4,7" fill="#ffde00" />
      <polygon points="10,9 10.2,8.3 10.4,9 11,9 10.5,9.4 10.7,10 10.2,9.6 9.7,10 9.9,9.4 9.4,9" fill="#ffde00" />
    </svg>
  ),
};

interface BusinessSectorLite {
  slug: string;
  nameVI: string;
  nameEN: string;
  nameZH: string;
}

interface HeaderProps {
  hiddenKeys: string[];
  businessSectors: BusinessSectorLite[];
}

export function Header({ hiddenKeys, businessSectors }: HeaderProps) {
  const t = useTranslations('nav');
  const tAboutSections = useTranslations('nav.aboutSections');
  const tActivitiesSections = useTranslations('nav.activitiesSections');
  const tInvestorDocuments = useTranslations('investor.documents');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<Set<string>>(new Set());

  const hiddenSet = useMemo(() => new Set(hiddenKeys), [hiddenKeys]);
  const visibleNav = useMemo(() => filterVisibleNav(NAV_CONFIG, hiddenSet), [hiddenSet]);

  const childLabel = (parentKey: string, labelKey: string): string => {
    if (parentKey === 'about') return tAboutSections(labelKey);
    if (parentKey === 'activities') return tActivitiesSections(labelKey);
    if (parentKey === 'shareholder-relations') return tInvestorDocuments(labelKey);
    return labelKey;
  };

  const resolveChildren = (item: NavItem): ResolvedNavChild[] => {
    if (item.dynamicChildren === 'business-sectors') {
      const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';
      return businessSectors.map((s) => ({
        key: `business-segments.${s.slug}`,
        label: (s as any)[`name${L}`] ?? s.nameVI,
        type: 'route' as const,
        target: `/${locale}/business-segments/${s.slug}`,
      }));
    }
    if (!item.children) return [];
    return item.children.map((c) => ({
      key: c.key,
      label: childLabel(item.key, c.labelKey),
      type: c.type,
      target: c.type === 'route' ? `/${locale}${c.target}` : c.target,
    }));
  };

  const itemHref = (item: NavItem) => (item.href === '/' ? `/${locale}` : `/${locale}${item.href}`);

  const isActive = (href: string) => {
    const isHome = href === `/${locale}`;
    return isHome ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  };

  const handleAnchorClick = (parentHref: string) => (target: string) => {
    const onThisPage = pathname === parentHref || pathname.startsWith(parentHref + '/');
    if (onThisPage) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `${parentHref}#${target}`;
    }
  };

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    window.location.href = segments.join('/');
  };

  const toggleMobileExpand = (key: string) => {
    setExpandedMobile((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white" style={{ borderBottom: '2px solid #defbbc', boxShadow: '0 2px 12px rgba(1,82,49,0.06)' }}>
      <div className="container-max flex items-center justify-between" style={{ height: '64px' }}>

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="LMX Alliance"
            width={320}
            height={120}
            className="object-contain"
            style={{ height: '120px', width: 'auto', maxWidth: '320px', paddingTop: '12px' }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center">
          {visibleNav.map((item) => {
            const href = itemHref(item);
            const active = isActive(href);
            const children = resolveChildren(item);

            if (children.length > 0) {
              return (
                <NavDropdown
                  key={item.key}
                  href={href}
                  label={t(item.labelKey)}
                  active={active}
                  children={children}
                  onAnchorClick={handleAnchorClick(href)}
                />
              );
            }

            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  'px-3 py-5 text-sm transition-colors border-b-2',
                  active
                    ? 'border-[#8ec63f] text-[var(--color-primary-dark)] font-semibold'
                    : 'border-transparent text-[#374151] hover:text-[var(--color-primary-dark)]'
                )}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language flags switcher side-by-side */}
          <div className="flex items-center gap-2">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  "p-1 transition-all rounded hover:scale-110",
                  l === locale 
                    ? "border bg-[#f8fbf2] scale-105" 
                    : "border border-transparent opacity-60 hover:opacity-100"
                )}
                style={{
                  borderColor: l === locale ? '#8ec63f' : 'transparent'
                }}
                title={localeLabels[l]}
                aria-label={`Switch language to ${localeLabels[l]}`}
              >
                {flags[l]}
              </button>
            ))}
          </div>

          <Link
            href={`/${locale}/contact`}
            className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-medium transition-all"
            style={{ background: '#8ec63f', color: 'var(--color-primary-mid)', borderRadius: '4px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-dark)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#8ec63f'; e.currentTarget.style.color = 'var(--color-primary-mid)'; }}
          >
            {t('contact')}
          </Link>

          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: 'var(--color-primary-dark)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="lg:hidden absolute left-0 right-0 bg-white z-50 max-h-[calc(100vh-64px)] overflow-y-auto"
          style={{ top: '64px', borderBottom: '1px solid #defbbc', boxShadow: '0 8px 24px rgba(1,82,49,0.1)' }}
        >
          {visibleNav.map((item) => {
            const href = itemHref(item);
            const active = isActive(href);
            const children = resolveChildren(item);
            const expanded = expandedMobile.has(item.key);

            return (
              <div key={item.key} style={{ borderBottom: '1px solid #f8fbf2' }}>
                <div className="flex items-center">
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex items-center px-6 py-3.5 text-sm transition-colors"
                    style={{
                      color: active ? 'var(--color-primary-dark)' : '#374151',
                      fontWeight: active ? 600 : 400,
                      borderLeft: active ? '3px solid #8ec63f' : '3px solid transparent',
                      background: active ? '#f8fbf2' : 'transparent',
                    }}
                  >
                    {t(item.labelKey)}
                  </Link>
                  {children.length > 0 && (
                    <button
                      onClick={() => toggleMobileExpand(item.key)}
                      className="px-4 py-3.5 text-[#374151]"
                      aria-label={expanded ? 'Collapse' : 'Expand'}
                      aria-expanded={expanded}
                    >
                      <ChevronDown size={16} className={cn('transition-transform', expanded && 'rotate-180')} />
                    </button>
                  )}
                </div>
                {children.length > 0 && expanded && (
                  <div className="pb-2">
                    {children.map((child) =>
                      child.type === 'anchor' ? (
                        <button
                          key={child.key}
                          onClick={() => { setMenuOpen(false); handleAnchorClick(href)(child.target); }}
                          className="block w-full text-left pl-10 pr-6 py-2.5 text-sm text-[#374151]"
                        >
                          {child.label}
                        </button>
                      ) : (
                        <Link
                          key={child.key}
                          href={child.target}
                          onClick={() => setMenuOpen(false)}
                          className="block pl-10 pr-6 py-2.5 text-sm text-[#374151]"
                        >
                          {child.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href={`/${locale}/contact`}
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-6 py-3.5 text-sm transition-colors"
            style={{
              color: pathname === `/${locale}/contact` ? 'var(--color-primary-dark)' : '#374151',
              fontWeight: pathname === `/${locale}/contact` ? 600 : 400,
              borderLeft: pathname === `/${locale}/contact` ? '3px solid #8ec63f' : '3px solid transparent',
              background: pathname === `/${locale}/contact` ? '#f8fbf2' : 'transparent',
            }}
          >
            {t('contact')}
          </Link>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Wire the layout**

In `app/(public)/[locale]/layout.tsx`, modify the imports (line 9):

```tsx
import { getCachedCompanySettings } from '@/lib/cached';
import { getHiddenMenuKeys, getActiveBusinessSectors } from '@/lib/queries';
```

Modify the data fetch and `<Header>` usage (line 50-54):

```tsx
  const [settings, hiddenKeys, businessSectors] = await Promise.all([
    getCachedCompanySettings(),
    getHiddenMenuKeys(),
    getActiveBusinessSectors(),
  ]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header hiddenKeys={hiddenKeys} businessSectors={businessSectors} />
```

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. On desktop viewport (`http://localhost:3000/vi`):
- Hover "Giới thiệu" — confirm a dropdown appears listing the 5 About sub-items; click "Ban lãnh đạo" and confirm it smooth-scrolls to the Leadership section on the same page.
- Navigate to `/vi/news`, hover "Giới thiệu" again, click "Ban lãnh đạo" — confirm it navigates to `/vi/about#leadership` and lands scrolled to that section.
- Hover "Quan hệ cổ đông" — confirm 3 route children (Governance, Financial Reports, Annual Reports); click one and confirm it navigates to the corresponding `/vi/shareholder-relations/...` route.
- Hover "Lĩnh vực hoạt động" — confirm the dropdown lists the live Business Sectors from the DB, each linking to `/vi/business-segments/<slug>`.
- Tab through the header with the keyboard: confirm focusing "Giới thiệu" opens its dropdown, and pressing `Escape` closes it and keeps focus on "Giới thiệu".
- Confirm "Tin tức" and "Tuyển dụng" render as plain links with no dropdown/chevron.
- On mobile viewport (resize below `lg`), open the hamburger menu — confirm each dropdown-bearing item shows a chevron button that expands/collapses an indented child list on tap, while tapping the label itself still navigates.
- Go to `/admin/menus`, toggle "Quan hệ cổ đông" off, then reload `/vi` — confirm "Quan hệ cổ đông" no longer appears in the header (may take a moment due to `revalidateTag`), but `http://localhost:3000/vi/shareholder-relations` still loads directly. Toggle it back on afterward.

- [ ] **Step 5: Commit**

```bash
git add components/public/NavDropdown.tsx components/public/Header.tsx "app/(public)/[locale]/layout.tsx"
git commit -m "feat(nav): add dropdown navigation to public header"
```

---

## Self-Review

**Spec coverage:**
- Mixed anchor/route dropdown targets → Task 2 (`NAV_CONFIG`), Task 8 (`NavDropdown` handles both types). ✅
- Menu structure fixed in code, admin only toggles visibility → Task 2 + Task 5 (no label/reorder/add/remove UI). ✅
- Hiding is nav-only, direct links still work → Task 8 verification step explicitly checks this. ✅
- Global-across-locales visibility → single `MenuItemVisibility` table, no locale column (Task 1). ✅
- Click navigates, hover/tap reveals dropdown → `NavDropdown`'s `<Link>` trigger + hover/focus panel; mobile chevron button (Task 8). ✅
- Business Segments dynamic children via `BusinessSector.status`, not the toggle system → Task 8's `resolveChildren` pulls from `getActiveBusinessSectors` (already status-filtered), and Task 5's admin page explicitly excludes per-sector toggle rows. ✅
- SUPER_ADMIN-only admin screen → Task 5 Step 2 uses the exact `session.user.role !== 'SUPER_ADMIN'` redirect pattern from `app/admin/users/page.tsx`. ✅
- `MenuItemVisibility` data model → Task 1, matches `MediaFile.uploadedBy` string-not-relation precedent. ✅
- Fail-open (no row = visible) → `getHiddenMenuKeys` only selects `isVisible: false` rows; `filterVisibleNav` only removes keys present in the hidden set (Tasks 2-3). ✅
- Admin UI with per-item toggle, nested children, Business Segments note → Task 5. ✅
- Toggle Server Action with audit log, no confirmation dialog (reversible) → Task 4 + Task 5's `MenuVisibilityToggle` (optimistic update, rollback on error, no `confirm()`). ✅
- Public dropdown component: desktop hover/focus-within + Escape-to-trigger-focus, anchor same-page-scroll vs cross-page-navigate-then-scroll, route children as plain links, mobile chevron accordion → Task 8. ✅
- `id` attributes on About/Activities sections → Task 7. ✅
- New i18n keys for child labels, reusing existing `investor.documents.*` → Task 6 (no `nav.shareholderRelations.*` added, matching the decision to reuse `investor.documents`). ✅
- Testing section reinterpreted per user's explicit instruction: no automated tests; every task's manual verification step covers what the spec's Playwright/manual bullets described. ✅
- Out of scope items (bulk actions, floating quick-nav, full menu builder) are not touched by any task. ✅

**Placeholder scan:** No TBD/TODO markers; every step has complete, runnable code and exact commands.

**Type consistency:** `NavChild`/`NavItem` (Task 2) are consumed identically in Task 5 (`item.children`, `item.dynamicChildren`) and Task 8 (`resolveChildren`, `itemHref`). `ResolvedNavChild` (Task 8, `NavDropdown.tsx`) matches the shape both `resolveChildren` in `Header.tsx` and the mobile accordion render use. `toggleMenuItemVisibility(key: string, isVisible: boolean)` (Task 4) matches the call site in `MenuVisibilityToggle.tsx` (Task 5). `getHiddenMenuKeys(): Promise<string[]>` (Task 3) matches its consumption in `layout.tsx` (Task 8) and the `Header` prop type `hiddenKeys: string[]`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-13-nav-dropdown-and-menu-visibility.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
