"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SAT_MENTORING_URL } from "@/lib/gate"

export function ContinueToPath() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="lg" render={<Link href="/learn/M2/M2-L1" />}>
        Start lesson 1 — slope in context
      </Button>
      <Button size="lg" variant="outline" render={<Link href="/learn/RW1/RW1-L1" />}>
        Lesson 2: some versus all
      </Button>
      <Button size="lg" variant="ghost" render={<a href={SAT_MENTORING_URL} />}>
        Digital SAT mentoring
      </Button>
    </div>
  )
}
