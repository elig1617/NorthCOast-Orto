import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/services-4",
        destination: "/products-services",
        permanent: true,
      },
      {
        source: "/our-products",
        destination: "/productcatalogs-vendors-billing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
