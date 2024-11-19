/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api", // Endpoint proxy lokal
        destination: `${process.env.NEXT_PUBLIC_VERCEL_VA_API_URL}`, // API server target
      },
      {
        source: "/api/chat", // Endpoint proxy lokal
        destination: `${process.env.NEXT_PUBLIC_VERCEL_VA_API_URL}/chat`, // API server target
      },
    ];
  },
};

export default nextConfig;
