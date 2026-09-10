import type { Metadata } from "next"
import { HomeLanding } from "@/components/home-landing"
import { JsonLd } from "@/components/json-ld"
import { courseJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "PSAT/NMSQT — SAT feeder, two public lessons",
  description:
    "Slope in context and some-versus-all are open with no account. A SAT feeder from Anannt Education — not an AP course. Full PSAT/NMSQT® disclaimer below.",
  path: "/",
  noIndex: false,
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), courseJsonLd()]} />
      <HomeLanding />
    </>
  )
}
