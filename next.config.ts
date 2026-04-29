import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const normalizeApiUrl = (url?: string) =>
      url?.replace(/\/+$/, "").replace(/\/api$/, "") || "http://localhost:5000";

    const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
