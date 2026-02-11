import type { MetadataRoute } from "next"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://aurosimobiliaria.com.br"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login/", "/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
