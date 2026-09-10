import type { Metadata } from "next"
import { metadataForPath } from "@/lib/seo"

export const metadata: Metadata = metadataForPath("/parent")

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
