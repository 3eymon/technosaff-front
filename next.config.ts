import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mpttools.co',
        port: '',
        pathname: '/media/**',
      },
    ],
  },

};

export default nextConfig;
