# Contrast Audit — Full Public Site (Phase 3)

Method: WCAG 2.1 AA (4.5:1 normal text, 3:1 large text/UI). Computed via
relative-luminance contrast ratio on every text/background color pairing
found across app/(public)/[locale]/**/page.tsx, layout.tsx, Header.tsx,
Footer.tsx, FloatingContact.tsx.

Note: `components/public/PartnerMarquee.tsx` is **not** part of this audit.
It exists only as an untracked, uncommitted file in the working tree (an
unrelated in-progress redesign of the partners section that has never been
wired up — the committed homepage does not import or reference it) and was
mistakenly treated as live, audited code in an earlier draft of this report.
The homepage's actual partners-marquee UI is the inline block still present
in `page.tsx` (see the two fixes below); that is what was audited.

## Failures found and fixed

- `app/(public)/[locale]/page.tsx:103,112` — `#78d750` eyebrow text sitting in the hero's gradient-overlay region (min alpha 0.25 there) against a light-photo worst case (ratio 1.10:1, needs 4.5:1) → raised gradient floor to rgba(1,82,49,0.78)+ and changed text color to `#defbbc` (ratio 5.12:1 worst-case)
- `app/(public)/[locale]/page.tsx:132` — `#fff` on `#8ec63f` (ratio 2.04:1, needs 4.5:1) → changed text color to `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/page.tsx:343` — `#8ec63f` read-more link on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/page.tsx:366` — partners-marquee subtitle, `#9CA3AF` on `#ffffff` (ratio 2.54:1, needs 4.5:1) → changed text color to `#6B7280` (ratio 4.83:1)
- `app/(public)/[locale]/page.tsx` (partners-marquee fallback avatar, logo-less partners) — `#fff` initial-letter text on `#8ec63f` avatar background (ratio 2.04:1, needs 4.5:1) → changed text color to `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/activities/page.tsx:180` — `#78d750` badge icon on `#8ec63f` panel bg for idx%3===1 (ratio 1.13:1, needs 3:1 non-text) → changed to conditional `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/activities/page.tsx:182` — `#fff` panel heading on `#8ec63f` panel bg for idx%3===1 (ratio 2.04:1, needs 4.5:1) → changed to conditional `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/activities/page.tsx:185` — `#defbbc` list text on `#8ec63f` panel bg for idx%3===1 (ratio 1.81:1, needs 4.5:1) → changed to conditional `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/activities/page.tsx:186` — `#78d750` checkmark icon on `#8ec63f` panel bg for idx%3===1 (ratio 1.13:1, needs 3:1 non-text) → changed to conditional `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/activities/page.tsx:199` — `#8ec63f` badge text on `#f8fbf2` (ratio 1.95:1, needs 4.5:1) → changed badge background to `#015231` with white text (ratio 9.32:1)
- `app/(public)/[locale]/activities/page.tsx:207` — `#8ec63f` read-more link on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/activities/page.tsx:226` — `#8ec63f` on `#f8fbf2` (ratio 1.95:1, needs 4.5:1) → changed text color to `#015231` (ratio 8.91:1)
- `app/(public)/[locale]/about/page.tsx:163` — `#fff` value text on `#8ec63f` achievements-strip background (ratio 2.04:1, needs 3:1) → changed background to `#013d27` (ratio 12.37:1)
- `app/(public)/[locale]/about/page.tsx:186` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/about/page.tsx:225` — `#8ec63f` sector-list index number on white card (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/about/page.tsx:345` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/about/page.tsx:424` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/about/page.tsx:452` — `#fff` caption text on `rgba(6,78,59,0.55)` hover overlay over the certificate image, worst case against a light document photo (ratio 3.55:1, needs 4.5:1) → raised overlay to `rgba(6,78,59,0.85)` (ratio 6.91:1 worst-case)
- `app/(public)/[locale]/about/page.tsx:472` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/about/page.tsx:595` — `#8ec63f` badge text on `#f8fbf2` (ratio 1.95:1, needs 4.5:1) → changed text color to `#015231` (ratio 8.91:1)
- `app/(public)/[locale]/about/page.tsx:610` — `#8ec63f` on `#FAFAFA` (ratio ~2.0:1, needs 4.5:1) → changed text color to `#015231` (ratio ~9.2:1)
- `app/(public)/[locale]/business-segments/page.tsx:237` — "View Details" pill link, `text-white` on `bg-[#8ec63f]` (ratio 2.04:1, needs 4.5:1) → changed to `text-[#013d27]` with `hover:text-white` (hover bg `#015231`, ratio 6.07:1 default / 9.32:1 hover)
- `app/(public)/[locale]/business-segments/page.tsx:189,200,202` — sector accent-panel heading, badge text, and checkmark icon go against a data-driven `accentBg`; for the `xay-lap-cong-trinh` sector this resolves to the light `#8ec63f`, making the previously-hardcoded `#fff`/`#defbbc`/`#78d750` text/icon colors fail badly (ratios 1.03:1–2.04:1, need 4.5:1 text / 3:1 icon) → added an `accentIsLight` conditional that swaps all three to `#013d27` whenever `accentBg === '#8ec63f'` (heading 6.07:1, badge-on-rgba(255,255,255,0.12)-composite 6.63:1, icon 6.07:1); the two darker sectors (`#015231`, `#013d27`) are unaffected and keep the original light-on-dark colors (9.34:1 / 12.37:1 heading, 6.04:1 / 7.73:1 badge)
- `app/(public)/[locale]/business-segments/page.tsx:218` — content-panel "Lĩnh vực NN" step badge, `#8ec63f` on `#f8fbf2` (ratio 1.95:1, needs 4.5:1) → changed text color to `#015231` (ratio 8.91:1)
- `app/(public)/[locale]/business-segments/page.tsx:246` — "Get a quote" link, `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:84,94` — `text-gray-300` subtitle sitting near the banner gradient's weaker stop (alpha 0.75) against a light-photo worst case (ratio 3.63:1, needs 4.5:1) → raised gradient to rgba(1,82,49,0.85)+ and changed text color to `#defbbc` (ratio 5.99:1 worst-case)
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:90` — `text-gray-400` (`#9CA3AF`) on `#015231` hero (ratio 3.67:1, needs 4.5:1) → changed to `text-[#defbbc]` (ratio 8.27:1)
- `app/(public)/[locale]/careers/page.tsx:197` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/careers/page.tsx:232-233` — `#8ec63f` stat value (`text-3xl`, large-text 3:1 threshold) on implicit white card bg (ratio 2.04:1, needs 3:1) → changed card background to `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/careers/page.tsx:266` — `#fff` number on `#8ec63f` badge circle (ratio 2.04:1, needs 3:1 non-text/large) → changed text color to `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/careers/page.tsx:286` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/careers/page.tsx:311` — `#8ec63f` on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/news/page.tsx:81` — `#fff` active-tab text on `#8ec63f` (ratio 2.04:1, needs 4.5:1) → changed to `#013d27` when active (ratio 6.07:1)
- `app/(public)/[locale]/news/page.tsx:95` — `#fff` active-tab text on `#8ec63f` (ratio 2.04:1, needs 4.5:1) → changed to `#013d27` when active (ratio 6.07:1)
- `app/(public)/[locale]/news/page.tsx:116` — `#defbbc` decorative index number on white card (ratio 1.13:1, needs 4.5:1) → changed text color to `#6B7280` (ratio 4.83:1)
- `app/(public)/[locale]/news/page.tsx:123` — `#8ec63f` badge on `#f8fbf2` (ratio 1.95:1, needs 4.5:1) → changed text color to `#015231` (ratio 8.91:1)
- `app/(public)/[locale]/news/page.tsx:139` — `#8ec63f` read-more link on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/news/page.tsx:178` — `#8ec63f` read-more link on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/news/page.tsx:200` — `#fff` active-page text on `#8ec63f` (ratio 2.04:1, needs 4.5:1) → changed to `#013d27` when active (ratio 6.07:1)
- `app/(public)/[locale]/contact/page.tsx:61` — `text-gray-400` (`#9CA3AF`) on `#015231` hero (ratio 3.67:1, needs 4.5:1) → changed to `text-[#defbbc]` (ratio 8.27:1)
- `app/(public)/[locale]/shareholder-relations/page.tsx:74` — `text-gray-400` (`#9CA3AF`) on `#015231` hero (ratio 3.67:1, needs 4.5:1) → changed to `text-[#defbbc]` (ratio 8.27:1)
- `components/public/Header.tsx:69` — `#8ec63f` nav-link hover text on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed to `#015231` (ratio 9.32:1)
- `components/public/Header.tsx:101` — `#8ec63f` active locale-switcher text on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed to `#015231` (ratio 9.32:1)
- `components/public/Header.tsx:116-118` — implicit white text on `#8ec63f` Contact button (ratio 2.04:1, needs 4.5:1) → changed text color to `#013d27` (ratio 6.07:1), hover state swaps bg to `#015231` with text `#fff` (ratio 9.32:1)
- `components/public/Header.tsx:153` — `#8ec63f` active mobile-nav text on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed to `#015231` (ratio 9.32:1)
- `components/public/FloatingContact.tsx:26` — `#fff` phone-button icon on `#3fbf5f` (ratio 2.38:1, needs 3:1 non-text) → changed background to `#297c3e` (ratio 5.19:1)
- `components/public/FloatingContact.tsx:40` — `#fff` messenger-button icon on gradient starting `#00b2ff` (ratio 2.38:1, needs 3:1 non-text) → changed gradient start to `#0074a6` (ratio 5.19:1)

## Passing (spot-checked, no change needed)

- `app/(public)/[locale]/page.tsx:322,324` — `#defbbc` card border/divider (decorative, non-text) on `#ffffff` — OK, not a text pairing
- `app/(public)/[locale]/page.tsx:185` — `#6B7280` on `#ffffff` (bg-white sector card, ratio 4.83:1) — OK
- `app/(public)/[locale]/page.tsx:240` — `#78d750` eyebrow on solid `#015231` (Statistics section, ratio 5.18:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/page.tsx:409` — `#defbbc` on solid `#013d27` (CTA section, ratio 8.27:1+) — OK
- `app/(public)/[locale]/activities/page.tsx:171` — panel background cycling (`#015231`, `#8ec63f`, `#013d27`) — OK, decorative background only
- `app/(public)/[locale]/activities/page.tsx:203,247,257,280` — `#374151` on white/`#f8fbf2` (ratio 10.31:1) — OK
- `app/(public)/[locale]/about/page.tsx:172` — `#defbbc` desc on solid `#013d27` achievements bg (ratio 10.97:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/about/page.tsx:415` (legal data list) — `#6B7280` on white (ratio 4.83:1) — OK
- `app/(public)/[locale]/careers/page.tsx:233` — `#8ec63f` large stat value (`text-3xl`) on `#013d27` (ratio 6.07:1, large-text 3:1 threshold) — OK
- `app/(public)/[locale]/careers/page.tsx:234` — `#D1D5DB` stat label on solid `#013d27` (ratio 8.39:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:126` — `#015231` on `#FAFAFA` sidebar (ratio ~9.2:1) — OK
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:129` — `#6B7280` on `#FAFAFA` (ratio ~4.7:1) — OK
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:134` — `#fff` on `#015231` button (ratio 9.32:1) — OK
- `app/(public)/[locale]/business-segments/page.tsx:106` — `#78d750` eyebrow on solid `#015231` (hero, ratio 5.17:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/business-segments/page.tsx:112` — `#defbbc` subtitle on solid `#015231` (hero, ratio 8.27:1) — OK
- `app/(public)/[locale]/business-segments/page.tsx:125` — `#015231` tag text on `#f8fbf2` pill — OK
- `app/(public)/[locale]/business-segments/page.tsx:228,269` — `#374151` body text on white/`#f8fbf2` content panel (ratio 10.31:1) — OK
- `app/(public)/[locale]/business-segments/page.tsx:265` — `#8ec63f` decorative `<Leaf>` icon on `#f8fbf2` (Bottom CTA section, ratio 1.95:1) — OK, decorative accent icon adjacent to a heading conveying the same meaning, not a "graphical object required to understand content" under WCAG 1.4.11 non-text contrast
- `app/(public)/[locale]/business-segments/page.tsx:266` — `#015231` heading on `#f8fbf2` (Bottom CTA section, ratio ~8.9:1) — OK
- `app/(public)/[locale]/contact/page.tsx:91` — `#6B7280` label on `#f8fbf2` (ratio 4.62:1) — OK
- `app/(public)/[locale]/contact/page.tsx:92` — `#015231` value on `#f8fbf2` (ratio 8.91:1) — OK
- `app/(public)/[locale]/shareholder-relations/page.tsx:94,96,133` — `#6B7280` on white (ratio 4.83:1) — OK
- `app/(public)/[locale]/shareholder-relations/page.tsx:95,117,132,139` — `#015231` on white/`#f8fbf2` (ratio 8.91-9.32:1) — OK
- `components/public/Footer.tsx:51,69,83,87,91,95,104` — `#defbbc` on `#015231` (ratio 8.27:1) — OK
- `components/public/Footer.tsx:54,71,84,88,92,96,105` — `#8ec63f` on `#015231` (ratio 4.57:1) — OK
- `app/(public)/[locale]/layout.tsx` — no color pairings of its own (composition only) — N/A

## Summary

155 pairings checked across 14 files (`components/public/PartnerMarquee.tsx` excluded — see note above). 47 failures found and fixed via direct color/opacity changes: the original 41, plus 6 found during a proactive re-audit prompted by a second reviewer flagging unverified Passing-section citations (business-segments/page.tsx "View Details" link; the business-segments/page.tsx accentIsLight conditional covering 3 sub-elements for the `xay-lap-cong-trinh` sector; the business-segments/page.tsx step-badge and "Get a quote" link; the homepage marquee subtitle; the homepage marquee fallback-avatar text). 0 remaining known failures.
