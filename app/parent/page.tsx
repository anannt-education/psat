"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStudent } from "@/lib/storage"
import { accuracyRate, coverageRate, ensureMasteryMap, retentionRate } from "@/lib/mastery"
import { SKILLS } from "@/lib/curriculum"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"

export default function ParentPage() {
  const { state, hydrated } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading family summary…</p>
  const mastery = ensureMasteryMap(state.mastery)
  const cov = coverageRate(mastery)
  const acc = accuracyRate(mastery)
  const ret = retentionRate(mastery)
  const retained = SKILLS.filter((s) => mastery[s.id]?.state === "retained" || mastery[s.id]?.state === "provisionally-secure")
  const sessions = new Set(state.attempts.map((a) => a.sessionId)).size

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Family summary</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Completed sessions, recently secured skills, remaining coverage, and assessment participation. This is not a
          stream of failure alerts and not a tutor transcript. Effort and learning evidence are listed separately. In
          production, a verified relationship would be required; this slice shows the learner on this device.
        </p>
      </div>
      <MentorNote title={`${BRAND.mentor} · how to help tonight`}>
        Protect the planned study days rather than adding surprise extra hours after a missed day. Ask your child to
        explain one worked example out loud — why 12 is the intercept in C = 12 + 3d, or why a comma cannot join two
        complete ideas. Do not treat a practice percent as an official PSAT score.
      </MentorNote>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Effort</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{sessions} distinct practice sessions on this device.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning evidence</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            Independent {acc.total ? `${acc.correct}/${acc.total}` : "none yet"}. Coverage {Math.round(cov * 100)}%.
            Retention checks {ret.total ? `${ret.correct}/${ret.total}` : "none yet"}.
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recently secured or provisionally secure</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {retained.length === 0
            ? "None yet — that is expected early on. Coverage grows when a lesson is started, not when a percent looks high."
            : retained.map((s) => s.title).join(", ")}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>One or two helpful actions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          If a week goes quiet, a ten-minute return on sentence boundaries or slope is enough. Official Bluebook practice
          is outbound — Anannt never asks for College Board credentials.
        </CardContent>
      </Card>
    </div>
  )
}
