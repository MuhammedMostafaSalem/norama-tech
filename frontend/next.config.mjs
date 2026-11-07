import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
