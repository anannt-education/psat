"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QuestionPlayer } from "@/components/question-player"
import { UNITS } from "@/lib/curriculum"
import { itemsByUnit, mixedItems } from "@/data/catalog"
import { useStudent } from "@/lib/storage"
import type { Item, PracticeMode } from "@/lib/types"
import { remainingSeconds } from "@/lib/mock-engine"
import { MentorNote } from "@/components/mentor-note"
import { emptyState, practiceSetCoach } from "@/lib/coach"

function RunnerInner() {
  const params = useSearchParams()
  const mode = (params.get("mode") ?? "guided") as PracticeMode
  const unitParam = params.get("unit")
  const skillParam = params.get("skill")
  const { state } = useStudent()
  const extra = state.accessibility.extraTimePractice ? 1.5 : 1
  const [unitId, setUnitId] = useState(unitParam ?? "M2")
  const [started, setStarted] = useState(Boolean(unitParam) || mode === "mixed-review" || mode === "timed-mini" || mode === "section-module")
  const [idx, setIdx] = useState(0)
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState<{ correct: number; total: number; assisted: number }>({
    correct: 0,
    total: 0,
    assisted: 0,
  })
  const [deadline] = useState(() => Date.now() + (mode === "timed-mini" ? 12 * 60 * extra : 40 * 60 * extra) * 1000)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (mode !== "timed-mini" && mode !== "section-module") return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [mode])
  const sessionId = useMemo(() => `${mode}-${Date.now()}`, [mode])

  const items: Item[] = useMemo(() => {
    const q = state.quarantinedItemIds
    if (mode === "mixed-review" || mode === "timed-mini") return mixedItems(8, q)
    if (mode === "section-module") {
      const section = unitId.startsWith("RW") ? "rw" : "math"
      const pool = mixedItems(10, q).filter((i) => i.section === section)
      return pool.length ? pool : mixedItems(8, q)
    }
    const pools: Item["pool"][] =
      mode === "guided" ? ["lesson-check", "independent", "practice"] : ["independent", "practice", "review"]
    let set = itemsByUnit(unitId, pools).filter((i) => !q.includes(i.id))
    if (skillParam) set = set.filter((i) => i.skillId === skillParam)
    if (set.length < 4) set = itemsByUnit(unitId).filter((i) => !q.includes(i.id) && i.pool !== "mock" && i.pool !== "diagnostic")
    return set.slice(0, mode === "guided" ? 6 : 8)
  }, [mode, unitId, skillParam, state.quarantinedItemIds])

  const hints = mode === "guided"
  const immediate = mode !== "timed-mini" && mode !== "section-module"
  const timed = mode === "timed-mini" || mode === "section-module"
  const remain = timed ? remainingSeconds(new Date(deadline).toISOString(), now) : null
  useEffect(() => {
    if (timed && remain === 0 && !finished) setFinished(true)
  }, [timed, remain, finished])

  if (!started) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Choose a unit</h1>
        <MentorNote>
          Pick a complete lesson unit if you can — M2 (rate versus start) or RW8 (sentence boundaries) — so the bank has
          original checks. Shells still work; they are thinner by design.
        </MentorNote>
        <Select value={unitId} onValueChange={(v) => setUnitId(String(v ?? "M2"))}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.id} · {u.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setStarted(true)}>Start {mode.replace("-", " ")}</Button>
      </div>
    )
  }

  if (items.length === 0) {
    const empty = emptyState("practice-bank")
    return (
      <Alert>
        <AlertTitle>{empty.title}</AlertTitle>
        <AlertDescription>{empty.body}</AlertDescription>
      </Alert>
    )
  }

  if (finished) {
    const coach = practiceSetCoach(mode, results)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Raw accuracy {results.correct} / {results.total}. Assisted attempts {results.assisted}. Hinted work does not
            satisfy independent mastery.
          </p>
          <MentorNote title={coach.title}>{coach.body}</MentorNote>
          <p className="text-sm text-muted-foreground">This is not an official PSAT score.</p>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={coach.href} />}>{coach.cta}</Button>
            <Button variant="outline" render={<Link href="/mistakes" />}>
              Review mistakes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const item = items[Math.min(idx, items.length - 1)]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold capitalize">{mode.replaceAll("-", " ")}</h1>
        {timed && remain !== null && (
          <p className={remain <= 300 ? "font-medium text-destructive" : "text-sm"}>
            {Math.floor(remain / 60)}:{String(remain % 60).padStart(2, "0")}
            {remain <= 300 && remain > 0 ? " · five-minute warning" : ""}
          </p>
        )}
      </div>
      {timed && (
        <Button variant="ghost" size="sm" onClick={() => setNow(Date.now())}>
          Refresh timer
        </Button>
      )}
      <QuestionPlayer
        key={item.id}
        item={item}
        mode={mode}
        sessionId={sessionId}
        index={idx}
        total={items.length}
        hintsAllowed={hints}
        immediateFeedback={immediate}
        onSubmitted={({ correct, assisted }) => {
          setResults((r) => ({
            correct: r.correct + (correct ? 1 : 0),
            total: r.total + 1,
            assisted: r.assisted + (assisted ? 1 : 0),
          }))
          if (idx + 1 < items.length) setIdx(idx + 1)
          else setFinished(true)
        }}
      />
    </div>
  )
}

export default function PracticeRunPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading practice…</p>}>
      <RunnerInner />
    </Suspense>
  )
}
