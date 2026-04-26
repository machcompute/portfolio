import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://portfolio.machcomputing.com", lastModified: now },
    {
      url: "https://portfolio.machcomputing.com/certifications",
      lastModified: now,
    },
  ];
}
