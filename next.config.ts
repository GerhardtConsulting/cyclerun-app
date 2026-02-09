import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/tv",
        destination: "/cast",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
