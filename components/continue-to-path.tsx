"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStudent } from "@/lib/storage"
import { SAT_COACHING_URL } from "@/lib/mount"
import { trackEvent } from "@/lib/events"

export function ContinueToPath() {
  const { state, hydrated } = useStudent()

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Checking this device for a saved path…</p>
  }

  if (!state.profile) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="lg" render={<Link href="/diagnostic" />}>
          Start the SAT preview diagnostic
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/learn/RW0/RW0-L1" />}>
          Lesson 1
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={
            <a
              href={SAT_COACHING_URL}
              onClick={() => trackEvent("demo_book", { sku: "sat-coaching" })}
            />
          }
        >
          Digital SAT mentoring
        </Button>
      </div>
    )
  }

  const next = !state.orientationComplete
    ? { href: "/orient", label: "Continue orientation" }
    : !state.diagnostic
      ? { href: "/diagnostic", label: "Continue the domain screening" }
      : { href: "/today", label: `Continue to Today, ${state.profile.displayName}` }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="lg" render={<Link href={next.href} />}>
        {next.label}
      </Button>
      <Button size="lg" variant="outline" render={<Link href="/learn" />}>
        Curriculum map
      </Button>
    </div>
  )
}
