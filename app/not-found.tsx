import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MentorNote } from "@/components/mentor-note"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "That route is not on the Anannt Education PSAT path. Return to the curriculum map or Today.",
  path: "/404",
  noIndex: true,
})

export default function NotFound() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Anannt Education</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">This page is not on the path</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          That URL is not a lesson, a practice mode, or a family page in this PSAT/NMSQT and PSAT 10 slice. Nothing is
          lost — pick up from a named next step.
        </p>
      </div>
      <MentorNote>
        If you were mid-lesson, open Learn and return to the unit (M2 slope, RW8 sentence boundaries, or whichever you
        last saw). If you have a saved profile on this device, Today still holds the dated task.
      </MentorNote>
      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/" />}>Home</Button>
        <Button variant="outline" render={<Link href="/learn" />}>
          Curriculum map
        </Button>
        <Button variant="outline" render={<Link href="/today" />}>
          Today
        </Button>
      </div>
    </div>
  )
}
