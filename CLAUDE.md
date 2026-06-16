@AGENTS.md

# LMX Alliance Project Context

## Project Info
- **Type**: Enterprise website + Admin CMS
- **Architecture**: Next.js 14 Monolith
- **Stack**: TypeScript, Prisma, NextAuth, Tailwind
- **Languages**: Vietnamese (default), English, Chinese

## Design Rules (CRITICAL)
- Primary color: #1F2937 (charcoal, NOT teal)
- Headlines: Charter serif (NOT Inter/Poppins)
- Buttons: border-radius: 0 (sharp corners)
- Cards: border-radius: 4px max
- NO gradients, NO bright colors, NO heavy shadows
- Spacing: 16px base, 48px sections

## Code Standards
- TypeScript strict mode
- All forms use React Hook Form + Zod
- All admin mutations use Server Actions
- All database access via Prisma
- All mutations logged to AuditLog
- Multi-language for all user-facing content

## Folder Structure
- `app/(public)/[locale]/` - Public website
- `app/admin/` - Admin panel (protected)
- `app/api/` - API routes (only for uploads)
- `actions/` - Server Actions
- `components/ui/` - Reusable components
- `lib/` - Utilities
- `content/` - i18n translations

## Common Commands
- `/test` - Run tests
- `/db-migrate` - Prisma migrations
- `/check-design` - Audit design
- `/commit` - Smart git commit
- `/deploy` - Deploy to Vercel

## Database Models
20+ Prisma models including:
- User (with UserRole enum)
- CompanySettings (singleton)
- BusinessSector, NewsArticle, JobPosting
- InvestorMessage, InvestorDocument
- Leader, Partner, Project
- ContactMessage, AuditLog

## RBAC Roles
- SUPER_ADMIN: Full access
- CONTENT_MANAGER: News, Jobs, Sectors
- IR_MANAGER: Investor Relations only
- VIEWER: Read-only

## File Storage
- Cloudflare R2 (S3-compatible)
- All images, PDFs, documents stored there
- Public URL pattern: https://files.lmxalliance.com/...