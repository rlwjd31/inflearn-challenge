import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "300mb",
    },
  },
  images: {
    remotePatterns: [
      new URL(`https://${process.env.AWS_CLOUDFRONT_DOMAIN}/**`),
    ],
  },
};

export default nextConfig;
