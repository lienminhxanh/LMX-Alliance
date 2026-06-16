---
description: Pre-deployment checks + deploy to Vercel
allowed-tools: Bash(npm*), Bash(vercel*), Bash(git*)
---

# Deployment Workflow

Run pre-deployment checks then deploy:

1. **Pre-checks**:
   - Run `npm run type-check`
   - Run `npm run lint`
   - Run `npm run build` locally
   - Check no console.log in production code
   - Verify .env.local has all required vars

2. **Database**:
   - Verify Prisma schema is in sync
   - Check pending migrations

3. **Git**:
   - Verify all changes committed
   - Push to main branch

4. **Deploy**:
   - Run `vercel --prod`
   - Show deployment URL
   - Verify deployment status

5. **Post-deploy**:
   - Test production URL
   - Check Lighthouse score
   - Verify all 3 languages working