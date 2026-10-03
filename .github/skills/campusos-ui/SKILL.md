---
name: campusos-ui
description: Builds or refines CampusOS user interfaces while preserving the existing visual system. Use for route, component, interaction, accessibility, or visual-design work.
---

# CampusOS UI

Start with the target route and nearby components. Read `app/globals.css`, the relevant `components/ui/` primitives, and reusable pieces in `components/os/` or `components/layout/` before designing.

## Product visual language

- Keep the student-first, futuristic campus identity: semantic OKLCH tokens, aurora atmosphere, layered Liquid Glass, light/dark themes, and purposeful micro-interactions.
- Use existing CSS variables and components before adding styles or primitives. Keep new surface treatments sparse; glass and blur should clarify hierarchy rather than decorate every element.
- Avoid generic dashboard/card layouts, arbitrary colors, unnecessary gradients, purple AI glow, uniform oversized rounding, and motion that does not clarify an interaction.
- Use Lucide icons consistently and campus-relevant copy. Label sample or session-local data honestly.

## Build and review

- Prefer semantic HTML and server components. Keep browser state in the smallest client boundary needed.
- Provide visible focus, accessible names, sufficient contrast in both themes, reduced-motion behavior, and meaningful loading, empty, error, and disabled states.
- Check narrow and wide layouts with actual content; ensure controls remain reachable and no page-level horizontal overflow occurs.
- After implementation, inspect the route in a browser when available, including desktop/mobile and light/dark modes. Run relevant repository checks and report anything not verified.
