import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Practice session",
  description:
    "Anannt Education PSAT practice: guided hints, independent quizzes, mixed review, or a timed mini-set. Hinted work is assisted and cannot satisfy mastery.",
  path: "/practice/run",
  noIndex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
