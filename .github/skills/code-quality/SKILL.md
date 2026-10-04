---
name: code-quality
description: Validates CampusOS changes with the repository's lint, typecheck, build, and evidence-based review workflow. Use before delivery or when CI fails.
---

# CampusOS code quality

Use the validation commands and current test-suite status documented in `.github/copilot-instructions.md` as the source of truth. Check `package.json` and the relevant workflow if validation configuration has changed.

For code changes, run the narrowest relevant check first and the full CI-equivalent checks when feasible. For UI behavior, supplement static checks with browser inspection at representative mobile/tablet/desktop sizes and both themes. Report exact commands and outcomes; do not imply an unrun check passed.

Before finalizing, inspect `git diff --check`, review staged and unstaged changes separately, preserve unrelated work, and ensure no secret values or generated artifacts are included. Do not commit or push unless explicitly requested.
