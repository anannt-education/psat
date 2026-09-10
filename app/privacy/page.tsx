import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { PUBLIC_SEO } from "@/lib/mount"

export const metadata: Metadata = pageMetadata({
  title: PUBLIC_SEO.privacy.title,
  description: PUBLIC_SEO.privacy.description,
  path: PUBLIC_SEO.privacy.path,
})

export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold">Privacy and local data</h1>
      <p>
        PSAT progress on this device stays in the browser. This path does not take payment, does not open an AP
        checkout, and does not sell student data.
      </p>
      <p className="text-muted-foreground">
        After two public lessons, study.anannt.ae may collect a name, email, and parent WhatsApp so a mentor can help
        with Digital SAT. Under 13, a parent completes that form.
      </p>
      <p className="text-muted-foreground">
        Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 ·
        wecare@anannt.ae
      </p>
    </article>
  )
}
