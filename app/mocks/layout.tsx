import type { Metadata } from "next"
import { metadataForPath } from "@/lib/seo"

export const metadata: Metadata = {
  ...metadataForPath("/mocks"),
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
