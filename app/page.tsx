import type { Metadata } from "next"
import { HomeLanding } from "@/components/home-landing"
import { JsonLd } from "@/components/json-ld"
import { courseJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo"
import { PUBLIC_SEO } from "@/lib/mount"

export const metadata: Metadata = pageMetadata({
  title: PUBLIC_SEO.home.title,
  description: PUBLIC_SEO.home.description,
  path: PUBLIC_SEO.home.path,
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), courseJsonLd()]} />
      <HomeLanding />
    </>
  )
}
