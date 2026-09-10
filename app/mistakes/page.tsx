"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { QuestionPlayer } from "@/components/question-player"
import { unusedFresh, getItem } from "@/data/catalog"
import { useStudent } from "@/lib/storage"
import { unitById } from "@/lib/curriculum"
import type { ErrorCategory } from "@/lib/types"
import { MentorNote } from "@/components/mentor-note"
import { emptyState } from "@/lib/coach"

const CATS: { id: ErrorCategory; label: string; hint: string }[] = [
  { id: "knowledge", label: "Knowledge", hint: "I did not have the idea or the fact." },
  { id: "interpretation", label: "Interpretation", hint: "I misread the text, graph, or question." },
  { id: "method", label: "Method", hint: "I chose the wrong approach." },
  { id: "calculation", label: "Calculation", hint: "The method was right; the arithmetic was not." },
  { id: "timing", label: "Timing", hint: "I knew it untimed but ran out of time or rushed." },
]

export default function MistakesPage() {
  const { state, hydrated, tagMistake, resolveMistake } = useStudent()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [retestId, setRetestId] = useState<string | null>(null)
  const sessionId = useMemo(() => `retest-${Date.now()}`, [])

  if (!hydrated) return <p className="text-muted-foreground">Loading the error notebook…</p>

  const open = state.mistakes.filter((m) => !m.resolved)
  const closed = state.mistakes.filter((m) => m.resolved).slice(0, 8)
  const active = state.mistakes.find((m) => m.id === activeId)
  const seenFamilies = new Set(state.attempts.map((a) => a.familyId))
  const seenIds = new Set(state.attempts.map((a) => a.itemId))

  const retestItem = active
    ? unusedFresh(active.unitId, seenFamilies, seenIds, ["independent", "practice", "review"], state.quarantinedItemIds)[0] ??
      getItem(active.itemId)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Review mistakes</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Wrong answers, correct guesses, and optionally slow correct answers. Automated tags are suggestions, not
          diagnoses. A resolved mistake requires success on a fresh analogous item — the original error remains listed.
        </p>
      </div>

      <MentorNote>
        Classify the miss before you retry: did you lack the idea, misread the graph, pick the wrong method, drop
        arithmetic, or run out of time? A second try on the same stem is not evidence. Wait for the fresh item.
      </MentorNote>

      {open.length === 0 && (
        <Alert>
          <AlertTitle>{emptyState("mistakes").title}</AlertTitle>
          <AlertDescription>{emptyState("mistakes").body}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3">
        {open.map((m) => {
          const item = getItem(m.itemId)
          const unit = unitById(m.unitId)
          return (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {unit?.id} · {unit?.title}
                </CardTitle>
                <CardDescription>
                  {m.slowCorrect ? "Slow correct" : "Incorrect"} · {new Date(m.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="line-clamp-3">{item?.stem}</p>
                <p>
                  You answered {m.studentAnswer || "(blank)"}. Accepted: {m.correctAnswer}.
                </p>
                <p className="text-muted-foreground">
                  Suggested category: {m.autoSuggestion}.{" "}
                  {item && (
                    <Link className="underline" href={`/learn/${m.unitId}/${unit?.lessonIds[0]}`}>
                      Practise this skill next
                    </Link>
                  )}
                </p>
                <p className="font-medium">What went wrong? Tag it yourself:</p>
                <RadioGroup
                  value={m.category ?? ""}
                  onValueChange={(v) => tagMistake(m.id, v as ErrorCategory)}
                >
                  {CATS.map((c) => (
                    <label key={c.id} className="flex items-start gap-2">
                      <RadioGroupItem value={c.id} />
                      <span>
                        {c.label} — {c.hint}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                <Button
                  onClick={() => {
                    setActiveId(m.id)
                    setRetestId(retestItem && retestItem.id !== m.itemId ? retestItem.id : null)
                  }}
                >
                  Retest on a fresh item
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {active && retestItem && activeId === active.id && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Fresh retest</h2>
          {retestItem.id === active.itemId && (
            <Alert>
              <AlertTitle>Limited bank</AlertTitle>
              <AlertDescription>
                No unused analogue is left in this unit. Repeating the original item will not count as independent
                mastery of a new family.
              </AlertDescription>
            </Alert>
          )}
          <QuestionPlayer
            item={retestItem}
            mode="mistake-retest"
            sessionId={sessionId}
            hintsAllowed={false}
            onSubmitted={({ correct }) => {
              if (correct) resolveMistake(active.id, retestItem.id)
              setActiveId(null)
            }}
          />
        </div>
      )}

      {closed.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-medium">Resolved (originals kept)</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {closed.map((m) => (
              <li key={m.id}>
                {m.unitId} · tagged {m.category ?? m.autoSuggestion} · retest {m.retestItemId}
              </li>
            ))}
          </ul>
        </div>
      )}
      {retestId ? null : null}
    </div>
  )
}
