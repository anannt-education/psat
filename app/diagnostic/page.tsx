"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuestionPlayer } from "@/components/question-player"
import { MentorNote } from "@/components/mentor-note"
import { DIAGNOSTIC_ITEMS } from "@/data/items-diagnostic"
import { useStudent } from "@/lib/storage"
import { studyStartUrl } from "@/lib/gate"

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
    if (typeof window !== "undefined") {
      window.location.assign(studyStartUrl("diagnostic"))
    }
    return (
      <p className="text-muted-foreground">Opening the study desk…</p>
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
        <Button size="lg" onClick={() => setIntro(false)}>
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
            window.location.assign(studyStartUrl("diagnostic"))
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
