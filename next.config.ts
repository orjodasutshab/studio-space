import type { NextConfig } from "next";

// All /api/... calls from the browser are forwarded to the Express server.
// This keeps the login cookie on the same site, so reloads never log the user out.
const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
