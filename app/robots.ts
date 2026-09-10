import type { MetadataRoute } from "next"
import { SITE_URL, absUrl } from "@/lib/mount"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/learn/RW0/RW0-L1",
          "/learn/M2/M2-L1",
          "/method",
          "/faq",
          "/privacy",
          "/diagnostic",
        ],
        disallow: ["/mock", "/mocks", "/api", "/keys", "/practice", "/mentor"],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: SITE_URL,
  }
}
