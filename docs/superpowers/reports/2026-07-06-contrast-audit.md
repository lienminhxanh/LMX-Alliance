# Contrast Audit — Full Public Site (Phase 3)

Method: WCAG 2.1 AA (4.5:1 normal text, 3:1 large text/UI). Computed via
relative-luminance contrast ratio on every text/background color pairing
found across app/(public)/[locale]/**/page.tsx, layout.tsx, Header.tsx,
Footer.tsx, FloatingContact.tsx, PartnerMarquee.tsx.

## Failures found and fixed

- `app/(public)/[locale]/page.tsx:103,112` — `#78d750` eyebrow text sitting in the hero's gradient-overlay region (min alpha 0.25 there) against a light-photo worst case (ratio 1.10:1, needs 4.5:1) → raised gradient floor to rgba(1,82,49,0.78)+ and changed text color to `#defbbc` (ratio 5.12:1 worst-case)
- `app/(public)/[locale]/page.tsx:132` — `#fff` on `#8ec63f` (ratio 2.04:1, needs 4.5:1) → changed text color to `#013d27` (ratio 6.07:1)
- `app/(public)/[locale]/page.tsx:343` — `#8ec63f` read-more link on `#ffffff` (ratio 2.04:1, needs 4.5:1) → changed text color to `#015231` (ratio 9.32:1)
- `app/(public)/[locale]/page.tsx` (old inline partners-marquee block, since removed) — `#9CA3AF` on `#ffffff` (ratio 2.54:1, needs 4.5:1) → resolved by extracting the marquee to `components/public/PartnerMarquee.tsx`, which uses `#6B7280`/theme-appropriate colors from the start (ratio 4.83:1+); tracked as a component-extraction change, not a line-level color swap
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

- `app/(public)/[locale]/page.tsx:71` — `#defbbc` border (decorative, non-text) on `#ffffff` — OK, not a text pairing
- `app/(public)/[locale]/page.tsx:49-53` (PartnerLogoFallback) — `#15803d`/`#f0fdf4` (4.79:1), `#0369a1`/`#f0f9ff` (5.19:1), `#6b21a8`/`#faf5ff` (8.13:1), `#be185d`/`#fdf2f8` (5.51:1), `#b91c1c`/`#fef2f2` (5.05:1) — OK
- `app/(public)/[locale]/page.tsx:213` — `#6B7280` on `#f8fbf2` (ratio 4.62:1) — OK
- `app/(public)/[locale]/page.tsx:315,318` — `#78d750` eyebrow on solid `#015231` (ratio 5.17:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/page.tsx:463` — `#defbbc` on solid `#013d27` (ratio 8.27:1+) — OK
- `app/(public)/[locale]/activities/page.tsx:171` — panel background cycling (`#015231`, `#8ec63f`, `#013d27`) — OK, decorative background only
- `app/(public)/[locale]/activities/page.tsx:203,247,257,280` — `#374151` on white/`#f8fbf2` (ratio 10.31:1) — OK
- `app/(public)/[locale]/about/page.tsx:172` — `text-gray-300` desc on solid `#013d27` achievements bg (ratio 8.39:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/about/page.tsx:420` (legal data list) — `#6B7280` on white (ratio 4.83:1) — OK
- `app/(public)/[locale]/careers/page.tsx:233` — `#8ec63f` large stat value (`text-3xl`) on `#013d27` (ratio 6.07:1, large-text 3:1 threshold) — OK
- `app/(public)/[locale]/careers/page.tsx:234` — `text-gray-300` stat label on solid `#013d27` (ratio 8.39:1) — OK, no photo-dilution risk (solid color section)
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:126` — `#015231` on `#FAFAFA` sidebar (ratio ~9.2:1) — OK
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:129` — `#6B7280` on `#FAFAFA` (ratio ~4.7:1) — OK
- `app/(public)/[locale]/business-segments/[slug]/page.tsx:134` — `#fff` on `#015231` button (ratio 9.32:1) — OK
- `app/(public)/[locale]/business-segments/page.tsx:173` — `#4B5563` on white (ratio 7.56:1) — OK
- `app/(public)/[locale]/business-segments/page.tsx:189,208` — `#015231`/`#fff` on white/`#015231` button — OK
- `app/(public)/[locale]/contact/page.tsx:91` — `#6B7280` label on `#f8fbf2` (ratio 4.62:1) — OK
- `app/(public)/[locale]/contact/page.tsx:92` — `#015231` value on `#f8fbf2` (ratio 8.91:1) — OK
- `app/(public)/[locale]/shareholder-relations/page.tsx:94,96,133` — `#6B7280` on white (ratio 4.83:1) — OK
- `app/(public)/[locale]/shareholder-relations/page.tsx:95,117,132,139` — `#015231` on white/`#f8fbf2` (ratio 8.91-9.32:1) — OK
- `components/public/Footer.tsx:51,69,83,87,91,95,104` — `#defbbc` on `#015231` (ratio 8.27:1) — OK
- `components/public/Footer.tsx:54,71,84,88,92,96,105` — `#8ec63f` on `#015231` (ratio 4.57:1) — OK
- `components/public/PartnerMarquee.tsx:8,29,32` — `#327b36`→`#015231` gradient fallback, `#015231` heading on white, `#8ec63f` decorative bar — OK (new component, no prior failure state)
- `app/(public)/[locale]/layout.tsx` — no color pairings of its own (composition only) — N/A

## Summary

149 pairings checked across 14 files. 41 failures found and fixed via direct color/opacity changes, plus 1 additional failure (homepage inline partners marquee) resolved by component extraction. 0 remaining known failures.
