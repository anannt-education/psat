import type { Metadata } from "next"
import { metadataForPath } from "@/lib/seo"

export const metadata: Metadata = metadataForPath("/mentor")

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
