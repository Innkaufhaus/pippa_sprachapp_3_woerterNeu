/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
