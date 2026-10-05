import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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