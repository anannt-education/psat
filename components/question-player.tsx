"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ItemDiagram } from "@/components/diagrams"
import { correctAnswerLabel, hintText, isCorrectAnswer } from "@/lib/scoring"
import { useStudent } from "@/lib/storage"
import type { Item, PracticeMode } from "@/lib/types"
import { MentorNote } from "@/components/mentor-note"
import { attemptCoach, emptyState } from "@/lib/coach"
import { Lightbulb, Eye, Flag } from "lucide-react"

type Props = {
  item: Item
  mode: PracticeMode
  sessionId: string
  index?: number
  total?: number
  hintsAllowed?: boolean
  immediateFeedback?: boolean
  onSubmitted?: (result: { correct: boolean; assisted: boolean; answer: string }) => void
  disabled?: boolean
  compact?: boolean
}

export function QuestionPlayer({
  item,
  mode,
  sessionId,
  index,
  total,
  hintsAllowed = false,
  immediateFeedback = true,
  onSubmitted,
  disabled,
  compact,
}: Props) {
  const { recordAttempt, track, state, quarantine } = useStudent()
  const [answer, setAnswer] = useState("")
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0)
  const [revealed, setRevealed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [eliminated, setEliminated] = useState<string[]>([])
  const [started] = useState(() => Date.now())
  const quarantined = state.quarantinedItemIds.includes(item.id)

  useEffect(() => {
    setAnswer("")
    setHintLevel(0)
    setRevealed(false)
    setSubmitted(false)
    setCorrect(null)
    setEliminated([])
  }, [item.id])

  const assisted = hintLevel > 0 || revealed

  function submit() {
    if (!answer.trim()) return
    const ok = isCorrectAnswer(item, answer.trim())
    setCorrect(ok)
    setSubmitted(true)
    recordAttempt({
      itemId: item.id,
      answer: answer.trim(),
      correct: ok,
      hinted: hintLevel > 0,
      solutionRevealed: revealed,
      hintLevel,
      timeMs: Date.now() - started,
      mode,
      sessionId,
    })
    onSubmitted?.({ correct: ok, assisted, answer: answer.trim() })
  }

  const showExplanation = submitted && (immediateFeedback || revealed)
  const coach =
    submitted && correct !== null ? attemptCoach(item, { correct, assisted, revealed }) : null

  const choices = useMemo(() => item.choices ?? [], [item])

  if (quarantined) {
    const empty = emptyState("quarantine")
    return (
      <Alert>
        <AlertTitle>{empty.title}</AlertTitle>
        <AlertDescription>{empty.body}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={compact ? "shadow-none" : undefined}>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">
            {typeof index === "number" && typeof total === "number"
              ? `Question ${index + 1} of ${total}`
              : "Question"}
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {assisted && <Badge variant="outline">Assisted</Badge>}
            {item.format === "numeric" && <Badge variant="secondary">Numeric</Badge>}
            <Badge variant="outline">{item.domain.replaceAll("-", " ")}</Badge>
          </div>
        </div>
        {item.stimulus && (
          <div className="rounded-lg bg-muted/60 p-3 text-sm leading-relaxed">
            {item.stimulusLabel && (
              <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {item.stimulusLabel}
              </p>
            )}
            <p className="whitespace-pre-wrap">{item.stimulus}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemDiagram kind={item.diagram} />
        <p className="text-[15px] leading-relaxed">{item.stem}</p>
        {item.format === "numeric" && item.numeric && (
          <p className="text-xs text-muted-foreground">{item.numeric.formatsNote}</p>
        )}

        {item.format === "mcq" ? (
          <RadioGroup
            value={answer}
            onValueChange={(v) => !submitted && !disabled && setAnswer(String(v))}
            disabled={submitted || disabled}
            className="gap-2"
          >
            {choices.map((c) => {
              const gone = eliminated.includes(c.id)
              return (
                <div
                  key={c.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${gone ? "opacity-40" : ""} ${
                    showExplanation && c.id === item.correctChoiceId ? "border-emerald-600/40 bg-emerald-50 dark:bg-emerald-950/30" : ""
                  } ${showExplanation && answer === c.id && c.id !== item.correctChoiceId ? "border-rose-600/40 bg-rose-50 dark:bg-rose-950/20" : ""}`}
                >
                  <RadioGroupItem value={c.id} id={`${item.id}-${c.id}`} className="mt-0.5" />
                  <Label htmlFor={`${item.id}-${c.id}`} className="flex-1 cursor-pointer leading-relaxed font-normal">
                    <span className="mr-2 font-medium">{c.id}.</span>
                    {c.text}
                  </Label>
                  {!submitted && hintsAllowed && (
                    <button
                      type="button"
                      className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                      onClick={() =>
                        setEliminated((e) => (e.includes(c.id) ? e.filter((x) => x !== c.id) : [...e, c.id]))
                      }
                    >
                      {gone ? "Undo" : "Cross out"}
                    </button>
                  )}
                </div>
              )
            })}
          </RadioGroup>
        ) : (
          <div className="max-w-sm space-y-1">
            <Label htmlFor={`num-${item.id}`}>Your answer</Label>
            <Input
              id={`num-${item.id}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted || disabled}
              inputMode="decimal"
              placeholder="Number or fraction"
            />
          </div>
        )}

        {hintLevel > 0 && hintsAllowed && (
          <MentorNote
            title={
              hintLevel === 1 ? "Hint 1 · concept" : hintLevel === 2 ? "Hint 2 · representation" : "Hint 3 · a partial step"
            }
          >
            {hintText(item, hintLevel === 0 ? 1 : hintLevel)} Using a hint marks this attempt assisted. That is still useful
            teaching; it cannot satisfy independent mastery.
          </MentorNote>
        )}

        <div className="flex flex-wrap gap-2">
          {!submitted && (
            <Button onClick={submit} disabled={!answer.trim() || disabled}>
              Submit
            </Button>
          )}
          {hintsAllowed && !submitted && hintLevel < 3 && (
            <Button
              variant="outline"
              onClick={() => {
                setHintLevel((h) => (h + 1) as 1 | 2 | 3)
                track("hint_requested", { itemId: item.id, level: hintLevel + 1 })
              }}
            >
              <Lightbulb /> {hintLevel === 0 ? "Hint" : "Next hint"}
            </Button>
          )}
          {hintsAllowed && !revealed && (
            <Button
              variant="ghost"
              onClick={() => {
                setRevealed(true)
                if (!submitted) {
                  setSubmitted(true)
                  const ok = answer.trim() ? isCorrectAnswer(item, answer.trim()) : false
                  setCorrect(ok)
                  recordAttempt({
                    itemId: item.id,
                    answer: answer.trim() || "(revealed)",
                    correct: ok,
                    hinted: true,
                    solutionRevealed: true,
                    hintLevel: hintLevel || 3,
                    timeMs: Date.now() - started,
                    mode,
                    sessionId,
                  })
                  onSubmitted?.({ correct: ok, assisted: true, answer: answer.trim() })
                }
              }}
            >
              <Eye /> Reveal solution
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => quarantine(item.id)}>
            <Flag /> Flag item
          </Button>
        </div>

        {submitted && immediateFeedback && coach && (
          <MentorNote title={coach.title}>
            <p>{coach.body}</p>
            {!correct && (
              <p className="mt-2">
                Accepted answer: {correctAnswerLabel(item)}.
              </p>
            )}
          </MentorNote>
        )}

        {showExplanation && (
          <div className="space-y-3 rounded-lg border bg-muted/40 p-3 text-sm leading-relaxed">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Anannt Education · why this item exists
            </p>
            <p>
              <span className="font-medium">What this was testing. </span>
              {item.explanation}
            </p>
            <p>
              <span className="font-medium">Full reasoning. </span>
              {item.fullReasoning}
            </p>
            {item.format === "mcq" && item.choices && (
              <ul className="space-y-1">
                {item.choices.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">{c.id}.</span> {c.rationale}
                  </li>
                ))}
              </ul>
            )}
            {item.alternateMethod && (
              <p>
                <span className="font-medium">Another method. </span>
                {item.alternateMethod}
              </p>
            )}
            <p className="text-muted-foreground">
              Misconception tag (suggestion, not a diagnosis): {item.misconceptionTag}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
