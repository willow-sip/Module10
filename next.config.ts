import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Module10',
  async rewrites() {
    return [
      {
        source: '/Module10/mockServiceWorker.js',
        destination: '/mockServiceWorker.js',
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  images: {
    unoptimized: true,
  },
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
