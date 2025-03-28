/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    domains: ['*'],
    // Make ENV
    unoptimized: true,
  },
};

// module.exports = withTM(nextConfig);
module.exports = nextConfig;
