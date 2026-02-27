# Contributing to FarmEase (Inceptrix 2.0)

Welcome! This guide helps our team of 5 collaborate effectively.

## 🔀 Branch Workflow

1. **Always branch from `develop`** — never directly from `main`.
2. **Naming**: `feature/<short-name>`, `bugfix/<short-name>`, `hotfix/<short-name>`
3. **Keep branches short-lived** — merge within 2-3 days max.

## 📝 Pull Request Rules

- **Title**: Use the commit convention format (e.g., `feat(auth): add OTP login`)
- **Description**: Explain *what* and *why*
- **Reviewers**: Assign at least **1 teammate** for review
- **Tests**: Make sure all tests pass before requesting review
- **No self-merges**: Another team member must approve and merge

## ✅ Code Review Checklist

- [ ] Code is readable and well-documented
- [ ] No hardcoded secrets or API keys
- [ ] Edge cases are handled
- [ ] Naming is clear and consistent
- [ ] No unnecessary console.log or debug code

## 🏷️ Commit Messages

```
<type>(<scope>): <description>

Types:
  feat     — New feature
  fix      — Bug fix
  docs     — Documentation only
  style    — Formatting, no code change
  refactor — Code restructuring
  test     — Adding or updating tests
  chore    — Build, tooling, or dependency changes
```

## 🚫 What NOT to Commit

- `node_modules/`
- `.env` files (use `.env.example` instead)
- IDE/editor-specific settings
- Build artifacts

## 💬 Communication

- Use PR comments for code feedback
- Tag teammates with `@username` for urgent reviews
- Keep discussions respectful and constructive
