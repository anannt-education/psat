"use client"

import Link from "next/link"
import { UNITS } from "@/lib/curriculum"
import { useStudent } from "@/lib/storage"
import { MasteryChip } from "@/components/mastery-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { emptyMastery, ensureMasteryMap } from "@/lib/mastery"
import { MentorNote } from "@/components/mentor-note"
import { gateUrl, PUBLIC_LESSONS } from "@/lib/mount"

export default function LearnPage() {
  const { state, hydrated } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading the unit path…</p>
  const mastery = ensureMasteryMap(state.mastery)
  const rw = UNITS.filter((u) => u.section === "rw")
  const math = UNITS.filter((u) => u.section === "math")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Two public lessons</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Slope in context and some versus all are open without an account. This SAT feeder does not
          sell AP. Other units wait behind the study gate.
        </p>
      </div>
      <MentorNote>
        Start with M2 (slope as rate versus start), then RW1 (some versus all). After lesson 2 we
        send you to the study gate for Digital SAT mentoring if you want a person.
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
          const publicUnit = PUBLIC_LESSONS.some((p) => p.unitId === u.id)
          const href = publicUnit
            ? `/learn/${u.id}/${u.lessonIds[0]}`
            : gateUrl(u.id)
          return (
            <Link key={u.id} href={href}>
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
                    {publicUnit ? <Badge>Public lesson</Badge> : <Badge variant="secondary">After two lessons</Badge>}
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
