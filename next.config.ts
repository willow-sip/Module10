import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build',

  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
    }
    return config;
  },
};
 
export default nextConfig