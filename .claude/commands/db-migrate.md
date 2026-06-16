---
description: Run Prisma migrations và generate client
allowed-tools: Bash(npx prisma*)
---

# Database Migration Workflow

Execute the Prisma workflow:
1. Run `npx prisma generate` to update client
2. Run `npx prisma migrate dev --name $ARGUMENTS` if migration name provided
3. Otherwise just run `npx prisma db push` for quick dev sync
4. Show migration status with `npx prisma migrate status`
5. Report any issues