/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: "http://119.252.174.189:1014/chat",
      },
    ];
  },
};

export default nextConfig;
