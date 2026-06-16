---
description: Generate sample data cho database
allowed-tools: Bash(npx prisma*)
---

# Generate Seed Data

Create comprehensive seed data for development:

1. **Users**: 
   - 1 Super Admin (admin@lmxalliance.com / password: admin123)
   - 1 Content Manager
   - 1 IR Manager

2. **Company Settings**: Default LMX info

3. **Business Sectors**: 3 sectors with content in VI/EN/ZH

4. **News Articles**: 5 sample articles

5. **Jobs**: 3 sample job postings

6. **Leadership**: 4 team members

7. **Partners**: 5 partner companies

8. **Run**: `npx prisma db seed`

All content should be realistic Vietnamese conglomerate data.