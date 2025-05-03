import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.cetrogar.com.ar",
      },
      {
        hostname: "www.gruponucleo.com.ar",
      },{
        hostname: "www.gruponucleo.app",
      },
    ],
  },
};

export default nextConfig;
