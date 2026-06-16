---
description: Tạo Next.js page với i18n + design tokens
argument-hint: <page-name>
---

# Create New Page

Create a new Next.js page: $ARGUMENTS

Steps:
1. Create file at `app/(public)/[locale]/$ARGUMENTS/page.tsx`
2. Use design tokens from globals.css
3. Implement responsive design (mobile/tablet/desktop)
4. Add metadata for SEO
5. Use Charter serif for headlines
6. Charcoal #1F2937 for primary color
7. Sharp button corners (border-radius: 0)
8. Add translations to content/vi.json, en.json, zh.json
9. Update navigation if needed

Template structure:
- Hero section
- Main content
- CTA section
- Use Container, Card, Button components from /components/ui/