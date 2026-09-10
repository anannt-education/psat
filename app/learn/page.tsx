"use client"

import Link from "next/link"
import { UNITS } from "@/lib/curriculum"
import { useStudent } from "@/lib/storage"
import { MasteryChip } from "@/components/mastery-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { emptyMastery, ensureMasteryMap } from "@/lib/mastery"
import { MentorNote } from "@/components/mentor-note"
import { LESSONS } from "@/data/lessons"
import { isPublicLesson, studyStartUrl, waitlistUrl } from "@/lib/gate"

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
          Two public lessons are open: M2 slope in context and RW1 some versus all. Other complete
          lessons sit behind the study gate. Walkable shells are unpublished — ask to be told when
          they are ready. This path does not sell AP.
        </p>
      </div>
      <MentorNote>
        If you are new, start with M2 (slope as rate versus start) or RW1 (some versus all). Later
        lessons wait behind the gate. Shells are unpublished, not a hidden full course.
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
          const publicLesson = lesson && isPublicLesson(lesson.id)
          const href = publicLesson
            ? `/learn/${u.id}/${u.lessonIds[0]}`
            : lesson?.complete
              ? studyStartUrl(u.id)
              : waitlistUrl(u.id)
          const CardInner = (
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
                    {publicLesson ? (
                      <Badge>Public lesson</Badge>
                    ) : lesson?.complete ? (
                      <Badge>After two lessons</Badge>
                    ) : (
                      <Badge variant="secondary">Unpublished</Badge>
                    )}
                    {u.prerequisites.length > 0 && (
                      <Badge variant="outline">After {u.prerequisites.join(", ")}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
          )
          return publicLesson ? (
            <Link key={u.id} href={href}>
              {CardInner}
            </Link>
          ) : (
            <a key={u.id} href={href} className="block">
              {CardInner}
            </a>
          )
        })}
      </div>
    </section>
  )
}
