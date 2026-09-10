import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    'ais-dev-cifwtfxwt3frkq5rvsd3gw-399107133959.europe-west2.run.app',
    'ais-pre-cifwtfxwt3frkq5rvsd3gw-399107133959.europe-west2.run.app',
    'localhost:3000',
  ],
};

export default nextConfig;
