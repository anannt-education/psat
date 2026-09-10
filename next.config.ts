import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  basePath: "/psat",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
