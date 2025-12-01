import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: 'https://willow-sip.github.io/Module10/',
  assetPrefix: '/Module10/',

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
  async redirects() {
    return [
      {
        source: '/mockServiceWorker.js',
        destination: '/Module10/mockServiceWorker.js',
        permanent: true,
        basePath: false,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/mockServiceWorker.js',
          destination: '/Module10/mockServiceWorker.js',
          basePath: false,
        },
      ],
    }
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
