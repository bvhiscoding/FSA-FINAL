import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@libsql/client", "@prisma/adapter-libsql"]
};

export default nextConfig;
