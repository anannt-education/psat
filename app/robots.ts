import type { MetadataRoute } from "next"
import { ROBOTS_DISALLOW, SITE_ORIGIN, absUrl } from "@/lib/mount"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/learn/M2/M2-L1", "/learn/RW1/RW1-L1", "/method", "/for-families", "/help", "/diagnostic"],
      disallow: ROBOTS_DISALLOW,
    },
    sitemap: absUrl("/sitemap.xml"),
    host: SITE_ORIGIN,
  }
}
