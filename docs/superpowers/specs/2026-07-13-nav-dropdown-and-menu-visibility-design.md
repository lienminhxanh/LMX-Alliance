# LMX Alliance — Header dropdown navigation + admin menu visibility toggle

## Context

Client reference: saigontel.vn's header, where "GIỚI THIỆU" opens a dropdown
listing that page's sub-sections (Giới thiệu chung, Ban lãnh đạo, Các công ty
thành viên, Các công ty liên kết). Client wants the same pattern applied to
every top-level nav item that has meaningful sub-content, plus an admin screen
to show/hide whole pages or individual dropdown items — e.g. hide "Quan hệ cổ
đông" (Shareholder Relations) entirely while the company has no shareholder
activity yet.

This is the first of four related-but-independent pieces requested by the
client (the others: generic admin bulk actions, and a floating circular
on-page quick-nav / scrollspy component). Those are out of scope for this
spec and will get their own design cycles.

## Current state (investigated)

- `components/public/Header.tsx` — client component, `navLinks` is a flat
  hardcoded array (`home`, `about`, `business-segments`,
  `shareholder-relations`, `news`, `careers`, `activities`), each rendered as
  a single `<Link>`. No dropdown/submenu logic exists anywhere in the repo,
  and no reusable Dropdown/Popover/Menu component exists in `components/ui/`.
- `app/admin/menus/` exists as an **empty directory** — an unused stub,
  apparently reserved for exactly this kind of feature.
- No visibility/enabled flag exists on any model for gating nav/pages. The
  closest things are content-level status enums (`BusinessSector.status`,
  `NewsArticle.status`, `JobPosting.status`, `Project.published`) that gate
  individual content items, not top-level nav sections.
- Page structure varies by route (confirmed by reading each `page.tsx`):
  - **About** (`about/page.tsx`, single page) has 5 distinct headed
    `<section>` blocks with no `id` attributes yet: Intro, Open Letter, Core
    Values, Legal Documents, Leadership.
  - **Activities** (`activities/page.tsx` + `ActivitiesClient.tsx`, single
    page) has 2 headed sections: Internal Activities, Social Activities.
  - **Business Segments** (`business-segments/page.tsx`) is an overview page
    whose real content lives in `[slug]/page.tsx` sub-routes, one per
    `BusinessSector` row (already gated by `BusinessSector.status`).
  - **Shareholder Relations** (`shareholder-relations/page.tsx`) is a
    landing/dispatcher page; its substantive content lives in
    `[category]/page.tsx` sub-routes: Governance, Financial Reports, Annual
    Reports.
  - **News** and **Careers** are single filterable list pages with no
    thematic sub-sections — dropdown doesn't apply to these.

## Decisions (from client, via brainstorming)

- Dropdown targets are **mixed per item**: anchor (scroll to `<section id>`
  on the same page) for About/Activities, route link for Business
  Segments/Shareholder Relations sub-routes. News/Careers get no dropdown.
- Menu **structure is fixed in code**, not admin-editable. Admins only get
  on/off visibility toggles per item — no custom labels, no reordering, no
  adding/removing items.
- Hiding a page/item is **nav-only**: the route itself keeps working for
  direct/bookmarked links. No 404/redirect behavior.
- Visibility toggles are **global across all locales** (VI/EN/ZH toggle
  together) — this models content-readiness, not translation availability.
- Clicking a top-level item with a dropdown **navigates to the page**
  (normal link); hovering (desktop) or tapping a chevron (mobile) reveals the
  dropdown of sub-items.
- Business Segments' dynamic children continue to be gated by the existing
  `BusinessSector.status` field — they are **not** part of the new
  visibility-toggle system, to avoid two competing gating mechanisms for the
  same data.
- Admin menu-visibility screen is **SUPER_ADMIN only** (same tier as Website
  Settings), since it affects site-wide navigation rather than a single
  content domain.

## Data model

```prisma
model MenuItemVisibility {
  key         String   @id        // "about", "about.leadership", "shareholder-relations", "shareholder-relations.governance", ...
  isVisible   Boolean  @default(true)
  updatedAt   DateTime @updatedAt
  updatedById String?
  updatedBy   User?    @relation(fields: [updatedById], references: [id])
}
```

No row for a given `key` means visible (fail-open) — the toggle screen starts
with everything effectively "on" with zero seed data required, and nothing
regresses if a new nav item is added in code before an admin ever visits the
screen.

## Menu structure (code-defined)

New file `lib/nav-config.ts` — the single source of truth for nav shape:

```ts
export type NavChild =
  | { key: string; labelKey: string; type: 'anchor'; target: string }   // target = section element id
  | { key: string; labelKey: string; type: 'route'; target: string };   // target = path relative to page

export type NavItem = {
  key: string;
  labelKey: string;
  href: string;
  children?: NavChild[];
  dynamicChildren?: 'business-sectors'; // opt-in flag for the one item whose children come from the DB, not this config
};

export const NAV_CONFIG: NavItem[] = [
  { key: 'home', labelKey: 'home', href: '/' },
  {
    key: 'about', labelKey: 'about', href: '/about',
    children: [
      { key: 'about.intro', labelKey: 'about.intro', type: 'anchor', target: 'intro' },
      { key: 'about.openLetter', labelKey: 'about.openLetter', type: 'anchor', target: 'open-letter' },
      { key: 'about.values', labelKey: 'about.values', type: 'anchor', target: 'values' },
      { key: 'about.legal', labelKey: 'about.legal', type: 'anchor', target: 'legal-documents' },
      { key: 'about.leadership', labelKey: 'about.leadership', type: 'anchor', target: 'leadership' },
    ],
  },
  {
    key: 'business-segments', labelKey: 'business', href: '/business-segments',
    dynamicChildren: 'business-sectors',
  },
  {
    key: 'shareholder-relations', labelKey: 'investor', href: '/shareholder-relations',
    children: [
      { key: 'shareholder-relations.governance', labelKey: 'shareholderRelations.governance', type: 'route', target: '/shareholder-relations/governance' },
      { key: 'shareholder-relations.financial-reports', labelKey: 'shareholderRelations.financialReports', type: 'route', target: '/shareholder-relations/financial-reports' },
      { key: 'shareholder-relations.annual-reports', labelKey: 'shareholderRelations.annualReports', type: 'route', target: '/shareholder-relations/annual-reports' },
    ],
  },
  { key: 'news', labelKey: 'news', href: '/news' },
  { key: 'careers', labelKey: 'careers', href: '/careers' },
  {
    key: 'activities', labelKey: 'activities', href: '/activities',
    children: [
      { key: 'activities.internal', labelKey: 'activities.internal', type: 'anchor', target: 'internal-activities' },
      { key: 'activities.social', labelKey: 'activities.social', type: 'anchor', target: 'social-activities' },
    ],
  },
];
```

`key` values are the same strings persisted in `MenuItemVisibility.key`.
Child keys are namespaced `parent.child` so a parent lookup and a child
lookup never collide.

## Visibility resolution

Pure function in `lib/nav-config.ts` (or a sibling `lib/nav-visibility.ts`):

```ts
function filterVisibleNav(config: NavItem[], hiddenKeys: Set<string>): NavItem[]
```

Drops any item whose `key` is in `hiddenKeys`, and drops any `children` entry
whose `key` is in `hiddenKeys`. If a parent is hidden, its children are moot
(never reached). This is unit-testable in isolation with no DB/React
involved.

`app/(public)/[locale]/layout.tsx` (server component) queries all
`MenuItemVisibility` rows where `isVisible = false`, builds a `Set<string>`
of hidden keys, and passes it to `<Header hiddenKeys={...} />`. Simple `db`
read, no caching complexity needed beyond Next's default request
deduplication — this is header data on every page load already.

## Admin UI

`app/admin/menus/page.tsx` (fills the existing empty stub): server component
that reads `NAV_CONFIG` + all `MenuItemVisibility` rows, renders a flat
nested list — one row per top-level item with a toggle switch, its static
children indented underneath with their own toggles. (Business Segments
shows a note that its sub-items are managed via the Business Sectors admin
screen, not here — no toggle row for it beyond the top-level page itself.)

Each toggle is a small client component wrapping a Server Action:

```ts
// actions/menus.ts
async function toggleMenuItemVisibility(key: string, isVisible: boolean): Promise<void>
```

Upserts the `MenuItemVisibility` row and writes an `AuditLog` entry (action:
`MENU_VISIBILITY_TOGGLED`, target: the key), matching the existing
single-item admin action pattern (confirm-free since it's a reversible
toggle, not a delete — no confirmation dialog needed, instant optimistic UI
update with rollback on error).

Access: `SUPER_ADMIN` only, enforced the same way other role-gated admin
routes are (existing middleware/session-check pattern — no new mechanism).

## Public dropdown component

New `components/public/NavDropdown.tsx`, used by `Header.tsx` for any
top-level item that has ≥1 visible child after filtering:

- **Desktop**: top-level label renders as a real `<Link href={item.href}>`
  (click navigates) with a small caret icon. `onMouseEnter`/`onMouseLeave`
  (with a ~150ms close delay so moving the cursor diagonally into the panel
  doesn't snap it shut) and `focus-within` reveal a panel below the item
  listing children. `Escape` closes it and returns focus to the trigger.
- **Anchor children**: `onClick` — if already on the target page, smooth
  `scrollIntoView` on the element with that `id`; if on a different page,
  navigate to `${href}#${target}` and let a small `useEffect` in that page
  (checking `window.location.hash` on mount) smooth-scroll to it after
  paint, since a raw hash link jumps instantly rather than smoothly.
- **Route children**: plain `<Link>` to `target`.
- **Mobile** (existing drawer in `Header.tsx`): the label still navigates on
  tap; a separate chevron button beside it expands/collapses the children
  inline as an accordion (no hover available on touch).

`about/page.tsx` and `ActivitiesClient.tsx` get `id="..."` attributes added
to their 5 and 2 respective `<section>` elements, matching the `target`
values in `NAV_CONFIG`. No structural change to those pages otherwise.

New i18n keys added under `nav.about.*`, `nav.activities.*`,
`nav.shareholderRelations.*` in `content/vi.json`, `content/en.json`,
`content/zh.json` for the child labels.

## Testing

- Unit test for `filterVisibleNav` — given a config and a set of hidden
  keys, asserts the correct items/children are dropped, including the
  parent-hides-children case.
- Playwright (`rtk playwright test`): dropdown opens on hover and on
  keyboard focus, clicking the top-level label navigates, clicking an anchor
  child scrolls to the right section, clicking a route child navigates to
  the sub-route, and — with a `MenuItemVisibility` row seeded to
  `isVisible: false` — the corresponding item does not render in the public
  nav.
- Manual: toggle a page off in `/admin/menus`, confirm it disappears from
  the public header immediately (or after cache revalidation, whichever the
  implementation lands on) but the direct URL still loads.

## Out of scope (separate specs)

- Generic bulk select/actions for admin list pages.
- Floating circular on-page quick-nav (scrollspy) component.
- Full menu builder (custom labels, reordering, adding/removing items) — the
  client explicitly chose the simpler visibility-toggle-only scope for now.
