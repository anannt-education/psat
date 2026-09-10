"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DEMO_COHORT } from "@/lib/demo-cohort"
import { useStudent } from "@/lib/storage"
import { UNITS } from "@/lib/curriculum"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"

export default function MentorPage() {
  const { state, hydrated } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading mentor queue…</p>

  const liveName = state.profile?.displayName ?? "Local student"
  const inactiveDays = state.attempts[0]
    ? (Date.now() - new Date(state.attempts[0].timestamp).getTime()) / 86400000
    : 99
  const unresolved = state.mistakes.filter((m) => !m.resolved)
  const bySkill: Record<string, number> = {}
  for (const m of unresolved) bySkill[m.skillId] = (bySkill[m.skillId] ?? 0) + 1
  const worst = Object.entries(bySkill).sort((a, b) => b[1] - a[1])[0]
  const unit = worst ? UNITS.find((u) => `${u.id}-S1` === worst[0]) : undefined

  const liveWhy = []
  if (worst && worst[1] >= 3) liveWhy.push(`Three or more open errors on ${unit?.title ?? worst[0]}.`)
  if (inactiveDays >= 7) {
    liveWhy.push(
      `A week of inactivity on this device (${Math.floor(inactiveDays)} days). A short check-in beats a new unit: ten minutes on the last skill, then stop.`
    )
  }
  if (!liveWhy.length) liveWhy.push("No automatic trigger yet — still visible as the assigned local learner.")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Mentor exception queue</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This first slice has no login. Use Account → Mentor to open the queue. You see the learner on this device plus
          a labelled demo cohort. Reasons are inspectable. Overrides cannot silently change assessment answers.
        </p>
      </div>
      <MentorNote title={`${BRAND.mentor} · how to check in`}>
        Lead with the reason you can inspect: three misses on sentence boundaries, a quiet week, or a timed-versus-untimed
        gap. Suggest the smallest next step — a ten-minute lesson or a fresh analogous item — not a full restart.
      </MentorNote>
      <Alert>
        <AlertTitle>Assigned learners only (prototype)</AlertTitle>
        <AlertDescription>
          A production mentor view would restrict the list by assignment. Here the demo cohort is fictional students
          used to show triggers: three unsuccessful attempts, prerequisite failure, inactivity, timed/untimed gaps.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{liveName} · this device</CardTitle>
          <CardDescription>{state.profile?.track ?? "no track yet"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{liveWhy.join(" ")}</p>
          {unit && (
            <Button size="sm" render={<Link href={`/learn/${unit.id}/${unit.lessonIds[0]}`} />}>
              Assign suggested lesson {unit.id}
            </Button>
          )}
        </CardContent>
      </Card>

      {DEMO_COHORT.map((s) => (
        <Card key={s.id}>
          <CardHeader>
            <CardTitle className="text-base">
              {s.name} · {s.track} · grade {s.grade}
            </CardTitle>
            <CardDescription>
              {s.trigger} · last active {s.lastActive}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{s.why}</p>
            <p className="text-muted-foreground">Suggested: {s.suggestedLesson}</p>
            <Button size="sm" variant="outline" render={<Link href={s.href} />}>
              Open suggested work
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
