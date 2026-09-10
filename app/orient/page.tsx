"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStudent } from "@/lib/storage"
import { OFFICIAL_STRUCTURE } from "@/lib/curriculum"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"

export default function OrientPage() {
  const { state, completeOrientation, hydrated } = useStudent()
  const router = useRouter()
  if (!hydrated) return <p className="text-muted-foreground">Loading…</p>

  const nmsqt = state.profile?.track !== "psat-10"

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Step 1 of the journey · Orient · {BRAND.name}</p>
        <h1 className="text-3xl font-semibold tracking-tight">How this test, and this course, work</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          You are on the {nmsqt ? "PSAT/NMSQT" : "PSAT 10"} track. Both products share instructional foundations written
          by Anannt Education. They keep separate assessment identity, reporting, and exam guidance.
        </p>
      </div>

      <MentorNote>
        Read the structure once, slowly. Two Reading and Writing modules, two Math modules, a break you cannot skip on
        the real sitting, and a second module that depends on the first. Then we screen eight domains — we do not invent
        a score from that sitting.
      </MentorNote>

      <Card>
        <CardHeader>
          <CardTitle>What is on the test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            The PSAT/NMSQT includes Reading and Writing and Math: {OFFICIAL_STRUCTURE.totalQuestions} questions and{" "}
            {OFFICIAL_STRUCTURE.totalMinutes} minutes of testing. Reading and Writing has two{" "}
            {OFFICIAL_STRUCTURE.rwModules.questions}-question, {OFFICIAL_STRUCTURE.rwModules.minutes}-minute modules.
            Math has two {OFFICIAL_STRUCTURE.mathModules.questions}-question, {OFFICIAL_STRUCTURE.mathModules.minutes}
            -minute modules. Official total scale {OFFICIAL_STRUCTURE.scoreScale.total}; sections{" "}
            {OFFICIAL_STRUCTURE.scoreScale.section}.
          </p>
          <p>
            The digital suite uses two-stage adaptation inside each section. The second module depends on first-module
            performance. Anannt mocks freeze a form version and an Anannt routing rule at the start of an attempt. We
            never advertise that rule as College Board’s proprietary threshold.
          </p>
          <p>
            A standard simulation includes a {OFFICIAL_STRUCTURE.breakMinutes}-minute break between sections. You cannot
            return to a submitted module.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {OFFICIAL_STRUCTURE.sources.map((s) => (
              <li key={s.href}>
                <a className="underline underline-offset-2" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The learning journey</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Orient — this page.</li>
            <li>Diagnose — a 24–32 item screening across eight official domains. Not an official score.</li>
            <li>Place — foundation, core, or stretch at skill level. Untested skills stay unknown.</li>
            <li>Plan — dated sessions from your weekly availability, with catch-up held back.</li>
            <li>Learn — an 8–15 minute lesson with checks, not a video to click through.</li>
            <li>Apply — independent questions. Hints mark the attempt assisted.</li>
            <li>Retain — delayed fresh items. Coverage, accuracy, retention, and timed performance stay separate.</li>
            <li>Perform — mixed sets, timed modules, two-stage mocks.</li>
            <li>Reflect — the error notebook and a revised plan.</li>
            <li>Prepare for test day — outbound College Board digital practice and a practical checklist.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What this product will not do</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          It does not deliver the official exam, promise a score or scholarship, offer live classes, or rank students
          publicly. It does not invent a 320–1520 from a percent correct. Official digital practice is an outbound
          task; Anannt never collects College Board credentials.
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            completeOrientation()
            router.push("/diagnostic")
          }}
        >
          Start the domain screening
        </Button>
        <Button variant="outline" render={<Link href="/learn" />}>
          Browse the unit map first
        </Button>
      </div>
    </div>
  )
}
