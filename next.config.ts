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
};

export default nextConfig;