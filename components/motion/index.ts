/**
 * The CampusOS motion primitive barrel.
 * Template for each export: a React client component that respects
 * `prefers-reduced-motion`, uses the shared motion tokens from
 * `app/globals.css`, and stays composable (consumer-first props).
 *
 * TypingEffect / CountUp / BlurText are exported from their own files
 * because they wrap different DOM roots; import them directly.
 */
export * from "./Reveal";
export * from "./Stagger";
export * from "./PageTransition";
export * from "./Magnetic";
export * from "./Spotlight";
export * from "./HoverLift";