# LMX Alliance — SaigonTel-layout redesign (structure, not palette)

## Context

Client feedback on the live site: section titles lack visual anchors, card icons are
too small/mismatched, numeric stats render at the wrong proportion ("chạy đè"),
the Partners module was empty, at least one page had white-text-on-light-bg
contrast failure, and the overall site feels flat/text-heavy.

31 reference screenshots of saigontel.vn (`SaigonTel-image-sample-ui/`, gitignored)
and `docs/lmx-DESIGN.md` (gitignored, reference-only) show the *structural* pattern
to borrow: single-family type hierarchy, section eyebrow + accent rule, cards with
an icon badge overlapping the image, a project-card pattern, a real partner strip.

**We are borrowing SaigonTel's layout/structure only.** Color palette, font, and
radius decisions were already made by the user directly (below) and diverge from
`docs/lmx-DESIGN.md`'s brand/forest/sand proposal — that doc is not the source of
truth for tokens, only for structural inspiration.

## Hard constraints (from user, verbatim intent preserved)

- Không phá i18n/routing/API. Chỉ sửa lớp UI/presentation.
- No color placeholders — if an image is needed and doesn't exist, log it in
  `MIGRATION_IMAGE_NOTES.md` (already serving this role) instead of inventing one.
- Three phases, stop for review after each: **tokens → components → section + homepage**.
- Keep the current live green hex values, just extend where a real gap exists —
  do not adopt `docs/lmx-DESIGN.md`'s brand/forest/sand scale.
- Font: Roboto → Be Vietnam Pro.
- Radius: flatten to ≤5px everywhere, remove pill buttons entirely.
- Contrast audit must ship as a file+line list of fixes, not a pass/fail claim.
- Featured Projects section: no public placeholder seed data. Build the real
  component + Prisma wiring, but hide the whole section unless ≥3 published
  projects exist. Seed exactly one `published: false` sample for admin preview.
- Button/admin: never let a public-styling change touch admin's shared component.

## Investigation conclusions (resolve open questions before planning)

**Button.tsx needs no split.** `components/ui/Button.tsx` is admin's component in
practice — 23 admin call sites, exactly 1 public call site (`ContactForm.tsx`),
and it already hardcodes `borderRadius: 0` and charcoal admin colors. It stays
completely untouched. Public-facing CTAs never route through it — every public
CTA button found in the codebase is a raw `<Link>`/`<button>` with inline
Tailwind + `style={{...}}`, styled per-page. So the "pill button" sweep is a
direct edit to those call sites, not a shared-component change:
- `app/(public)/[locale]/page.tsx:186` — hero CTA, `borderRadius: '9999px'`
- `app/(public)/[locale]/page.tsx:412` — bottom CTA, `borderRadius: '9999px'`
- `app/(public)/[locale]/activities/page.tsx:199` — `borderRadius: '9999px'`
- `components/public/Header.tsx:116` — nav CTA, `borderRadius: '9999px'`

**Circles are not pills.** "Remove pill buttons" targets elongated CTA/badge
shapes. True circular decorative elements (the 2px status dot, icon-in-circle
badges on `w-16 h-16`/`w-12 h-12` containers, the `FloatingContact` FAB) stay
`rounded-full` — squaring off a floating contact button or an icon roundel is
not what the SaigonTel sharp-corner rule is about, and doing so would look
broken. If the user disagrees on review, this is a one-line correction.

**`Project.published` does not exist.** Schema currently has no boolean
visibility flag; `ProjectStatus` (ONGOING/COMPLETED/ARCHIVED) is a display
label, not a gate. Needs a migration: `published Boolean @default(false)`.
Admin's `app/admin/projects/ProjectActions.tsx` (88 lines) already has a
create/edit form — needs one added checkbox field, no structural rework.

**Token/class blast radius confirmed safe.** `--radius-md`/`--radius-lg`/
`--radius-pill` CSS vars are referenced only inside `globals.css` itself
(`.card-lift`, `.skeleton`, `.btn-primary`, `.btn-hero-outline`) — grep across
`app/` and `components/` found no other file interpolating these var names
directly, and admin never uses the `.card-lift`/`.skeleton` classes. Retuning
the var values in `:root` is a self-contained, admin-safe change.

## Phase 1 — Design tokens (`app/globals.css`, `app/layout.tsx`)

**Font swap.** Replace the `next/font/google` Roboto import in `app/layout.tsx`
with Be Vietnam Pro (`variable: '--font-be-vietnam-pro'`, same subsets/weights
pattern currently used: `latin`, `vietnamese`, weights `300/400/500/700`, both
styles). Update `--font-display`/`--font-body` in `globals.css` to point at the
new variable. No other file references the font variable by name, so this is a
two-file change.

**Radius flatten (≤5px, no pills).**
- `--radius-md: 10px` → `4px`
- `--radius-lg: 16px` → `4px`
- `--radius-pill: 9999px` → remove; `.btn-primary` and `.btn-hero-outline`
  switch to `var(--radius-sm)` (4px)
- `.article-body img/.article-img` — `border-radius: 8px` → `4px`
- `.article-body blockquote` — `border-radius: 0 8px 8px 0` → `0 4px 4px 0`
- Direct inline-style sweep on the 4 call sites listed above
  (`page.tsx:186,412`, `activities/page.tsx:199`, `Header.tsx:116`):
  `borderRadius: '9999px'` → `borderRadius: '4px'`
- Leave `rounded-full` alone wherever it's a true circle (dots, icon roundels,
  `FloatingContact` FAB) per the circles-are-not-pills call above
- Scrollbar thumb (`3px`, cosmetic, not a button/card) — no change

**Color tokens — practical extension, not a full ramp.** Rather than build an
abstract 50–900 ramp (unused complexity — most existing pages hardcode raw hex
inline rather than consuming the CSS vars, so a full ramp wouldn't get
consumed anyway), add only the concrete tokens Phase 2/3 components need:
- `--color-primary-hover: #7ab332` (darner shade of `#8ec63f`, for new
  component hover states — `.btn-primary` already has its own dark hover via
  `--color-primary-mid`, this is for new Phase 2 components only)
- Reuse existing `--color-lime-pale` (#defbbc) as badge/tag background and
  `--color-primary-dark` (#015231) as badge/tag text — both already exist,
  just documented here as the canonical badge pairing for the new
  `SectionHeading` eyebrow and `ProjectCard` category tag
- No other new color tokens. Existing inline hex on already-shipped pages is
  **not** swept as part of this phase — that's unbounded scope; those pages
  already use the live palette correctly.

## Phase 2 — Components (`components/ui/`, `components/public/`)

New components, all in the flattened-radius/Be-Vietnam-Pro/live-green system:

- **`SectionHeading`** — eyebrow label (uppercase, `--color-primary-dark` text,
  small accent rule using `--color-primary`) + title, `align: 'left' | 'center'`
  prop. Replaces the plain `<h2>` pattern used ad hoc across public pages.
- **`StatBlock`** — wraps existing `CountUp` (already fixed for size
  proportions this session) with label styling matching the new type scale;
  used in the Statistics section and reusable for the new Featured Projects
  section if needed.
- **`DomainCard`** — image + icon badge overlapping the image edge (per
  SaigonTel's business-domain-card pattern) + title + `card-lift` hover. This
  supersedes the ad hoc sector-card markup currently inline in `page.tsx`.
- **`ProjectCard`** — image + category tag (badge pairing above, sourced from
  `Project.status`) + name + a truncated description excerpt (existing
  `truncate()` helper in `lib/utils.ts` on `desc{VI,EN,ZH}`). `Project` has no
  scale/location field and none is added for v1 — SaigonTel's metadata line is
  approximated with the description excerpt instead of a new schema field.
- **`PartnerStrip`** — **no new component needed.** `components/public/
  PartnerMarquee.tsx` (already on this branch, untracked) already implements
  the exact single-vs-marquee behavior requested: 1 partner renders centered,
  static, no animation; ≥2 partners renders the continuous marquee. This is
  verified against its current source, not rebuilt. Only needs the Phase 1
  token sweep (radius/font) applied where it hardcodes styles.
- **Button.tsx** — no change (see Investigation conclusions above).

## Phase 3 — Featured Projects section + homepage assembly

**Schema migration:** add `published Boolean @default(false)` to `Project`.
Add a checkbox to `ProjectActions.tsx`'s existing form (create + edit modes).

**Seed:** exactly one `Project` row with `published: false`, so the user has
something to preview/edit in `/admin/projects` immediately. Nothing
public-facing is seeded.

**Homepage section ("Dự án nổi bật"):** new section in
`app/(public)/[locale]/page.tsx`, positioned after Business Sectors (matching
SaigonTel's project-card section placement). Query:
```ts
const publishedProjects = await prisma.project.findMany({
  where: { published: true },
  orderBy: { createdAt: 'desc' },
  take: 6,
});
```
If `publishedProjects.length < 3`, the entire section (including its
`SectionHeading`) renders nothing — not an empty-state placeholder, just
absent, exactly as the user specified ("ẩn cả section... Khi tôi nhập dự án
thật, section tự hiện").

**Contrast audit** (runs across all Phase 3 touched files, plus the two pages
already reworked pre-session — `business-segments/page.tsx` and the homepage):
deliverable is a literal list of `file:line — before → after` entries, checked
against WCAG AA ≥4.5:1, not a summary sentence. This audit happens at the end
of Phase 3 since it needs the final homepage markup to check against.

## Non-goals

- No sweep of existing raw inline hex colors on already-shipped pages.
- No touching `components/ui/Button.tsx` or any of its 23 admin call sites.
- No public placeholder/dummy Project, Partner, or Leader records.
- No i18n, routing, or API changes.
- No full 50–900 color ramp — only the two concrete tokens named above.
- No new `Project` schema field beyond `published` — no scale/location field.
