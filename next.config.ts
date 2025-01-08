import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/generate", // Replace with your desired route
        permanent: true, // Use true for a permanent redirect (301)
      },
    ];
  },
};

export default nextConfig;
