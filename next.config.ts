import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { qualities: [75, 85] },
  // `output: "standalone"` is for self-hosted/Docker deployments only.
  // Vercel performs its own file tracing and fails the build when
  // standalone mode is on (`ENOENT ... .next/next-server.js.nft.json`),
  // so it must stay off when VERCEL=1.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  // This project lives inside a parent Git repository, so Turbopack otherwise
  // resolves its root to C:\Users\ASUS and silently ignores the workspace
  // lockfile. Pinning the root keeps module resolution and `process.env`
  // injection scoped to the project directory.
  turbopack: {
    root: path.resolve("."),
  },
  allowedDevOrigins: [
    "ais-dev-hee5jj6zdsrlptot636ivi-397509425928.asia-east1.run.app",
    "*.run.app",
  ],
  // Baseline hardening headers. Deliberately no CSP: Next.js + Supabase
  // auth rely on inline scripts/styles and cross-origin auth endpoints,
  // so a strict CSP would break login. Revisit only with a nonce-based
  // policy tested against the auth flow.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
