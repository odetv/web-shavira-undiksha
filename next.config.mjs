/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "undiksha.ac.id",
      },
      {
        protocol: "https",
        hostname: "aka.undiksha.ac.id",
      },
    ],
  },
};

export default nextConfig;
