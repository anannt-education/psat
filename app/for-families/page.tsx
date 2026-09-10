import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JsonLd } from "@/components/json-ld"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"
import { organizationJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "PSAT prep for families",
  description:
    "How families can support Anannt Education’s PSAT/NMSQT and PSAT 10 path: protect study days, ask for one worked example, and never treat practice percent as an official score.",
  path: "/for-families",
})

export default function ForFamiliesPage() {
  return (
    <article className="space-y-8">
      <JsonLd data={organizationJsonLd()} />
      <header className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{BRAND.name}</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">For families</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          This path is built so a parent can see effort and learning evidence without a stream of failure alerts. The
          student on this device can open a Family summary from Account. There is no login in this slice; a production
          release would require a verified relationship.
        </p>
      </header>

      <MentorNote title="What to ask tonight">
        Not “what did you score?” Ask: “In C = 12 + 3d, which number is the starting value?” or “Why can’t a comma join
        two complete ideas?” One explained example beats an extra unmarked worksheet.
      </MentorNote>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Protect the calendar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            The planner dates sessions from weekly minutes. A missed day is rescheduled; stacking a double session after
            a skip is how burnout starts. If a week goes quiet, a ten-minute return on sentence boundaries or slope is
            enough.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Read evidence, not a fake score</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Coverage, independent accuracy, retention, and timed work are listed separately in Progress. Anannt will not
            convert a percent correct into 320–1520 or a percentile. Official scales live in Help, with dated College
            Board links.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PSAT/NMSQT versus PSAT 10</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Instruction is shared. National Merit context appears only on the NMSQT track, as official links with no
            eligibility guarantee. Completing Anannt lessons does not make anyone a semifinalist.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>When a mentor would check in</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Three unsuccessful attempts on the same skill, a quiet week, or a timed-versus-untimed gap. Those triggers
            are inspectable in the Mentor queue — they are not secret rankings.
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/parent" />}>Open the family summary</Button>
        <Button variant="outline" render={<Link href="/method" />}>
          How we teach
        </Button>
      </div>
    </article>
  )
}
