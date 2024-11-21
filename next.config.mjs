/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api",
        destination: `${process.env.NEXT_PUBLIC_VERCEL_VA_API_URL}`,
      },
      {
        source: "/api/chat",
        destination: `${process.env.NEXT_PUBLIC_VERCEL_VA_API_URL}/chat`,
      },
    ];
  },
};

export default nextConfig;
