/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/doctor/:slug((?!dashboard).*)', destination: '/doctors/:slug', permanent: true },
      { source: '/login', destination: '/sign-in', permanent: true },
      { source: '/register', destination: '/sign-up', permanent: true },
    ];
  },

  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/v1/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/:path*`,
          },
        ]
      : [];
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;