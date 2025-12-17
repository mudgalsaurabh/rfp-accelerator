import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse', 'mammoth', 'xlsx', '@google-cloud/vertexai'],
  env: {
    GEMINI_API_KEY: 'AIzaSyDwEjLWSK0iuMZn4i-zU3_U2UuPbWELF_8',
  },
};

export default nextConfig;
