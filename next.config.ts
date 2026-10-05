import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "ais-dev-hee5jj6zdsrlptot636ivi-397509425928.asia-east1.run.app",
    "*.run.app",
  ],
};

export default nextConfig;
