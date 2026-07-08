# Phase 3: Featured Projects + Homepage Assembly + Contrast Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `published` visibility gate (+ `scale`/`location` metadata) to `Project`, wire a "Dự án nổi bật" (Featured Projects) section into the homepage using Phase 2's `SectionHeading`/`ProjectCard`, and close out the redesign with a full-site WCAG AA contrast audit.

**Architecture:** Prisma schema/Zod validation extended first (Task 1), then the two data-producing surfaces that populate `Project` rows — seed script (Task 2) and admin form (Task 3) — then the public consumer (Task 4, homepage query + gated section), then a whole-site presentation audit (Task 5) that runs last against the final classes/colors.

**Tech Stack:** Next.js 14 App Router, TypeScript strict mode, Prisma (PostgreSQL, via `prisma db push` — this repo has no `prisma/migrations/` history, confirmed by an empty `prisma/migrations/` lookup; `db push` is the established convention here, not `migrate dev`), Zod, next-intl (vi/en/zh), Tailwind v4 CSS-first tokens.

## Global Constraints

- No i18n/routing/API changes beyond adding the 3 new translation keys named in Task 4 — no new pages, no new dynamic routes (spec non-goal: "No i18n, routing, or API changes").
- No public placeholder/dummy `Project` data. Per the user's explicit decision (2026-07-06, via AskUserQuestion): **all 4 seed projects — the 3 existing real ones plus 1 new sample — must be `published: false`.** The homepage section stays hidden until an admin manually publishes ≥3 via `/admin/projects`. Do not set any seed project to `published: true`.
- `ProjectCard`'s `status` prop is already typed `'ONGOING' | 'COMPLETED' | 'ARCHIVED'`, matching the Prisma `ProjectStatus` enum verbatim (confirmed in Phase 2 final review) — pass `project.status` straight through, no mapping layer.
- Featured Projects section renders **nothing at all** (not an empty-state placeholder) unless `publishedProjects.length >= 3`.
- Primary color `#1F2937` / sharp corners apply to **admin** UI (Task 3); the public green palette / `--color-*` tokens apply to the homepage section (Task 4) — do not cross the two.
- No test framework exists in this repo (no vitest/jest/playwright). Verification is `npx tsc --noEmit`, `npx prisma db push` / `npx prisma validate` output, and manual/browser checks — not TDD unit tests.
- **Git hygiene — read before touching Tasks 2, 3, or 4.** `prisma/seed.ts`, `app/admin/projects/ProjectActions.tsx`, and `app/(public)/[locale]/page.tsx` are currently **pre-existing dirty files** (real uncommitted WIP predating this redesign session — confirmed via `git diff --stat`, unrelated to Phase 3: seed.ts has leader-roster and CEO/chairman-message edits, ProjectActions.tsx has a `handleDelete`/`deleting`-state refactor, page.tsx has broad unrelated changes across ~268 lines). A Phase 1 incident already happened where a blanket `git add` on a dirty file swept ~270 unrelated lines into a commit. Plain `git add <file>` stages the **whole file**, which would repeat that incident here. For these three files:
  1. Before editing, run `git diff -- <file>` once and read it — that is the pre-existing WIP; do not touch it, do not "fix" it, do not revert it.
  2. Make only the edit this task describes.
  3. Stage with `git add -p -- <file>` (patch mode), not `git add <file>`. For every hunk shown, answer `y` **only** if every line in that hunk is a line you just added/changed for this task. If a hunk mixes pre-existing lines with your new lines, answer `s` to split it, or `e` to hand-edit the hunk down to just your lines.
  4. After staging, run `git diff --cached -- <file>` and confirm the staged diff contains **only** your task's intended change — nothing from the pre-existing WIP. Only then commit.
  5. If `git add -p` isn't behaving as expected or you're unsure a hunk is "clean," stop and report `NEEDS_CONTEXT`/`BLOCKED` rather than guessing.

---

### Task 1: Prisma schema + Zod validation — add `published`, `scale`, `location` to `Project`

**Files:**
- Modify: `prisma/schema.prisma:271-283` (the `Project` model — this file has no pre-existing dirty changes, plain `git add` is safe here)
- Modify: `lib/validations.ts:50-55` (the `ProjectSchema` Zod object — this file also has no pre-existing dirty changes)

**Interfaces:**
- Produces (consumed by Task 2, 3, 4): Prisma Client fields `Project.published: boolean` (defaults `false`), `Project.scale: string | null`, `Project.location: string | null`.
- Produces: `ProjectSchema` (Zod) gains `published: z.boolean().default(false)`, `scale: z.string().optional()`, `location: z.string().optional()`. `actions/projects.ts`'s `createProject`/`updateProject` already spread `...parsed` into `prisma.project.create/update` — **no change needed to `actions/projects.ts` itself**, the new fields flow through automatically once the schema includes them.

- [ ] **Step 1: Edit the Prisma model**

In `prisma/schema.prisma`, replace the `Project` model (currently lines 271-283):

```prisma
model Project {
  id        String        @id @default(cuid())
  nameVI    String
  nameEN    String
  nameZH    String
  descVI    String        @db.Text
  descEN    String        @db.Text
  descZH    String        @db.Text
  images    Json
  status    ProjectStatus
  published Boolean       @default(false)
  scale     String?
  location  String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}
```

- [ ] **Step 2: Push the schema change to the database**

Run: `npx prisma db push`
Expected: output ending in `Your database is now in sync with your Prisma schema.` and a Prisma Client regeneration log line. (This repo has no `prisma/migrations/` directory — confirmed empty — so `db push` is the right command, not `prisma migrate dev`.)

- [ ] **Step 3: Edit the Zod schema**

In `lib/validations.ts`, replace the `ProjectSchema` (currently lines 50-55):

```ts
export const ProjectSchema = z.object({
  nameVI: z.string().min(1), nameEN: z.string().min(1), nameZH: z.string().min(1),
  descVI: z.string().default(''), descEN: z.string().default(''), descZH: z.string().default(''),
  images: z.array(z.string()).default([]),
  status: z.enum(['ONGOING', 'COMPLETED', 'ARCHIVED']),
  published: z.boolean().default(false),
  scale: z.string().optional(),
  location: z.string().optional(),
});
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

Both files are clean (no pre-existing dirty content), so plain `git add` is fine here:

```bash
git add prisma/schema.prisma lib/validations.ts
git commit -m "feat(projects): add published/scale/location fields to Project"
```

---

### Task 2: Seed data — mark all 4 projects `published: false`, add 1 new sample

**Depends on:** Task 1 (needs `Project.published`/`scale`/`location` in the generated Prisma Client).

**Files:**
- Modify: `prisma/seed.ts:552-586` (the `// ── Projects ─────` block only — **this file has unrelated pre-existing dirty hunks elsewhere** — leader roster edits and CEO/chairman message edits, both far from this block. Follow the Global Constraints git-hygiene procedure.)

**Interfaces:**
- Consumes: `Project.published`/`scale`/`location` from Task 1.
- Produces: 4 `Project` rows in the dev database, all `published: false` — this is what makes Task 4's homepage gate (`length >= 3`) evaluate to hidden until an admin acts.

- [ ] **Step 1: Edit the Projects seed block**

Replace the block currently at `prisma/seed.ts:552-586` (from `// ── Projects ─────` through the `for (const p of projects) await prisma.project.create({ data: p });` line) with:

```ts
  // ── Projects ─────────────────────────────────────────
  // NOTE: all 4 seeded here are published: false, on purpose — no real project
  // is auto-published to the live homepage from a seed run. An admin must
  // explicitly check "Published" in /admin/projects for the Featured Projects
  // section to appear (requires >= 3 published).
  await prisma.project.deleteMany();
  const projects = [
    {
      nameVI: 'Khu công nghiệp Bình Dương — Giai đoạn 1',
      nameEN: 'Binh Duong Industrial Park — Phase 1',
      nameZH: '平阳工业园区——第一期',
      descVI: 'Thi công hạ tầng kỹ thuật cho khu công nghiệp quy mô 50 hecta tại tỉnh Bình Dương, bao gồm đường nội bộ, hệ thống điện chiếu sáng, cấp thoát nước và các công trình phụ trợ. Tổng giá trị hợp đồng 500 tỷ đồng, dự kiến hoàn thành Q4/2026.',
      descEN: 'Technical infrastructure construction for a 50-hectare industrial park in Binh Duong province, including internal roads, lighting systems, water supply/drainage and supporting facilities. Contract value VND 500 billion, expected completion Q4/2026.',
      descZH: '平阳省50公顷工业园区技术基础设施建设，包括内部道路、照明系统、供排水及辅助设施。合同金额5000亿越南盾，预计2026年第四季度竣工。',
      images: [],
      status: 'ONGOING' as const,
      published: false,
      scale: '50 ha',
      location: 'Bình Dương',
    },
    {
      nameVI: 'Trung tâm Logistics Cát Lái, TP. HCM',
      nameEN: 'Cat Lai Logistics Center, Ho Chi Minh City',
      nameZH: '胡志明市猫莱物流中心',
      descVI: 'Xây dựng và vận hành trung tâm logistics hiện đại tại khu vực Cát Lái với diện tích kho bãi 15.000 m², năng lực xử lý 500 container/tháng. Dự án đã đi vào hoạt động từ Q1/2024 và phục vụ hơn 30 doanh nghiệp xuất nhập khẩu.',
      descEN: 'Construction and operation of a modern logistics center in Cat Lai area with 15,000 m² warehouse space, capacity to handle 500 containers/month. The project has been operational since Q1/2024, serving over 30 import-export businesses.',
      descZH: '在猫莱地区建设和运营现代化物流中心，仓储面积15,000平方米，处理能力500个集装箱/月。该项目自2024年第一季度投入运营，服务30余家进出口企业。',
      images: [],
      status: 'COMPLETED' as const,
      published: false,
      scale: '15.000 m²',
      location: 'Cát Lái, TP. HCM',
    },
    {
      nameVI: 'Nhà máy xử lý chất thải công nghiệp Long Phước',
      nameEN: 'Long Phuoc Industrial Waste Treatment Plant',
      nameZH: '龙福工业废物处理厂',
      descVI: 'Đầu tư và vận hành nhà máy xử lý chất thải công nghiệp với công suất 200 tấn/ngày tại khu Long Phước, TP. HCM. Ứng dụng công nghệ xử lý hiện đại, đạt tiêu chuẩn ISO 14001:2015 và QCVN về bảo vệ môi trường.',
      descEN: 'Investment and operation of an industrial waste treatment plant with a capacity of 200 tons/day at Long Phuoc, Ho Chi Minh City. Applying modern treatment technology, certified ISO 14001:2015 and Vietnamese environmental standards.',
      descZH: '投资并运营胡志明市龙福工业废物处理厂，处理能力200吨/天。采用现代处理技术，通过ISO 14001:2015认证及越南环保标准。',
      images: [],
      status: 'ONGOING' as const,
      published: false,
      scale: '200 tấn/ngày',
      location: 'Long Phước, TP. HCM',
    },
    {
      nameVI: 'Trạm thu mua và tái chế phế liệu công nghiệp Nhơn Trạch',
      nameEN: 'Nhon Trach Industrial Scrap Collection & Recycling Station',
      nameZH: '仁泽工业废料回收再利用站',
      descVI: 'Trạm thu mua, phân loại và sơ chế phế liệu kim loại, nhựa công nghiệp phục vụ tái chế, đặt tại khu công nghiệp Nhơn Trạch, tỉnh Đồng Nai. Diện tích 2 hecta, công suất tiếp nhận 50 tấn/ngày, là mẫu dữ liệu để quản trị viên xem trước giao diện Dự án nổi bật trước khi công khai dự án thật.',
      descEN: 'A collection, sorting, and pre-processing station for metal and industrial plastic scrap destined for recycling, located in Nhon Trach Industrial Park, Dong Nai province. 2-hectare site, 50 tons/day intake capacity — a sample record for admin preview of the Featured Projects UI before any real project is published.',
      descZH: '位于同奈省仁泽工业园区的金属及工业塑料废料回收、分拣与预处理站，用于再生利用。占地2公顷，日处理能力50吨——作为管理员在正式发布真实项目前预览"重点项目"界面的示例数据。',
      images: [],
      status: 'ONGOING' as const,
      published: false,
      scale: '2 ha',
      location: 'Nhơn Trạch, Đồng Nai',
    },
  ];
  for (const p of projects) await prisma.project.create({ data: p });
```

- [ ] **Step 2: Run the seed and verify**

Run: `npm run db:seed`
Expected: no thrown errors, ends with `✅ Seed completed — admin@lmxalliance.com / Admin@123456`.

Then verify via Prisma Studio or a one-off script that there are exactly 4 `Project` rows and all have `published: false`:

Run: `npx prisma studio` (open the `Project` table, confirm 4 rows, `published` column all unchecked) — or non-interactively:

```bash
npx tsx -e "import {prisma} from './lib/prisma'; prisma.project.findMany().then(p => { console.log(p.length, p.every(x => x.published === false)); process.exit(0); })"
```

Expected output: `4 true`

- [ ] **Step 3: Git hygiene + commit**

Follow the Global Constraints procedure exactly (this file has unrelated pre-existing dirty hunks — leader roster + CEO/chairman message edits — well away from the Projects block):

```bash
git diff -- prisma/seed.ts    # read first, don't touch anything outside the Projects block
# ... make the edit above ...
git add -p -- prisma/seed.ts  # y only for hunks inside the Projects block, n for everything else
git diff --cached -- prisma/seed.ts   # confirm only your Projects-block change is staged
git commit -m "feat(seed): add published/scale/location to seed projects, add 4th sample"
```

---

### Task 3: Admin form — add Published checkbox + Scale/Location inputs

**Depends on:** Task 1.

**Files:**
- Modify: `app/admin/projects/ProjectActions.tsx` (lines 19, 25, and the JSX around lines 63-79 — **this file has an unrelated pre-existing dirty hunk**: a `handleDelete`/`deleting`-state refactor near lines 21-60. Follow the Global Constraints git-hygiene procedure.)

**Interfaces:**
- Consumes: `Project.published`/`scale`/`location` (Task 1), `ProjectSchema` validation (Task 1) — `createProject`/`updateProject` in `actions/projects.ts` already forward these once present in `form`, no action changes needed.

- [ ] **Step 1: Extend the `Project` interface**

Change line 19 from:

```ts
interface Project { id: string; nameVI: string; nameEN: string; nameZH: string; descVI: string; descEN: string; descZH: string; images: any; status: ProjectStatus }
```

to:

```ts
interface Project { id: string; nameVI: string; nameEN: string; nameZH: string; descVI: string; descEN: string; descZH: string; images: any; status: ProjectStatus; published: boolean; scale: string | null; location: string | null }
```

- [ ] **Step 2: Extend the form state**

Change line 25 from:

```ts
const [form, setForm] = useState({ nameVI: project?.nameVI ?? '', nameEN: project?.nameEN ?? '', nameZH: project?.nameZH ?? '', descVI: project?.descVI ?? '', descEN: project?.descEN ?? '', descZH: project?.descZH ?? '', images: (project?.images as string[]) ?? [], status: project?.status ?? 'ONGOING' as ProjectStatus });
```

to:

```ts
const [form, setForm] = useState({ nameVI: project?.nameVI ?? '', nameEN: project?.nameEN ?? '', nameZH: project?.nameZH ?? '', descVI: project?.descVI ?? '', descEN: project?.descEN ?? '', descZH: project?.descZH ?? '', images: (project?.images as string[]) ?? [], status: project?.status ?? 'ONGOING' as ProjectStatus, published: project?.published ?? false, scale: project?.scale ?? '', location: project?.location ?? '' });
```

- [ ] **Step 3: Add the checkbox + 2 inputs to the modal JSX**

Currently (lines 63-65):

```tsx
      <Modal open={open} onClose={() => setOpen(false)} title={mode === 'create' ? 'Add Project' : 'Edit Project'} size="lg">
        <div className="space-y-4">
          <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => set('status', e.target.value)} />
```

Insert immediately after the `<Select>` line (still before `<Tabs>`):

```tsx
      <Modal open={open} onClose={() => setOpen(false)} title={mode === 'create' ? 'Add Project' : 'Edit Project'} size="lg">
        <div className="space-y-4">
          <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => set('status', e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-[#1F2937]">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
              className="h-4 w-4 border-[#D1D5DB] text-[#1F2937] focus:ring-[#1F2937]"
              style={{ borderRadius: 0 }}
            />
            Published (visible on public homepage)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Scale" placeholder="e.g. 50 ha" value={form.scale} onChange={(e) => set('scale', e.target.value)} />
            <Input label="Location" placeholder="e.g. Long An" value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>
```

The rest of the file (the `<Tabs>` block through the closing `</Modal>`) stays exactly as-is.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual browser verification**

Run `npm run dev`, sign in to `/admin/login`, go to `/admin/projects`:
1. Click "Add Project", check "Published", fill Scale = `10 ha`, Location = `Test City`, fill VI/EN/ZH names, Save.
2. Confirm the modal closes and the new card appears in the grid.
3. Click Edit on that card — confirm the checkbox is checked and Scale/Location show the values you entered.
4. Uncheck Published, Save, re-open Edit — confirm it's now unchecked.
5. Check the browser console for 0 errors.
6. Stop the dev server.

- [ ] **Step 6: Git hygiene + commit**

```bash
git diff -- app/admin/projects/ProjectActions.tsx   # read first — there's a pre-existing handleDelete/deleting-state hunk near the top; leave it untouched
# ... make the edits above ...
git add -p -- app/admin/projects/ProjectActions.tsx  # y only for your interface/form-state/JSX additions, n for the handleDelete hunk
git diff --cached -- app/admin/projects/ProjectActions.tsx   # confirm only your 3 edits are staged
git commit -m "feat(admin): add published/scale/location fields to Project form"
```

---

### Task 4: Homepage "Dự án nổi bật" (Featured Projects) section

**Depends on:** Task 1 (schema), and conceptually Task 2/3 (so there's real data to eventually show) but can be implemented and verified independently using manually-toggled test rows.

**Files:**
- Modify: `app/(public)/[locale]/page.tsx` — add imports, extend the `Promise.all` query, insert a new gated section after Business Sectors (after the `</section>` currently at line 276, before the `{/* ── Statistics ── */}` comment currently at line 278). **This file has large unrelated pre-existing dirty hunks throughout** (confirmed via `git diff --stat`: 161 insertions/107 deletions across the file, none of which touch the exact insertion point, but some hunks sit close to the Business Sectors/Statistics boundary). Follow the Global Constraints git-hygiene procedure with extra care — after staging, diff the staged result against the exact 3 changes below before committing.
- Modify: `content/vi.json`, `content/en.json`, `content/zh.json` — add a `home.projects` key to each, inserted after the existing `home.sectors` key and before `home.stats` (mirrors the existing structure — these 3 files have no pre-existing dirty changes, plain `git add` is safe for them).

**Interfaces:**
- Consumes: `SectionHeading` (`components/ui/SectionHeading.tsx` — props `eyebrow: string; title: string; align?: 'left'|'center'; className?: string`) and `ProjectCard` (`components/public/ProjectCard.tsx` — props `image?: string|null; status: 'ONGOING'|'COMPLETED'|'ARCHIVED'; name: string; scale?: string; location?: string; href: string; delay?: number; className?: string`), both from Phase 2, unchanged.
- Consumes: `Project.published`/`scale`/`location` from Task 1.
- Design decision (no per-project detail page exists in scope, and creating one is a non-goal): every `ProjectCard`'s `href` points at the existing `/${locale}/activities` overview page, not a per-project route. Flag this to the user at review time as a deliberate scope-preserving choice, not an oversight.

- [ ] **Step 1: Add the two component imports**

In the import block near the top of the file (currently ending around line 12 with `import { buildMeta, SITE_URL } from '@/lib/seo';`), add:

```ts
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/public/ProjectCard';
```

- [ ] **Step 2: Add the `publishedProjects` query**

The current `Promise.all` (locate by searching for `const [homePage, sectors, stats, latestNews, partners] = await Promise.all([`) is:

```ts
  const [homePage, sectors, stats, latestNews, partners] = await Promise.all([
    prisma.homePage.findFirst(),
    prisma.businessSector.findMany({ where: { status: 'PUBLISHED' }, orderBy: { orderIndex: 'asc' } }),
    prisma.statistic.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.newsArticle.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.partner.findMany({ orderBy: { orderIndex: 'asc' } }),
  ]);
```

Replace with:

```ts
  const [homePage, sectors, stats, latestNews, partners, publishedProjects] = await Promise.all([
    prisma.homePage.findFirst(),
    prisma.businessSector.findMany({ where: { status: 'PUBLISHED' }, orderBy: { orderIndex: 'asc' } }),
    prisma.statistic.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.newsArticle.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.partner.findMany({ orderBy: { orderIndex: 'asc' } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);
```

- [ ] **Step 3: Insert the new section**

Find the end of the Business Sectors section — the `</section>` line immediately followed by a blank line and then `{/* ── Statistics ────────────────────────────────── */}`. Insert the new section between them:

```tsx
      </section>

      {/* ── Featured Projects ─────────────────────────── */}
      {publishedProjects.length >= 3 && (
        <section className="section-padding">
          <div className="container-max">
            <SectionHeading
              eyebrow={t('projects.eyebrow')}
              title={t('projects.title')}
              align="center"
              className="mb-14 max-w-2xl mx-auto"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {publishedProjects.map((project, idx) => {
                const name = (project as any)[`name${L}`];
                const images = Array.isArray(project.images) ? (project.images as string[]) : [];
                return (
                  <ProjectCard
                    key={project.id}
                    image={images.length > 0 ? images[0] : null}
                    status={project.status}
                    name={name}
                    scale={project.scale ?? undefined}
                    location={project.location ?? undefined}
                    href={`/${locale}/activities`}
                    delay={idx * 0.1}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Statistics ────────────────────────────────── */}
```

(`L` is already defined earlier in the component as `const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';` — reused here exactly as Business Sectors does.)

- [ ] **Step 4: Add the `home.projects` translation key to all 3 locale files**

In `content/vi.json`, inside the `"home": { ... }` object, insert a new `"projects"` key right after `"sectors"` and before `"stats"`:

```json
    "projects": {
      "eyebrow": "DỰ ÁN",
      "title": "Dự án nổi bật",
      "subtitle": "Những công trình và dự án tiêu biểu do LMX Alliance triển khai"
    },
```

In `content/en.json`, same position:

```json
    "projects": {
      "eyebrow": "PROJECTS",
      "title": "Featured Projects",
      "subtitle": "Notable projects and developments delivered by LMX Alliance"
    },
```

In `content/zh.json`, same position:

```json
    "projects": {
      "eyebrow": "项目",
      "title": "重点项目",
      "subtitle": "LMX联盟实施的重点工程与项目"
    },
```

(The `subtitle` key is added for parity with the `sectors`/`stats` key shapes and possible future use, but Step 3's JSX does not render it — `SectionHeading` has no subtitle slot. This is intentional: do not add a manual `<p>` for it, and do not modify `SectionHeading` to add a subtitle prop — that's out of scope for this task.)

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual browser verification (both hidden and visible states)**

Run `npm run dev`.

**Hidden state (0 published projects, the default after Task 2's seed):** navigate to `/vi`, `/en`, `/zh` — confirm the Featured Projects section is completely absent (view source / inspect DOM, not just visually — there should be no `<!-- Featured Projects -->`-adjacent empty container).

**Visible state:** temporarily flip 3 seeded projects to `published: true` directly in Prisma Studio (`npx prisma studio`), reload `/vi` — confirm:
- The section now renders between Business Sectors and Statistics.
- 3 cards show, each with the correct status badge label, name, and (for the 3 seeded ones that have `scale`/`location`) the metadata line with icons.
- Clicking a card navigates to `/vi/activities`.
- Check `/en` and `/zh` render the section's eyebrow/title in the correct language.
- Browser console: 0 errors.

**Revert:** flip those 3 projects back to `published: false` in Prisma Studio before finishing, so the working seed state matches Task 2's intent (all 4 unpublished) for the next reviewer/user to see the same hidden-by-default state.

- [ ] **Step 7: Git hygiene + commit**

```bash
git diff -- "app/(public)/[locale]/page.tsx"   # read first — large unrelated pre-existing diff, do not touch any of it
# ... make the edits above ...
git add -p -- "app/(public)/[locale]/page.tsx"   # y only for: the 2 new imports, the Promise.all/destructure change, the new section block
git diff --cached -- "app/(public)/[locale]/page.tsx"   # confirm only those 3 changes are staged, nothing from the pre-existing WIP
git add content/vi.json content/en.json content/zh.json   # no pre-existing dirty content in these 3, plain add is fine
git commit -m "feat(public): add Featured Projects homepage section"
```

---

### Task 5: Full-site WCAG AA contrast audit

**Depends on:** Tasks 1-4 complete and committed (audits the final classes/colors, not a moving target).

**Files:**
- Read-only investigation across: every file under `app/(public)/[locale]/**/page.tsx` (`page.tsx`, `about/page.tsx`, `activities/page.tsx`, `business-segments/page.tsx`, `business-segments/[slug]/page.tsx`, `careers/page.tsx`, `contact/page.tsx`, `news/page.tsx`, `shareholder-relations/page.tsx`, `layout.tsx`), plus `components/public/Header.tsx`, `components/public/Footer.tsx`, `components/public/FloatingContact.tsx`, `components/public/PartnerMarquee.tsx`.
- Deliverable: a new file `docs/superpowers/reports/2026-07-06-contrast-audit.md` (create the `reports/` directory if it doesn't exist) — no source files are modified as part of *finding* issues; fixes are a separate, explicit step (Step 3 below) applied only to failures actually found.

**Interfaces:** None — this task produces a report and, if failures are found, direct color-value edits in the audited files. It does not change any component's props or exported interface.

- [ ] **Step 1: Enumerate every text/background color pairing**

For each file in scope, grep for color-bearing patterns: `style={{`, `color:`, `background`, `bg-\[`, `text-\[`, `text-white`, and any raw hex (`#[0-9a-fA-F]{3,8}`). For every pairing of a text color against the background it's rendered on (including background images with a gradient/overlay — read the overlay's alpha and compute the effective composited color, not just the raw background hex), record:
- File path and line number
- The text color (hex) and the background color/gradient stop it sits on
- Font size/weight (large text — ≥18.66px bold or ≥24px regular — only needs 3:1; everything else needs 4.5:1 per WCAG AA)

- [ ] **Step 2: Compute contrast ratios and flag failures**

For each pairing recorded in Step 1, compute the WCAG contrast ratio (relative luminance formula: `L = 0.2126*R + 0.7152*G + 0.0722*B` after gamma-correcting each channel, then `(L1+0.05)/(L2+0.05)` with L1 the lighter). Flag any pairing below its required threshold (4.5:1 normal text, 3:1 large text/UI components).

- [ ] **Step 3: Write the report**

Create `docs/superpowers/reports/2026-07-06-contrast-audit.md` with this exact structure — a literal list, not a summary claim:

```markdown
# Contrast Audit — Full Public Site (Phase 3)

Method: WCAG 2.1 AA (4.5:1 normal text, 3:1 large text/UI). Computed via
relative-luminance contrast ratio on every text/background color pairing
found across app/(public)/[locale]/**/page.tsx, layout.tsx, Header.tsx,
Footer.tsx, FloatingContact.tsx, PartnerMarquee.tsx.

## Failures found and fixed

- `path/to/file.tsx:123` — `#RRGGBB` on `#RRGGBB` (ratio X.XX:1, needs 4.5:1) → changed text color to `#RRGGBB` (ratio Y.YY:1)
- (one line per failure, in this exact `file:line — before → after (ratio)` format)

## Passing (spot-checked, no change needed)

- `path/to/file.tsx:456` — `#RRGGBB` on `#RRGGBB` (ratio Z.ZZ:1) — OK

## Summary

N pairings checked across M files. F failures found and fixed. 0 remaining known failures.
```

If zero failures are found, the report still lists every pairing checked under "Passing" — never collapse to a bare "everything passed" sentence.

- [ ] **Step 4: Apply the fixes**

For every entry under "Failures found and fixed," edit that exact file:line to the new color value recorded in the report. Prefer adjusting the *text* color over the background where possible (less likely to cascade into an unrelated visual change), and prefer swapping to an existing `--color-*` token from `app/globals.css` over inventing a new raw hex, if a token at a compliant contrast already exists for that role.

- [ ] **Step 5: Type-check and re-verify**

Run: `npx tsc --noEmit` — expect no errors (color-only changes shouldn't affect types, but confirm).

Re-run the contrast computation from Step 2 on every fixed pairing, confirm each now meets its threshold, and re-read the affected pages in the browser (`npm run dev`) to confirm no visual regression (text still legible, no color looks obviously wrong against its surroundings).

- [ ] **Step 6: Git hygiene + commit**

Some of the audited files (`page.tsx`, and possibly others) are pre-existing dirty files. Follow the Global Constraints procedure: `git diff -- <file>` before editing, `git add -p` after, `git diff --cached` to confirm, per file touched. The new report file has no pre-existing content, plain `git add` is fine for it.

```bash
git add docs/superpowers/reports/2026-07-06-contrast-audit.md
# for each source file with an actual color fix, use git add -p per the procedure above
git commit -m "fix(a11y): resolve WCAG AA contrast failures found in full-site audit"
```

---

## Deferred scope

The final whole-branch review (post-Task 5) found that `DomainCard` (`components/public/DomainCard.tsx`) and `StatBlock` (`components/ui/StatBlock.tsx`) — both built in Phase 2 — are never imported by any page. Phase 2's plan explicitly deferred wiring them in as "Phase 3's job" (see `docs/superpowers/plans/2026-07-06-phase2-components.md`, Task on `DomainCard`: "Supersedes the inline card markup in `page.tsx` conceptually, but that swap-in is Phase 3's wiring job, not this task's."), but this Phase 3 plan's Goal statement and Tasks 1-5 never picked that up — a scope gap between the two plans, not an implementation slip.

**User decision (2026-07-08):** defer, not remove. Keep both components as-is; they are intentionally unused pending a future pass that will wire `DomainCard` into the business-segments sector cards and/or `StatBlock` into the homepage Statistics section to further refine the UI. A one-line comment pointing back to this note was added to both files so a future reader doesn't mistake them for dead code to delete.

Whoever wires them in later should also localize `DomainCard`'s hardcoded Vietnamese "Xem thêm" link label (`components/public/DomainCard.tsx`) — the same class of i18n bug fixed in `ProjectCard` this phase — while touching the file.

## After Task 5

This is the final phase of the SaigonTel-layout redesign (`docs/superpowers/specs/2026-07-06-saigontel-redesign-design.md`) — there is no Phase 4. Once the user reviews and approves Task 5's contrast audit report and all 5 tasks' final diffs, the next step is **`superpowers:finishing-a-development-branch`**, not another stop-and-wait phase gate.
