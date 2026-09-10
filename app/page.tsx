import type { Metadata } from "next"
import { HomeLanding } from "@/components/home-landing"
import { JsonLd } from "@/components/json-ld"
import { courseJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo"
import { BRAND } from "@/lib/brand"

export const metadata: Metadata = pageMetadata({
  title: "PSAT/NMSQT path — SAT feeder, two open lessons",
  description: BRAND.description,
  path: "/",
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), courseJsonLd()]} />
      <HomeLanding />
    </>
  )
}
