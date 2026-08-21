import type { MetadataRoute } from "next";
import { productCategories } from "@/lib/products";
import { company } from "@/lib/site";

const staticRoutes = [
  "",
  "/about-us",
  "/our-services",
  "/products-services",
  "/productcatalogs-vendors-billing",
  "/lower-extremity-products",
  "/upper-extremity-products",
  "/patients",
  "/providers",
  "/facilities",
  "/insurance",
  "/va-fss-contractor",
  "/gsa-fss-products",
  "/dapa-dod-dla-dmlss-products",
  "/capability-statement",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
  "/medicare-dmepos-standards",
  "/patient-rights",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...staticRoutes.map((path) => ({
      url: `${company.url}${path || "/"}`,
      lastModified,
    })),
    ...productCategories.map((category) => ({
      url: `${company.url}${category.href}`,
      lastModified,
    })),
  ];
}
