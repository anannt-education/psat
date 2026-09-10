"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStudent } from "@/lib/storage"
import { PUBLIC_LESSONS, SAT_COACHING_URL } from "@/lib/mount"

export function ContinueToPath() {
  const { hydrated } = useStudent()

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Checking this device for a saved path…</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="lg" render={<Link href={PUBLIC_LESSONS[0].path} />}>
        Start lesson 1 — slope in context
      </Button>
      <Button size="lg" variant="outline" render={<Link href={PUBLIC_LESSONS[1].path} />}>
        Lesson 2 — some versus all
      </Button>
      <Button size="lg" variant="ghost" render={<Link href="/diagnostic" />}>
        Diagnostic start
      </Button>
      <Button size="lg" variant="ghost" render={<a href={SAT_COACHING_URL} />}>
        Digital SAT mentoring
      </Button>
    </div>
  )
}
