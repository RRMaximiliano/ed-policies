import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/ed-policies' : '',
  assetPrefix: isProd ? '/ed-policies/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
