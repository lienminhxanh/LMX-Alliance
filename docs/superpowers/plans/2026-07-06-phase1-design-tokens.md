# Phase 1 — Design Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap the site font to Be Vietnam Pro, flatten every corner radius to
≤5px with no pill shapes, and add the two practical color tokens Phase 2
components will need — without touching admin, without a full color ramp,
and without sweeping any inline hex already in shipped pages.

**Architecture:** All changes are CSS custom properties in `app/globals.css`
plus the font loader in `app/layout.tsx`, plus four direct inline-style edits
on public files that hardcode `borderRadius: '9999px'`. No new files, no
component changes — that's Phase 2.

**Tech Stack:** Next.js 14 App Router, `next/font/google`, Tailwind v4
CSS-first config (`@theme` in `globals.css`), plain CSS custom properties.

## Global Constraints

- Không phá i18n/routing/API — chỉ sửa lớp UI/presentation.
- Do not touch `components/ui/Button.tsx` or any admin file — confirmed zero
  admin usage of `.card-lift`/`.skeleton`/`--radius-*` vars outside
  `globals.css` itself, so this phase is public-only by construction.
- No pill shapes anywhere (`border-radius` ≤ 4px on every rectangular
  button/card touched); true circles (dots, icon roundels, `FloatingContact`
  FAB) are left as `rounded-full` — they are not pills.
- No full 50–900 color ramp. Only add `--color-primary-hover`; document the
  existing `--color-lime-pale` / `--color-primary-dark` pairing as the
  canonical badge colors (no new vars needed for that).
- Do not sweep raw inline hex on pages not listed in this plan's tasks.

---

### Task 1: Swap font loader — Roboto → Be Vietnam Pro

**Files:**
- Modify: `app/layout.tsx:1-12` (import + font loader) and `:32` (className)

**Interfaces:**
- Produces: CSS variable `--font-be-vietnam-pro`, replacing `--font-roboto`,
  applied to `<html>` via `beVietnamPro.variable`. Task 2 consumes this exact
  variable name in `globals.css`.

- [ ] **Step 1: Read the current file to confirm nothing has drifted**

Run: `Get-Content app/layout.tsx` (or open in editor) — confirm lines 1-12 and
32 still match:
```tsx
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});
```
and
```tsx
    <html lang="vi" className={`h-full ${roboto.variable}`} suppressHydrationWarning>
```
If these don't match exactly, stop and re-read the file before editing —
someone else changed it.

- [ ] **Step 2: Replace the import and font loader**

Change:
```tsx
import { Roboto } from 'next/font/google';
```
to:
```tsx
import { Be_Vietnam_Pro } from 'next/font/google';
```

Change:
```tsx
const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});
```
to:
```tsx
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});
```

- [ ] **Step 3: Update the className reference**

Change:
```tsx
    <html lang="vi" className={`h-full ${roboto.variable}`} suppressHydrationWarning>
```
to:
```tsx
    <html lang="vi" className={`h-full ${beVietnamPro.variable}`} suppressHydrationWarning>
```

- [ ] **Step 4: Verify the dev server compiles**

Run: `pnpm dev` (or if already running, check the terminal), then load
`http://localhost:3000/vi` in a browser.
Expected: page loads with no build error referencing `Be_Vietnam_Pro` or
`roboto` (a "roboto is not defined" error means Step 3 was missed).

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(tokens): swap site font from Roboto to Be Vietnam Pro"
```

---

### Task 2: Point `--font-display`/`--font-body` at the new font variable

**Files:**
- Modify: `app/globals.css:24-25`

**Interfaces:**
- Consumes: `--font-be-vietnam-pro` produced by Task 1.
- Produces: no interface change — `--font-display`/`--font-body` keep their
  existing names, only their value changes, so every consumer (`h1`-`h6`,
  `body`, `@theme inline`'s `--font-sans`) picks up the new font with zero
  other edits.

- [ ] **Step 1: Confirm current lines**

Run: `Get-Content app/globals.css | Select-Object -First 26 | Select-Object -Last 5`
Expected to show:
```css
  /* Typography */
  --font-display: var(--font-roboto), sans-serif;
  --font-body: var(--font-roboto), sans-serif;
  --font-mono: 'Courier New', monospace;
```

- [ ] **Step 2: Replace the variable references**

Change:
```css
  --font-display: var(--font-roboto), sans-serif;
  --font-body: var(--font-roboto), sans-serif;
```
to:
```css
  --font-display: var(--font-be-vietnam-pro), sans-serif;
  --font-body: var(--font-be-vietnam-pro), sans-serif;
```

- [ ] **Step 3: Verify in browser**

With `pnpm dev` running, load `http://localhost:3000/vi`, open DevTools →
Elements → select a heading → Computed → `font-family`.
Expected: `Be Vietnam Pro` appears first in the stack (not `Roboto`).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): point font-display/font-body at Be Vietnam Pro"
```

---

### Task 3: Flatten radius scale, remove pill token

**Files:**
- Modify: `app/globals.css:46-51` (radius scale), `:157-165` (`.card-lift`),
  `:167-183` (`.btn-primary`), `:202-207` (`.skeleton`), `:209-221`
  (`.btn-hero-outline`), `:115-124` (`.article-body img`/`.article-img`),
  `:133-139` (`.article-body blockquote`)

**Interfaces:**
- Produces: `--radius-md` and `--radius-lg` both resolve to `4px`;
  `--radius-pill` no longer exists as a token. Any later Phase-2/3 component
  that wants a pill must not be built — there is no token for it.

- [ ] **Step 1: Confirm current radius block**

Run: `Get-Content app/globals.css | Select-Object -Skip 45 -First 6`
Expected:
```css
  /* Border radius */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
```

- [ ] **Step 2: Rewrite the radius scale**

Change:
```css
  /* Border radius */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
```
to:
```css
  /* Border radius — flattened, ≤5px everywhere, no pills */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 4px;
  --radius-lg: 4px;
```

- [ ] **Step 3: Update `.btn-primary` to drop the pill var**

Find:
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
```
Change only the `border-radius` line to:
```css
  border-radius: var(--radius-sm);
```

- [ ] **Step 4: Update `.btn-hero-outline` to drop the pill var**

Find:
```css
.btn-hero-outline {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: var(--radius-pill);
  transition: border-color 0.2s ease, background 0.2s ease;
}
```
Change only the `border-radius` line to:
```css
  border-radius: var(--radius-sm);
```

- [ ] **Step 5: Flatten `.article-body img`/`.article-img` and blockquote radii**

Find:
```css
.article-body img,
.article-body .article-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.75rem 0;
  display: block;
}
```
Change `border-radius: 8px;` to `border-radius: 4px;`.

Find:
```css
.article-body blockquote {
  border-left: 3px solid var(--color-primary);
  padding: 0.75rem 1rem;
  margin: 1.5rem 0;
  background: #f8fbf2;
  border-radius: 0 8px 8px 0;
}
```
Change `border-radius: 0 8px 8px 0;` to `border-radius: 0 4px 4px 0;`.

- [ ] **Step 6: Grep to confirm no remaining `--radius-pill` references**

Run: `grep -rn "radius-pill" app/globals.css`
Expected: no output (empty match — confirms every consumer was updated).

- [ ] **Step 7: Verify in browser**

With `pnpm dev` running, visit the homepage, hover a `.card-lift` card, and
inspect a `.btn-primary`/`.btn-hero-outline` button in DevTools.
Expected: computed `border-radius` is `4px` on cards and buttons, no `9999px`
anywhere in `globals.css`-driven styles.

- [ ] **Step 8: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): flatten radius scale to 4px, remove pill token"
```

---

### Task 4: Sweep the 4 hardcoded inline pill radii on public pages

**Files:**
- Modify: `app/(public)/[locale]/page.tsx:186`, `app/(public)/[locale]/page.tsx:412`
- Modify: `app/(public)/[locale]/activities/page.tsx:199`
- Modify: `components/public/Header.tsx:116`

**Interfaces:**
- Consumes: nothing from earlier tasks (these are standalone inline styles,
  not driven by the CSS vars changed in Task 3).
- Produces: no interface — purely visual, no other file reads these lines.

- [ ] **Step 1: Confirm all 4 lines still match**

Run:
```bash
grep -n "borderRadius: '9999px'" "app/(public)/[locale]/page.tsx" "app/(public)/[locale]/activities/page.tsx" "components/public/Header.tsx"
```
Expected exactly these 4 matches:
```
app/(public)/[locale]/page.tsx:186:                  style={{ background: '#8ec63f', color: '#fff', borderRadius: '9999px' }}
app/(public)/[locale]/page.tsx:412:                style={{ background: '#015231', color: '#fff', borderRadius: '9999px' }}
app/(public)/[locale]/activities/page.tsx:199:                        style={{ background: '#015231', borderRadius: '9999px' }}
components/public/Header.tsx:116:            style={{ background: '#8ec63f', borderRadius: '9999px' }}
```
If line numbers differ, re-locate by the surrounding `style={{...}}` content
shown above before editing — do not blind-edit by line number alone.

- [ ] **Step 2: Edit `app/(public)/[locale]/page.tsx:186`**

Change:
```tsx
                  style={{ background: '#8ec63f', color: '#fff', borderRadius: '9999px' }}
```
to:
```tsx
                  style={{ background: '#8ec63f', color: '#fff', borderRadius: '4px' }}
```

- [ ] **Step 3: Edit `app/(public)/[locale]/page.tsx:412`**

Change:
```tsx
                style={{ background: '#015231', color: '#fff', borderRadius: '9999px' }}
```
to:
```tsx
                style={{ background: '#015231', color: '#fff', borderRadius: '4px' }}
```

- [ ] **Step 4: Edit `app/(public)/[locale]/activities/page.tsx:199`**

Change:
```tsx
                        style={{ background: '#015231', borderRadius: '9999px' }}
```
to:
```tsx
                        style={{ background: '#015231', borderRadius: '4px' }}
```

- [ ] **Step 5: Edit `components/public/Header.tsx:116`**

Change:
```tsx
            style={{ background: '#8ec63f', borderRadius: '9999px' }}
```
to:
```tsx
            style={{ background: '#8ec63f', borderRadius: '4px' }}
```

- [ ] **Step 6: Grep to confirm zero remaining pill radii in public code**

Run: `grep -rn "9999px" "app/(public)" components/public`
Expected: no output.

- [ ] **Step 7: Verify in browser**

Visit homepage (hero CTA + bottom CTA), `/vi/activities`, and check the
header's nav CTA button across all three. Expected: all 4 buttons render with
sharp 4px corners, not pills. Also re-check `FloatingContact`'s circular
button and any icon-in-circle badges are still round — those were
intentionally left alone and should NOT have changed.

- [ ] **Step 8: Commit**

```bash
git add "app/(public)/[locale]/page.tsx" "app/(public)/[locale]/activities/page.tsx" components/public/Header.tsx
git commit -m "feat(tokens): flatten 4 hardcoded pill CTAs to 4px radius"
```

---

### Task 5: Add practical color tokens for Phase 2

**Files:**
- Modify: `app/globals.css:4-21` (color block)

**Interfaces:**
- Produces: new CSS var `--color-primary-hover: #7ab332`. Documents (via
  comment, not a new var) that `--color-lime-pale` (bg) + `--color-primary-dark`
  (text) is the canonical badge/tag pairing. Phase 2's `SectionHeading` eyebrow
  and `ProjectCard` category tag will consume these two existing vars plus the
  new hover var — no other new tokens are introduced.

- [ ] **Step 1: Confirm current color block tail**

Run: `Get-Content app/globals.css | Select-Object -Skip 3 -First 18 | Select-Object -Last 3`
Expected:
```css
  --color-error: #DC2626;
  --color-success: #059669;
  --color-white: #FFFFFF;
```

- [ ] **Step 2: Update the `--color-primary-dark` comment to document its badge-pairing role**

Find (this is the existing declaration, line 6 — do not add a second one):
```css
  --color-primary-dark: #015231;   /* deep forest green — hero / footer bg */
```
Change to:
```css
  --color-primary-dark: #015231;   /* deep forest green — hero / footer bg; also canonical badge/tag TEXT color for Phase 2 components */
```

- [ ] **Step 3: Add the new hover token next to `--color-lime-pale`, and document its badge-pairing role**

Find:
```css
  --color-lime-pale: #defbbc;      /* light mint — subtle text on dark bg */
```
Change to:
```css
  --color-lime-pale: #defbbc;      /* light mint — subtle text on dark bg; also canonical badge/tag BACKGROUND for Phase 2 components */
  --color-primary-hover: #7ab332;  /* darker shade of primary, for new Phase 2 component hover states only */
```

- [ ] **Step 4: Verify no duplicate custom property was introduced**

Run: `grep -n "color-primary-dark:" app/globals.css`
Expected: exactly **one** match (inside `:root`).

- [ ] **Step 5: Verify the new token resolves**

With `pnpm dev` running, open DevTools console on any public page and run:
```js
getComputedStyle(document.documentElement).getPropertyValue('--color-primary-hover')
```
Expected: `" #7ab332"` (or `"#7ab332"`).

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): add --color-primary-hover, document badge color pairing"
```

---

## Phase 1 Completion Checklist

- [ ] Font is Be Vietnam Pro everywhere (Tasks 1-2)
- [ ] No `--radius-pill` token exists; `--radius-md`/`--radius-lg` are both
      `4px` (Task 3)
- [ ] Zero `9999px` radius left in `app/(public)` or `components/public`
      (Task 4)
- [ ] Circular decorative elements (dots, icon roundels, `FloatingContact`)
      were NOT touched and still render round
- [ ] `--color-primary-hover` exists; badge pairing documented via comment,
      no duplicate `--color-primary-dark` declaration (Task 5)
- [ ] `components/ui/Button.tsx` and every file under `app/admin` /
      `components/admin` — zero diffs (verify with
      `git diff --stat app/admin components/admin components/ui/Button.tsx`
      showing nothing)
- [ ] `pnpm dev` runs clean, spot-checked homepage + activities + header on
      at least one locale

**Stop here for user review before Phase 2 (component extraction/build).**
