// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to Backend
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*', // Proxy for uploads
      },
    ];
  },
}

module.exports = nextConfig