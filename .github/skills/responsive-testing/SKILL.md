---
name: responsive-testing
description: Verifies CampusOS layouts and controls across mobile, tablet, desktop, themes, and keyboard states. Use for UI changes or visual regression checks.
---

# Responsive UI testing

Test the affected live or local route with Playwright or available browser tools. Do not treat a successful compile as proof of responsive behavior.

## Coverage

- Check representative widths around 390px (mobile), 768px (tablet), 1024px (small desktop), and 1440px (desktop); include the exact viewport implicated by the change.
- Inspect both light and dark themes. Check real labels, long text, empty/loading/disabled states, and content at the narrowest relevant size.
- Verify no document-level horizontal overflow; controls fit, wrap or scroll intentionally; touch targets and spacing remain usable.
- Test keyboard navigation and visible focus as well as hover, active, and disabled states where applicable.
- Read browser console errors and distinguish route-guard redirects from page failures. Never bypass authentication or enter fabricated credentials.

## Reporting

Record route, viewport, theme, interaction, and observed evidence for each issue. After a fix, repeat the same check and report any routes or states that could not be accessed.
