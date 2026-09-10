"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useStudent } from "@/lib/storage"
import { missedDayMessage, todayTasks, weeklyCapacityNote } from "@/lib/planner"
import { useJourneyGate } from "@/hooks/use-journey-gate"
import { MentorNote } from "@/components/mentor-note"
import { inactivityCoach, emptyState } from "@/lib/coach"
import { BRAND } from "@/lib/brand"

export default function TodayPage() {
  const { hydrated, state } = useJourneyGate()
  const { completeTask, rebuildPlan } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading today’s plan…</p>
  if (!state.profile) return null

  const tasks = todayTasks(state.plan, state.completedTaskIds).slice(0, 5)
  const missed = missedDayMessage(state.plan, state.completedTaskIds)
  const next = tasks[0]
  const lastAttempt = state.attempts[0]
  const daysQuiet = lastAttempt
    ? (Date.now() - new Date(lastAttempt.timestamp).getTime()) / 86400000
    : state.diagnostic
      ? 3.5
      : 0
  const checkIn = inactivityCoach(daysQuiet, state.profile.displayName)
  const emptyPlan = emptyState("plan")

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          {state.profile.track === "psat-nmsqt" ? "PSAT/NMSQT" : "PSAT 10"} · {state.profile.timezone} · {BRAND.name}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Today, {state.profile.displayName}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {weeklyCapacityNote(state.profile)} A 40-minute session can mix retrieval, instruction, independent practice,
          and error correction — actual mix follows need.
        </p>
      </div>

      {checkIn && (
        <MentorNote title={checkIn.title}>{checkIn.body}</MentorNote>
      )}

      {missed && (
        <Alert>
          <AlertTitle>A missed day was rescheduled</AlertTitle>
          <AlertDescription>{missed}</AlertDescription>
        </Alert>
      )}

      {next ? (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Next task · {next.durationMin} min</CardTitle>
            <CardDescription>{next.date}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-medium">{next.title}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Why this: </span>
              {next.reason}
            </p>
            <MentorNote>
              One named task is enough. If you finish early, review a tagged miss rather than adding an unmarked extra
              set.
            </MentorNote>
            <div className="flex flex-wrap gap-2">
              <Button render={<Link href={next.href} />}>Open</Button>
              <Button variant="outline" onClick={() => completeTask(next.id)}>
                Mark done
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertTitle>{emptyPlan.title}</AlertTitle>
          <AlertDescription>{emptyPlan.body}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Coming sessions</h2>
        {tasks.slice(1).map((t) => (
          <Card key={t.id} size="sm">
            <CardHeader>
              <CardTitle className="text-base">{t.title}</CardTitle>
              <CardDescription>
                {t.date} · {t.durationMin} min
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t.reason}</CardContent>
          </Card>
        ))}
      </div>

      <Button variant="ghost" onClick={() => rebuildPlan()}>
        Rebuild plan from current evidence
      </Button>
    </div>
  )
}
