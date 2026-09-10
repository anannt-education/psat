import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { PUBLIC_SEO } from "@/lib/mount"

export const metadata: Metadata = pageMetadata({
  title: PUBLIC_SEO.diagnostic.title,
  description: PUBLIC_SEO.diagnostic.description,
  path: PUBLIC_SEO.diagnostic.path,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
