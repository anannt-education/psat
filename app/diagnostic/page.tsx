"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionPlayer } from "@/components/question-player"
import { MentorNote } from "@/components/mentor-note"
import { DIAGNOSTIC_ITEMS } from "@/data/items-diagnostic"
import { DOMAINS } from "@/lib/curriculum"
import { diagnosticNextStep } from "@/lib/coach"
import { BRAND } from "@/lib/brand"
import { useStudent } from "@/lib/storage"
import type { DomainId } from "@/lib/types"
import { trackEvent } from "@/lib/events"
import { continueOrStart } from "@/lib/gate-client"

export default function DiagnosticPage() {
  const { completeDiagnostic, state, hydrated } = useStudent()
  const items = DIAGNOSTIC_ITEMS
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(Boolean(state.diagnostic))
  const [intro, setIntro] = useState(!state.diagnostic)
  const [awaitingNext, setAwaitingNext] = useState(false)
  const sessionId = useMemo(() => `diag-${state.profile?.displayName ?? "anon"}`, [state.profile])

  if (!hydrated) return <p className="text-muted-foreground">Preparing your domain screening…</p>

  if (done && state.diagnostic) {
    const d = state.diagnostic
    const next = diagnosticNextStep(d)
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">{BRAND.name} · 28-item probe</p>
          <h1 className="text-3xl font-semibold">Screening results — with uncertainty</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            This probe is not sufficient to estimate an official score or to assign every micro-skill. Bands below are
            Anannt placement hints from a small sample. Untested skills remain unknown.
          </p>
        </div>
        <Alert>
          <AlertTitle>No official score is shown</AlertTitle>
          <AlertDescription>
            Anannt Education does not convert raw percent correct into 320–1520 or invent a percentile. Official scales
            are cited in Help. Your answers stay on this device.
          </AlertDescription>
        </Alert>
        <MentorNote title={next.title}>
          <p>{next.body}</p>
        </MentorNote>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(DOMAINS) as DomainId[]).map((id) => {
            const ev = d.domainEvidence[id]
            const place = d.placement[id]
            return (
              <Card key={id}>
                <CardHeader>
                  <CardTitle className="text-base">{DOMAINS[id].title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    {ev.correct} of {ev.total} in this screening
                  </p>
                  <p className="mt-1 font-medium capitalize">{ev.band.replace("-", " ")}</p>
                  <p className="text-muted-foreground">
                    Initial placement: {place}. n = {ev.total} is small.
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={next.href} />}>{next.cta}</Button>
          <Button variant="outline" render={<Link href="/today" />}>
            See today’s plan
          </Button>
        </div>
      </div>
    )
  }

  if (intro) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Domain screening · 28 items · about 30–35 minutes</p>
          <h1 className="text-3xl font-semibold tracking-tight">Find where to start — not what you are</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Eight official domains, a handful of items each. Work at a calm pace. A miss tells Anannt Education where to
            teach first; it is not a verdict on the whole exam.
          </p>
        </div>
        <MentorNote>
          There are no hints on this sitting so the sample stays independent. You will still see why an item was testing
          a skill after you submit. We will not turn this percent into a 320–1520.
        </MentorNote>
        <Button size="lg" onClick={() => {
          trackEvent("diagnostic_start")
          setIntro(false)
        }}>
          Begin the screening
        </Button>
      </div>
    )
  }

  const item = items[idx]
  const pct = Math.round((idx / items.length) * 100)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Domain screening · 28 items · about 30–35 minutes</p>
        <h1 className="text-2xl font-semibold">Find where to start — not what you are</h1>
      </div>
      <Progress value={pct} />
      {!awaitingNext && (
        <MentorNote>
          Item {idx + 1} of {items.length}. Name the skill before you pick: claim, boundary, rate, or unit. Then choose.
        </MentorNote>
      )}
      <QuestionPlayer
        key={item.id}
        item={item}
        mode="diagnostic"
        sessionId={sessionId}
        index={idx}
        total={items.length}
        hintsAllowed={false}
        immediateFeedback
        onSubmitted={({ answer }) => {
          const next = { ...answers, [item.id]: answer }
          setAnswers(next)
          if (idx + 1 < items.length) setAwaitingNext(true)
          else {
            completeDiagnostic(next, items.map((i) => i.id))
            if (continueOrStart("diagnostic")) return
            setDone(true)
          }
        }}
      />
      {awaitingNext && (
        <Button
          onClick={() => {
            setAwaitingNext(false)
            setIdx((i) => i + 1)
          }}
        >
          Next item
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        Independent diagnostic attempts still record learning evidence. They cannot become an official PSAT score.
      </p>
    </div>
  )
}
