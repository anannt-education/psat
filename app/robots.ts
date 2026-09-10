import type { MetadataRoute } from "next"
import { BASE_PATH, STUDY_ORIGIN } from "@/lib/gate"
import { absoluteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        `${BASE_PATH}/`,
        `${BASE_PATH}/method`,
        `${BASE_PATH}/for-families`,
        `${BASE_PATH}/help`,
        `${BASE_PATH}/learn`,
        `${BASE_PATH}/learn/M2/M2-L1`,
        `${BASE_PATH}/learn/RW1/RW1-L1`,
        `${BASE_PATH}/diagnostic`,
      ],
      disallow: [
        `${BASE_PATH}/api/`,
        `${BASE_PATH}/mocks`,
        `${BASE_PATH}/practice`,
        `${BASE_PATH}/mentor`,
        `${BASE_PATH}/today`,
        `${BASE_PATH}/progress`,
        `${BASE_PATH}/mistakes`,
        `${BASE_PATH}/parent`,
        `${BASE_PATH}/onboard`,
        `${BASE_PATH}/orient`,
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: STUDY_ORIGIN,
  }
}
