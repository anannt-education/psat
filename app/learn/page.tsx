"use client"

import Link from "next/link"
import { UNITS } from "@/lib/curriculum"
import { useStudent } from "@/lib/storage"
import { MasteryChip } from "@/components/mastery-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { emptyMastery, ensureMasteryMap } from "@/lib/mastery"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"
import { LESSONS } from "@/data/lessons"

export default function LearnPage() {
  const { state, hydrated } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading the unit path…</p>
  const mastery = ensureMasteryMap(state.mastery)
  const rw = UNITS.filter((u) => u.section === "rw")
  const math = UNITS.filter((u) => u.section === "math")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Curriculum map</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {BRAND.name} sequences Reading and Writing RW0–RW12 and Math M0–M14. You may open any lesson. Complete lessons
          carry the full method (objective through takeaway). Walkable shells are labelled so untested skills stay
          unknown — not dressed up as mastered.
        </p>
      </div>
      <MentorNote>
        If you are new to the path, start with a complete lesson: RW1 (some versus all), RW8 (sentence boundaries), or M2
        (slope as rate versus start). Challenge checks can skip a recommendation; a failed check yields a short repair,
        not a full-course restart.
      </MentorNote>
      <Section title="Reading and Writing" units={rw} mastery={mastery} />
      <Section title="Math" units={math} mastery={mastery} />
    </div>
  )
}

function Section({
  title,
  units,
  mastery,
}: {
  title: string
  units: typeof UNITS
  mastery: ReturnType<typeof ensureMasteryMap>
}) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-medium">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {units.map((u) => {
          const rec = mastery[`${u.id}-S1`] ?? emptyMastery(`${u.id}-S1`)
          const lesson = LESSONS.find((l) => l.unitId === u.id)
          return (
            <Link key={u.id} href={`/learn/${u.id}/${u.lessonIds[0]}`}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    {u.id} · {u.title}
                  </CardTitle>
                  <MasteryChip state={rec.state} />
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{u.coverage}</p>
                  <div className="flex flex-wrap gap-1">
                    {lesson?.complete ? <Badge>Complete lesson</Badge> : <Badge variant="secondary">Walkable shell</Badge>}
                    {u.prerequisites.length > 0 && (
                      <Badge variant="outline">After {u.prerequisites.join(", ")}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
