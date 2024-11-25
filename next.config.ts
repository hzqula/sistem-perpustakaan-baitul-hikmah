import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "books.google.co.id",
      "gpu.id",
      "ebooks.gramedia.com",
      "s3-ap-southeast-1.amazonaws.com",
      "image.gramedia.net",
      "example.com",
    ],
  },
};

export default nextConfig;
