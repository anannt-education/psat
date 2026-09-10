"use client"

import { Button } from "@/components/ui/button"
import { MentorNote } from "@/components/mentor-note"

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Anannt Education</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">This page hit a snag</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Your progress on this device is unchanged. Retry the page, or return to Today and pick up the named task —
          a lesson on slope or sentence boundaries if that was where you were.
        </p>
      </div>
      <MentorNote>
        A failed load is not a failed sitting. Nothing here converts into an official score. Try again once; if it
        repeats, open the curriculum map and continue from a complete lesson.
      </MentorNote>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/today")}>
          Go to Today
        </Button>
      </div>
    </div>
  )
}
