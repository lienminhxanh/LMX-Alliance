---
description: Audit code để check design system compliance
allowed-tools: Bash(grep*), Bash(find*)
---

# Design System Audit

Check the project for design violations:

1. Search for hardcoded colors that should use CSS variables:
   - `grep -r "color: #" components/` (should use --color-* variables)
   - `grep -r "border-radius: 12px" components/` (should be 0-4px max)
   - `grep -r "Inter\|Poppins" components/` (should be Charter for headlines)

2. Check for forbidden patterns:
   - `grep -r "border-radius: [0-9]*px" components/ | grep -v "0\|2\|4"`
   - Look for gradient backgrounds
   - Find heavy shadows

3. Report findings with:
   - File path
   - Line number
   - Suggested fix

4. Check tailwind.config.ts for proper CSS variable usage