/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bankbridge/contracts'],
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: '/docs',
        destination: `${apiBase}/docs`,
      },
      {
        source: '/docs/:path*',
        destination: `${apiBase}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
