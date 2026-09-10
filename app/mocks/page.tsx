"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MOCK_FORM } from "@/data/mock-form"
import { getItem } from "@/data/catalog"
import {
  createMockAttempt,
  endBreak,
  moduleItems,
  nextAfterSubmit,
  remainingSeconds,
} from "@/lib/mock-engine"
import { isCorrectAnswer } from "@/lib/scoring"
import { useStudent } from "@/lib/storage"
import { ItemDiagram } from "@/components/diagrams"
import type { MockAttempt, MockAttempt as Attempt, MockModuleId } from "@/lib/types"
import { FORM_VERSION, ROUTING_POLICY } from "@/lib/types"
import { MentorNote } from "@/components/mentor-note"
import { mockNextStep } from "@/lib/coach"
import { BRAND } from "@/lib/brand"

export default function MocksPage() {
  const { state, hydrated, saveMock } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading mocks…</p>

  const active = state.mockAttempts.find((m) => m.id === state.activeMockId && m.state !== "submitted")

  if (active) return <MockPlayer attempt={active} onChange={saveMock} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Mock tests</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{MOCK_FORM.note}</p>
      </div>
      <MentorNote>
        This is rehearsal, written by {BRAND.name}: shorter modules so you can practise two-stage routing without a
        134-minute sitting. Treat the clock and the freeze rule as real. The result is raw accuracy and pacing — not a
        converted official score.
      </MentorNote>
      <Alert>
        <AlertTitle>Form {FORM_VERSION}</AlertTitle>
        <AlertDescription>
          Routing policy {ROUTING_POLICY} is frozen when you start. It is an Anannt practice heuristic (about 62.5% on
          module 1 in this rehearsal), not College Board’s operational threshold. Results are raw accuracy, domain
          evidence, and pacing — never a 320–1520 conversion.
        </AlertDescription>
      </Alert>
      <StartCard onStart={(profile) => saveMock(createMockAttempt(profile))} extra={state.accessibility.extraTimePractice} />
      {state.mockAttempts.filter((m) => m.state === "submitted").slice(0, 5).map((m) => (
        <Card key={m.id}>
          <CardHeader>
            <CardTitle className="text-base">Completed {new Date(m.completedAt ?? m.startedAt).toLocaleString()}</CardTitle>
            <CardDescription>
              RW branch {m.rwBranch ?? "—"} · Math branch {m.mathBranch ?? "—"} · {m.formVersion}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

function StartCard({
  onStart,
  extra,
}: {
  onStart: (p: Attempt["timingProfile"]) => void
  extra: boolean
}) {
  const [profile, setProfile] = useState<Attempt["timingProfile"]>(extra ? "extra-time" : "standard")
  const [desktop, setDesktop] = useState(true)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a two-stage rehearsal</CardTitle>
        <CardDescription>
          Full mocks are designed for laptop or desktop. Smaller screens are fine for learning; a realistic mock wants a
          larger display. This is not identical to College Board’s digital practice app and does not confer accommodation approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={profile} onValueChange={(v) => setProfile(v as Attempt["timingProfile"])}>
          <label className="flex gap-2 text-sm">
            <RadioGroupItem value="standard" /> Standard rehearsal timing (shortened modules)
          </label>
          <label className="flex gap-2 text-sm">
            <RadioGroupItem value="extra-time" /> Extra time practice profile (1.5×) — labelled in results
          </label>
          <label className="flex gap-2 text-sm">
            <RadioGroupItem value="untimed-rehearsal" /> Untimed rehearsal (pauses allowed; not realistic exam conditions)
          </label>
        </RadioGroup>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={desktop} onCheckedChange={(v) => setDesktop(Boolean(v))} />
          I am on a laptop or desktop, or I accept that a phone is a limited rehearsal
        </label>
        <Button disabled={!desktop} onClick={() => onStart(profile)}>
          Freeze form and begin Reading and Writing module 1
        </Button>
      </CardContent>
    </Card>
  )
}

function MockPlayer({ attempt, onChange }: { attempt: MockAttempt; onChange: (a: MockAttempt) => void }) {
  const { recordAttempt } = useStudent()
  const [tick, setTick] = useState(Date.now())
  const [idx, setIdx] = useState(0)
  const [confirm, setConfirm] = useState(false)
  const finalizedRef = useRef("")

  useEffect(() => {
    const t = setInterval(() => setTick(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (attempt.state !== "in-progress") return
    if (attempt.timingProfile === "untimed-rehearsal") return
    if (!attempt.currentModule) return
    const remainNow = remainingSeconds(attempt.moduleDeadlineAt, tick)
    if (remainNow > 0) return
    const moduleId = attempt.currentModule
    if (finalizedRef.current === moduleId) return
    finalizedRef.current = moduleId
    const items = moduleItems(attempt, moduleId)
    let correct = 0
    for (const it of items) {
      const raw = attempt.responses[it.id]?.answer ?? ""
      const ok = raw ? isCorrectAnswer(it, raw) : false
      if (ok) correct += 1
      recordAttempt({
        itemId: it.id,
        answer: raw,
        correct: ok,
        hinted: false,
        solutionRevealed: false,
        hintLevel: 0,
        timeMs: 0,
        mode: "full-mock",
        sessionId: attempt.id,
      })
    }
    onChange(nextAfterSubmit(attempt, moduleId, correct, items.length))
    setIdx(0)
    setConfirm(false)
  }, [tick, attempt, onChange, recordAttempt])

  if (attempt.state === "break") {
    const remain = remainingSeconds(attempt.breakEndsAt, tick)
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Section break</h1>
        <p>
          Official PSAT/NMSQT timing includes a 10-minute break between Reading and Writing and Math. This rehearsal
          uses the same rule. Remaining: {Math.floor(remain / 60)}:{String(remain % 60).padStart(2, "0")}
        </p>
        <p className="text-sm text-muted-foreground">
          You cannot return to submitted Reading and Writing modules. Math module 1 starts after the break.
        </p>
        {(remain <= 0 || attempt.timingProfile === "untimed-rehearsal") && (
          <Button onClick={() => onChange(endBreak(attempt))}>Begin Math module 1</Button>
        )}
        {remain > 0 && attempt.timingProfile !== "untimed-rehearsal" && remain < 9 * 60 && (
          <Button variant="outline" onClick={() => onChange(endBreak(attempt))}>
            Continue when ready (rehearsal skip — not official timing)
          </Button>
        )}
      </div>
    )
  }

  if (attempt.state === "submitted") {
    return <MockResults attempt={attempt} />
  }

  const moduleId = attempt.currentModule
  if (!moduleId) return <p>Preparing the next module…</p>
  if (attempt.submittedModules.includes(moduleId)) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Module frozen</AlertTitle>
        <AlertDescription>Submitted modules reject further writes.</AlertDescription>
      </Alert>
    )
  }

  const items = moduleItems(attempt, moduleId)
  const item = items[idx]
  const remain = remainingSeconds(attempt.moduleDeadlineAt, tick)

  function saveAnswer(answer: string) {
    onChange({
      ...attempt,
      lastSavedAt: new Date().toISOString(),
      responses: {
        ...attempt.responses,
        [item.id]: {
          answer,
          marked: attempt.responses[item.id]?.marked ?? false,
          eliminated: attempt.responses[item.id]?.eliminated ?? [],
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  function finalize() {
    const sessionId = attempt.id
    let correct = 0
    for (const it of items) {
      const raw = attempt.responses[it.id]?.answer ?? ""
      const ok = raw ? isCorrectAnswer(it, raw) : false
      if (ok) correct += 1
      recordAttempt({
        itemId: it.id,
        answer: raw,
        correct: ok,
        hinted: false,
        solutionRevealed: false,
        hintLevel: 0,
        timeMs: 0,
        mode: "full-mock",
        sessionId,
      })
    }
    onChange(nextAfterSubmit(attempt, moduleId as MockModuleId, correct, items.length))
    setIdx(0)
    setConfirm(false)
  }

  const current = attempt.responses[item.id]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            {attempt.formVersion} · {moduleId} · {attempt.timingProfile}
          </p>
          <h1 className="text-xl font-semibold">
            {moduleId.startsWith("rw") ? "Reading and Writing" : "Math"} module {moduleId.endsWith("1") ? "1" : "2"}
            {moduleId.endsWith("2") && ` · ${moduleId.startsWith("rw") ? attempt.rwBranch : attempt.mathBranch} branch`}
          </h1>
        </div>
        <p className={remain <= 300 ? "font-medium text-destructive" : "tabular-nums"}>
          {attempt.timingProfile === "untimed-rehearsal"
            ? "Untimed"
            : `${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, "0")}`}
          {remain <= 300 && remain > 0 ? " · five-minute warning" : ""}
        </p>
      </div>
      <Progress value={((idx + 1) / items.length) * 100} />

      <div className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <button
            key={it.id}
            className={`size-8 rounded-md border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${i === idx ? "bg-primary text-primary-foreground" : ""} ${
              attempt.responses[it.id]?.answer ? "ring-1 ring-primary/40" : ""
            } ${attempt.responses[it.id]?.marked ? "outline outline-amber-400" : ""}`}
            aria-label={`Question ${i + 1}${attempt.responses[it.id]?.answer ? ", answered" : ", unanswered"}${attempt.responses[it.id]?.marked ? ", marked for review" : ""}`}
            onClick={() => setIdx(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question {idx + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.stimulus && <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">{item.stimulus}</p>}
          <ItemDiagram kind={item.diagram} />
          <p>{item.stem}</p>
          {item.format === "mcq" ? (
            <RadioGroup
              value={current?.answer ?? ""}
              onValueChange={(v) => saveAnswer(String(v))}
            >
              {item.choices?.map((c) => (
                <label key={c.id} className="flex items-start gap-2 rounded-lg border p-2 text-sm">
                  <RadioGroupItem value={c.id} />
                  <span>
                    {c.id}. {c.text}
                  </span>
                </label>
              ))}
            </RadioGroup>
          ) : (
            <Input
              value={current?.answer ?? ""}
              onChange={(e) => saveAnswer(e.target.value)}
              placeholder={item.numeric?.formatsNote}
            />
          )}
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={current?.marked ?? false}
              onCheckedChange={(v) =>
                onChange({
                  ...attempt,
                  responses: {
                    ...attempt.responses,
                    [item.id]: {
                      answer: current?.answer ?? "",
                      marked: Boolean(v),
                      eliminated: current?.eliminated ?? [],
                      updatedAt: new Date().toISOString(),
                    },
                  },
                })
              }
            />
            Mark for review
          </label>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          Previous
        </Button>
        <Button variant="outline" disabled={idx === items.length - 1} onClick={() => setIdx(idx + 1)}>
          Next
        </Button>
        <Button variant="secondary" onClick={() => setConfirm(true)}>
          Submit module
        </Button>
      </div>
      {confirm && (
        <Alert>
          <AlertTitle>Submit this module?</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>You cannot return after submission. Unanswered items will be scored incorrect.</p>
            <div className="flex gap-2">
              <Button onClick={finalize}>Confirm submit</Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Keep working
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function MockResults({ attempt }: { attempt: Attempt }) {
  const modules: MockModuleId[] = ["rw-1", "rw-2", "math-1", "math-2"]
  const rows = modules.map((mod) => {
    const ids = attempt.moduleItemIds[mod] ?? []
    let c = 0
    for (const id of ids) {
      const item = getItem(id)
      const raw = attempt.responses[id]?.answer ?? ""
      if (item && raw && isCorrectAnswer(item, raw)) c += 1
    }
    return { id: mod, correct: c, total: ids.length }
  })
  const next = mockNextStep(rows)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Rehearsal submitted</h1>
      <Alert>
        <AlertTitle>Evidence, with limits</AlertTitle>
        <AlertDescription>
          Raw accuracy by module, routing branch, and timing profile. No scaled score, no percentile, no scholarship
          implication. One rehearsal is not a readiness label — those consider at least two fresh full mocks after
          calibration work that this slice does not claim.
        </AlertDescription>
      </Alert>
      <MentorNote title={next.title}>
        {next.body}
      </MentorNote>
      {rows.map((row) => (
        <Card key={row.id}>
          <CardHeader>
            <CardTitle className="text-base">{row.id}</CardTitle>
            <CardDescription>
              {row.correct} / {row.total} raw
              {row.id.endsWith("2") && (
                <Badge className="ml-2" variant="secondary">
                  {row.id.startsWith("rw") ? attempt.rwBranch : attempt.mathBranch}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button render={<Link href={next.href} />}>Suggested next lesson</Button>
        <Button variant="outline" render={<Link href="/progress" />}>
          Open progress evidence
        </Button>
      </div>
    </div>
  )
}
