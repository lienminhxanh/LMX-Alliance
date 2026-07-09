# Phase 2 — Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the four new presentational components named in the Phase 2 spec section (`SectionHeading`, `StatBlock`, `DomainCard`, `ProjectCard`), consuming Phase 1's tokens, and confirm `PartnerMarquee` needs no changes — without wiring any of them into existing pages or touching the database.

**Architecture:** Four standalone, self-contained React components — two generic (`components/ui/`), two public-domain-specific (`components/public/`) — each importable in isolation. None are wired into `app/(public)/[locale]/page.tsx` or any other existing page in this phase; that assembly is Phase 3's job. `ProjectCard` accepts `scale`/`location` as plain optional string props with no Prisma involvement — Phase 3 adds the real schema fields and passes real data in.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), Tailwind v4 (CSS-first `@theme`/`:root` tokens already defined in `app/globals.css`), `framer-motion` via the existing `AnimateIn` wrapper, `lucide-react` icons, `@/lib/utils` `cn()` helper.

## Global Constraints

- Không phá i18n/routing/API. Chỉ sửa lớp UI/presentation.
- No public placeholder/dummy data of any kind.
- Radius ≤5px everywhere; no pill shapes. `rounded-full` is reserved for true circles/decorative accents only (matches Phase 1's precedent already in `PartnerMarquee.tsx`'s accent bar).
- Font: components must reference `var(--font-display)` / rely on the Tailwind `font-sans` default (which resolves to `--font-body`) — never hardcode a font-family string. Both vars already resolve to Be Vietnam Pro as of Phase 1.
- Reuse existing tokens verbatim, do not redefine or add new ones: `--color-primary` (#8ec63f), `--color-primary-dark` (#015231, canonical badge/tag text), `--color-lime-pale` (#defbbc, canonical badge/tag background), `--color-primary-hover` (#7ab332), `--color-neutral-dark` (#6B7280, secondary text).
- `components/ui/Button.tsx` must not be modified or imported into these components — none of the four components render a button/CTA that would route through it.
- New files only. Do not modify any existing page file (`app/(public)/[locale]/page.tsx`, `business-segments/page.tsx`, etc.) or `components/ui/CountUp.tsx` — all are pre-existing, unrelated uncommitted work-in-progress on this branch and out of scope for this phase.
- `ProjectCard` takes `scale`/`location` as optional (`string | undefined`) presentational props only. No Prisma schema change, no `Project.published` field, no data-fetching code — that is Phase 3 scope.
- No test framework exists in this repo (confirmed: no vitest/jest/testing-library/playwright in `package.json`). Verification per task is: `npx tsc --noEmit` passes, plus a temporary throwaway preview route (`app/(public)/[locale]/_preview-phase2/page.tsx`) created to render the component with representative props, screenshotted or read via browser snapshot, then deleted before commit — the component file is what gets committed, not the scaffold.

---

## File Structure

- **`components/ui/SectionHeading.tsx`** (new) — generic eyebrow-label + accent rule + title block. Used by any section (Business Sectors, Statistics, Featured Projects in Phase 3) that currently uses an ad hoc `<p className="uppercase">…</p>` + `<h2>` pair.
- **`components/ui/StatBlock.tsx`** (new) — thin composition wrapper around the existing `CountUp` component, adding the new type-scale/spacing treatment. Does not modify `CountUp.tsx`; imports it.
- **`components/public/DomainCard.tsx`** (new) — image + icon badge overlapping the image's bottom edge + title + summary + "learn more" link, for `BusinessSector` records. Supersedes the inline card markup in `page.tsx` conceptually, but that swap-in is Phase 3's wiring job, not this task's.
- **`components/public/ProjectCard.tsx`** (new) — image + category badge (sourced from a `status` prop) + name + optional scale/location metadata line, for `Project` records.
- **No file change: `components/public/PartnerMarquee.tsx`.** Verified already compliant (see Task 5) — radius on its `PartnerLogoFallback` badge is `rounded-[4px]`, the only `rounded-full` usage is the decorative 3px accent bar (acceptable per Phase 1's circles-are-not-pills rule), and its heading already uses `fontFamily: 'var(--font-display)'`.

---

### Task 1: SectionHeading

**Files:**
- Create: `components/ui/SectionHeading.tsx`

**Interfaces:**
- Produces: `SectionHeading({ eyebrow, title, align, className }: SectionHeadingProps)` where
  `interface SectionHeadingProps { eyebrow: string; title: string; align?: 'left' | 'center'; className?: string }`
  Default `align = 'left'`.

- [ ] **Step 1: Write the component**

```tsx
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, title, align = 'left', className }: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={cn(isCenter ? 'text-center' : 'text-left', className)}>
      <p
        className="text-xs uppercase tracking-widest font-semibold mb-2"
        style={{ color: 'var(--color-primary-dark)' }}
      >
        {eyebrow}
      </p>
      <div
        className={cn('h-[3px] w-10 mb-4', isCenter && 'mx-auto')}
        style={{ background: 'var(--color-primary)', borderRadius: '4px' }}
      />
      <h2 style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors referencing `SectionHeading.tsx`.

- [ ] **Step 3: Render check via temporary preview route**

Create `app/(public)/[locale]/_preview-phase2/page.tsx`:

```tsx
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function PreviewPage() {
  return (
    <div className="p-12 space-y-16">
      <SectionHeading eyebrow="Lĩnh vực hoạt động" title="Ngành nghề kinh doanh" />
      <SectionHeading eyebrow="Đối tác chiến lược" title="Đối tác của chúng tôi" align="center" />
    </div>
  );
}
```

Run `npm run dev`, load `/vi/_preview-phase2`, confirm: eyebrow text is uppercase in `#015231`, a short `4px`-radius green rule sits under it, title renders in the display font, `align="center"` centers all three lines. Then delete `app/(public)/[locale]/_preview-phase2/` entirely — it must not be committed.

- [ ] **Step 4: Commit**

```bash
git add components/ui/SectionHeading.tsx
git commit -m "feat(ui): add SectionHeading component"
```

---

### Task 2: StatBlock

**Files:**
- Create: `components/ui/StatBlock.tsx`

**Interfaces:**
- Consumes: `CountUp({ value, label }: { value: string; label: string })` from `components/ui/CountUp.tsx` (unmodified — read-only import).
- Produces: `StatBlock({ value, label, className }: StatBlockProps)` where
  `interface StatBlockProps { value: string; label: string; className?: string }`

- [ ] **Step 1: Write the component**

```tsx
import { cn } from '@/lib/utils';
import { CountUp } from '@/components/ui/CountUp';

interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBlock({ value, label, className }: StatBlockProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <CountUp value={value} label={label} />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors referencing `StatBlock.tsx`.

- [ ] **Step 3: Render check via temporary preview route**

Create `app/(public)/[locale]/_preview-phase2/page.tsx`:

```tsx
import { StatBlock } from '@/components/ui/StatBlock';

export default function PreviewPage() {
  return (
    <div className="p-12 grid grid-cols-2 md:grid-cols-4 gap-10" style={{ background: '#015231' }}>
      <StatBlock value="25+" label="Năm kinh nghiệm" />
      <StatBlock value="120" label="Dự án hoàn thành" />
      <StatBlock value="3500" label="Nhân viên" />
      <StatBlock value="98%" label="Khách hàng hài lòng" />
    </div>
  );
}
```

Run `npm run dev`, load `/vi/_preview-phase2`, confirm four stat blocks count up and render identically to the existing Statistics section's look (white bold number, lime suffix, uppercase gray label). Then delete `app/(public)/[locale]/_preview-phase2/` entirely.

- [ ] **Step 4: Commit**

```bash
git add components/ui/StatBlock.tsx
git commit -m "feat(ui): add StatBlock component wrapping CountUp"
```

---

### Task 3: DomainCard

**Files:**
- Create: `components/public/DomainCard.tsx`

**Interfaces:**
- Consumes: `AnimateIn` from `components/ui/AnimateIn.tsx` (`{ children, delay?, from?, scale?, className? }`), a `LucideIcon` type from `lucide-react`.
- Produces: `DomainCard({ icon, image, title, summary, href, delay, className }: DomainCardProps)` where
  `interface DomainCardProps { icon: LucideIcon; image?: string | null; title: string; summary: string; href: string; delay?: number; className?: string }`

- [ ] **Step 1: Write the component**

```tsx
import { LucideIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimateIn } from '@/components/ui/AnimateIn';

interface DomainCardProps {
  icon: LucideIcon;
  image?: string | null;
  title: string;
  summary: string;
  href: string;
  delay?: number;
  className?: string;
}

export function DomainCard({ icon: Icon, image, title, summary, href, delay = 0, className }: DomainCardProps) {
  return (
    <AnimateIn delay={delay} className={className}>
      <Link
        href={href}
        className="card-lift bg-white h-full flex flex-col group cursor-pointer border block"
        style={{ borderColor: 'var(--color-lime-pale)', borderRadius: '4px', overflow: 'hidden' }}
        aria-label={title}
      >
        <div className="relative">
          {image && (
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
          <div
            className="absolute left-6 flex items-center justify-center w-14 h-14 bg-white shadow-md"
            style={{ bottom: image ? '-28px' : undefined, top: image ? undefined : '16px', borderRadius: '4px' }}
          >
            <Icon size={26} style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
          </div>
        </div>
        <div className={cn('p-8 flex-1 flex flex-col', image && 'pt-10')}>
          <h3 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
          <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--color-neutral-dark)' }}>
            {summary}
          </p>
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium link-underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Xem thêm <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </AnimateIn>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors referencing `DomainCard.tsx`.

- [ ] **Step 3: Render check via temporary preview route**

Create `app/(public)/[locale]/_preview-phase2/page.tsx`:

```tsx
import { Building2, Truck, Recycle } from 'lucide-react';
import { DomainCard } from '@/components/public/DomainCard';

export default function PreviewPage() {
  return (
    <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <DomainCard
        icon={Building2}
        image={null}
        title="Xây lắp công nghiệp"
        summary="Thi công, xây lắp các công trình công nghiệp quy mô lớn trên toàn quốc."
        href="/vi/business-segments/construction"
      />
      <DomainCard
        icon={Truck}
        image={null}
        title="Logistics"
        summary="Dịch vụ vận tải, kho bãi và chuỗi cung ứng toàn diện."
        href="/vi/business-segments/logistics"
      />
      <DomainCard
        icon={Recycle}
        image={null}
        title="Xử lý chất thải"
        summary="Giải pháp xử lý và tái chế chất thải công nghiệp bền vững."
        href="/vi/business-segments/waste"
      />
    </div>
  );
}
```

Run `npm run dev`, load `/vi/_preview-phase2`, confirm: card has a `4px`-radius white icon badge sitting at the card's top (since `image={null}` here — re-test with a real image URL from an existing `BusinessSector.thumbnail` value to confirm the badge overlaps the image's bottom edge as intended), title in display font, summary in `--color-neutral-dark`, hover lifts via `card-lift` and scales the image. Then delete `app/(public)/[locale]/_preview-phase2/` entirely.

- [ ] **Step 4: Commit**

```bash
git add components/public/DomainCard.tsx
git commit -m "feat(public): add DomainCard component"
```

---

### Task 4: ProjectCard

**Files:**
- Create: `components/public/ProjectCard.tsx`

**Interfaces:**
- Consumes: `AnimateIn` from `components/ui/AnimateIn.tsx`, `Badge` from `components/ui/Badge.tsx` is NOT reused directly (its variant palette is gray/green/amber/red/blue, not the badge-pairing tokens this spec calls for) — `ProjectCard` renders its own inline badge span using `--color-lime-pale`/`--color-primary-dark` per the spec's explicit pairing.
- Produces: `ProjectCard({ image, status, name, scale, location, href, delay, className }: ProjectCardProps)` where
  `interface ProjectCardProps { image?: string | null; status: 'ONGOING' | 'COMPLETED' | 'ARCHIVED'; name: string; scale?: string; location?: string; href: string; delay?: number; className?: string }`
  (the `status` union matches the existing `ProjectStatus` Prisma enum verbatim, so Phase 3 can pass `project.status` straight through with no mapping).

- [ ] **Step 1: Write the component**

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Ruler } from 'lucide-react';
import { AnimateIn } from '@/components/ui/AnimateIn';

interface ProjectCardProps {
  image?: string | null;
  status: 'ONGOING' | 'COMPLETED' | 'ARCHIVED';
  name: string;
  scale?: string;
  location?: string;
  href: string;
  delay?: number;
  className?: string;
}

const statusLabel: Record<ProjectCardProps['status'], string> = {
  ONGOING: 'Đang triển khai',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Lưu trữ',
};

export function ProjectCard({ image, status, name, scale, location, href, delay = 0, className }: ProjectCardProps) {
  const hasMeta = Boolean(scale || location);

  return (
    <AnimateIn delay={delay} className={className}>
      <Link
        href={href}
        className="card-lift bg-white h-full flex flex-col group cursor-pointer border block"
        style={{ borderColor: 'var(--color-lime-pale)', borderRadius: '4px', overflow: 'hidden' }}
        aria-label={name}
      >
        {image && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <span
            className="inline-flex self-start items-center px-2 py-0.5 text-xs font-medium mb-3"
            style={{ background: 'var(--color-lime-pale)', color: 'var(--color-primary-dark)', borderRadius: '4px' }}
          >
            {statusLabel[status]}
          </span>
          <h3 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            {name}
          </h3>
          {hasMeta && (
            <div className="mt-auto pt-3 flex flex-col gap-1.5 text-sm" style={{ color: 'var(--color-neutral-dark)' }}>
              {scale && (
                <span className="inline-flex items-center gap-1.5">
                  <Ruler size={14} style={{ color: 'var(--color-primary)' }} />
                  {scale}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                  {location}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </AnimateIn>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors referencing `ProjectCard.tsx`.

- [ ] **Step 3: Render check via temporary preview route**

Create `app/(public)/[locale]/_preview-phase2/page.tsx`:

```tsx
import { ProjectCard } from '@/components/public/ProjectCard';

export default function PreviewPage() {
  return (
    <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <ProjectCard
        image={null}
        status="ONGOING"
        name="Khu công nghiệp Long An"
        scale="50ha"
        location="Long An"
        href="/vi/projects/kcn-long-an"
      />
      <ProjectCard
        image={null}
        status="COMPLETED"
        name="Nhà máy xử lý chất thải Bình Dương"
        href="/vi/projects/nha-may-binh-duong"
      />
      <ProjectCard
        image={null}
        status="ARCHIVED"
        name="Kho vận Đồng Nai"
        scale="12,000 m²"
        location="Đồng Nai"
        href="/vi/projects/kho-van-dong-nai"
      />
    </div>
  );
}
```

Run `npm run dev`, load `/vi/_preview-phase2`, confirm: status badge renders `--color-lime-pale` background with `--color-primary-dark` text at `4px` radius, name in display font, the metadata line (scale/location with icons) appears only for the two cards that pass those props and is fully absent (no empty gap) for the middle card. Then delete `app/(public)/[locale]/_preview-phase2/` entirely.

- [ ] **Step 4: Commit**

```bash
git add components/public/ProjectCard.tsx
git commit -m "feat(public): add ProjectCard component"
```

---

### Task 5: Verify PartnerMarquee token compliance (no code changes expected)

**Files:**
- Read-only: `components/public/PartnerMarquee.tsx`

**Interfaces:** none — this task produces a verification note, not a code change.

- [ ] **Step 1: Grep for non-compliant radius/font usage**

Run: `grep -n "rounded-full\|border-radius\|9999px\|fontFamily" components/public/PartnerMarquee.tsx`

Expected output (already true as of this plan's writing — confirm it still holds):
```
8:    <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 bg-gradient-to-br from-[#8ec63f] to-[#015231] rounded-[4px] shadow-sm flex-shrink-0">
29:              <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-wide" style={{ color: '#015231', fontFamily: 'var(--font-display)' }}>
32:              <div className="w-10 h-[3px] bg-[#8ec63f] mx-auto mt-2 rounded-full" />
```

The only `rounded-full` is the 3px decorative accent bar (line 32) — a hairline rule, not a pill button/card, consistent with Phase 1's circles-are-not-pills rule. The logo-fallback badge is already `rounded-[4px]` (line 8) and the heading already consumes `var(--font-display)` (line 29).

- [ ] **Step 2: Record the finding**

If the grep output matches the expected output above: no code change needed. Append one line to `.superpowers/sdd/progress.md`:
```
Task 5: PartnerMarquee verified token-compliant, no changes needed (rounded-[4px] badge, var(--font-display) heading, sole rounded-full is a 3px decorative accent bar).
```

If the grep output differs (e.g., a new hardcoded pill or font string appears), stop and report — do not silently edit the file. Flag it as a plan deviation for the controller to decide the fix.

- [ ] **Step 3: No commit** — this task makes no file changes, so there is nothing to commit beyond the progress ledger update (which is not part of the application code).

---

## Self-Review Notes

- **Spec coverage:** All four Phase 2 spec bullets (`SectionHeading`, `StatBlock`, `DomainCard`, `ProjectCard`) map to Task 1-4. `PartnerStrip` explicitly needs no new component per the spec — covered by Task 5's verification instead of a build task. `Button.tsx` explicitly gets no task, matching "no change" in the spec.
- **Placeholder scan:** every task has complete component code, not descriptions. No TBD/TODO.
- **Type consistency:** `ProjectCardProps.status` union (`'ONGOING' | 'COMPLETED' | 'ARCHIVED'`) matches the `ProjectStatus` Prisma enum verbatim so Phase 3 needs no mapping layer. `DomainCard`'s `icon: LucideIcon` matches the `lucide-react` icon component type already used inline in the current (uncommitted) sector-card markup. All four components import `AnimateIn`/`cn` with the exact signatures read from the existing files — no invented props.
