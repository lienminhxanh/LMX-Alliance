---
description: Tạo conventional commit từ staged changes
allowed-tools: Bash(git add*), Bash(git status*), Bash(git diff*), Bash(git commit*)
---

# Smart Git Commit

## Context
- Current status: !`git status`
- Staged diff: !`git diff --cached`
- Recent commits: !`git log --oneline -5`

## Task

Create a conventional commit:
1. Analyze the staged changes
2. Determine the commit type:
   - feat: new feature
   - fix: bug fix
   - refactor: code restructure
   - style: formatting
   - docs: documentation
   - chore: dependencies, config
3. Write message following format: