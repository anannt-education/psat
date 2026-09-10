"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { QuestionPlayer } from "@/components/question-player"
import { ItemDiagram } from "@/components/diagrams"
import { lessonById } from "@/data/lessons"
import { getItem } from "@/data/catalog"
import { unitById } from "@/lib/curriculum"
import { useStudent } from "@/lib/storage"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"
import { emptyState } from "@/lib/coach"
import { trackEvent } from "@/lib/events"
import { continueOrStart } from "@/lib/gate-client"
import { PUBLIC_LESSON_2 } from "@/lib/mount"

const STEPS = [
  "Objective",
  "Relevance",
  "Explanation",
  "Example 1",
  "Example 2",
  "Check 1",
  "Check 2",
  "Misconception",
  "Independent practice",
  "Takeaway",
]

export default function LessonPage({
  params,
}: {
  params: Promise<{ unitId: string; lessonId: string }>
}) {
  const { unitId, lessonId } = use(params)
  const lesson = lessonById(lessonId)
  const unit = unitById(unitId)
  const { state, saveLessonProgress, completeTask } = useStudent()
  const saved = state.lessonProgress[lessonId]
  const [step, setStep] = useState(saved?.step ?? 0)
  const [indIdx, setIndIdx] = useState(0)
  const [showCompare, setShowCompare] = useState(false)
  const sessionId = useMemo(() => `lesson-${lessonId}`, [lessonId])

  if (!lesson || !unit || lesson.unitId !== unitId) {
    const missing = emptyState("lesson-missing")
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{missing.title}</h1>
        <p className="mt-2 text-muted-foreground">{missing.body}</p>
        <Link href="/learn" className="mt-4 inline-block underline">
          Back to Learn
        </Link>
      </div>
    )
  }

  const independent = lesson.independentItemIds.map((id) => getItem(id)).filter(Boolean)
  const checks = lesson.checkItemIds.map((id) => getItem(id)).filter(Boolean)
  const totalSteps = STEPS.length
  const pct = Math.round(((step + 1) / totalSteps) * 100)

  function go(next: number) {
    const n = Math.max(0, Math.min(totalSteps - 1, next))
    setStep(n)
    saveLessonProgress(lessonId, n, n === totalSteps - 1)
    if (n === totalSteps - 1) {
      completeTask(`task-lesson-${unitId}`)
      if (lessonId === PUBLIC_LESSON_2.id) {
        trackEvent("lesson2_complete", { sku: lessonId })
        continueOrStart(PUBLIC_LESSON_2.unit)
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/learn", label: "Curriculum" },
            { label: `${unit.id} · ${lesson.title}` },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          {BRAND.name} · {unit.id} · {lesson.durationMin} min
          {lesson.complete ? " · complete lesson" : " · walkable shell"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{lesson.title}</h1>
      </div>
      <Progress value={pct} />
      <p className="text-sm text-muted-foreground">
        {STEPS[step]} · {step + 1} / {totalSteps}
      </p>

      {step === 0 && (
        <div className="space-y-3">
          <Block title="Objective" body={lesson.objective} />
          {lesson.mentorNote && <MentorNote>{lesson.mentorNote}</MentorNote>}
        </div>
      )}
      {step === 1 && (
        <div className="space-y-3">
          <Block title="Why this matters on the PSAT suite" body={lesson.relevance} />
          <MentorNote title="Why Anannt Education teaches this first">
            {unit.section === "math"
              ? "Test items change the story — delivery cost, a water tank, a taxi — while keeping the same structure. Name the roles (rate versus start, units in the rate), then compute."
              : "Test items change the passage — trees, sleep, ferries — while keeping the same trap. Name the claim and the author’s limits before you compare options."}
          </MentorNote>
        </div>
      )}
      {step === 2 && <Block title="Short explanation" body={lesson.explanation} />}
      {step === 3 && (
        <ExampleBlock example={lesson.examples[0]} />
      )}
      {step === 4 && <ExampleBlock example={lesson.examples[1]} />}
      {step === 5 && checks[0] && (
        <QuestionPlayer
          item={checks[0]}
          mode="lesson-check"
          sessionId={sessionId}
          hintsAllowed
          index={0}
          total={2}
          onSubmitted={({ correct }) => {
            const check = checks[0]
            if (!correct && lesson.comparisonActivity && check && check.misconceptionTag === lesson.comparisonActivity.triggerTag) {
              setShowCompare(true)
            }
          }
        />
      )}
      {step === 6 && checks[1] && (
        <QuestionPlayer
          item={checks[1]}
          mode="lesson-check"
          sessionId={sessionId}
          hintsAllowed
          index={1}
          total={2}
          onSubmitted={({ correct }) => {
            const check = checks[1]
            if (!correct && lesson.comparisonActivity && check && check.misconceptionTag === lesson.comparisonActivity.triggerTag) {
              setShowCompare(true)
            }
          }
        />
      )}
      {showCompare && lesson.comparisonActivity && (step === 5 || step === 6) && (
        <Alert>
          <AlertTitle>{lesson.comparisonActivity.title}</AlertTitle>
          <AlertDescription>{lesson.comparisonActivity.body}</AlertDescription>
        </Alert>
      )}
      {step === 7 && (
        <Block title={lesson.misconception.title} body={lesson.misconception.body} />
      )}
      {step === 8 && independent[indIdx] && (
        <div className="space-y-3">
          <MentorNote>
            Independent questions. Hints are allowed, and using one is a legitimate study move — it just cannot satisfy
            independent mastery. Try the first step unhinted; a second try after a miss is part of the method.
          </MentorNote>
          <QuestionPlayer
            key={independent[indIdx]!.id}
            item={independent[indIdx]!}
            mode="lesson-independent"
            sessionId={sessionId}
            hintsAllowed
            index={indIdx}
            total={independent.length}
            onSubmitted={() => {
              if (indIdx + 1 < independent.length) setIndIdx(indIdx + 1)
            }
          />
        </div>
      )}
      {step === 9 && (
        <div className="space-y-3">
          <Block title="Takeaway" body={lesson.takeaway} />
          {lesson.mentorNote && <MentorNote title="Expert takeaway">{lesson.mentorNote}</MentorNote>}
          {lesson.reviewNote && <p className="text-sm text-muted-foreground">{lesson.reviewNote}</p>}
          <Button render={<Link href={`/practice/run?mode=independent-quiz&unit=${unitId}`} />}>
            Independent practice on this unit
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => go(step - 1)} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => go(step + 1)} disabled={step === totalSteps - 1}>
          Continue
        </Button>
      </div>
    </div>
  )
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-[15px] leading-relaxed">{body}</CardContent>
    </Card>
  )
}

function ExampleBlock({ example }: { example: { title: string; body: string; kind: string; diagram?: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {example.kind === "contrast" ? "Contrasting example: " : "Example: "}
          {example.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-[15px] leading-relaxed">
        <ItemDiagram kind={example.diagram} />
        <p>{example.body}</p>
      </CardContent>
    </Card>
  )
}
