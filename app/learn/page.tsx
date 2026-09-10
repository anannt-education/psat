"use client"

import Link from "next/link"
import { UNITS } from "@/lib/curriculum"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"
import { PUBLIC_LESSONS, waitlistHref } from "@/lib/mount"

export default function LearnPage() {
  const rw = UNITS.filter((u) => u.section === "rw")
  const math = UNITS.filter((u) => u.section === "math")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">PSAT map — two public lessons</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {BRAND.name} opens slope in context and some versus all with no account. Later units stay
          unpublished. This is a SAT feeder, not an AP package.
        </p>
      </div>
      <MentorNote>
        Start with M2 (slope as rate versus start), then RW1 (some versus all). After lesson 2 we
        send you to study.anannt.ae/start.
      </MentorNote>
      <Section title="Reading and Writing" units={rw} />
      <Section title="Math" units={math} />
    </div>
  )
}

function Section({ title, units }: { title: string; units: typeof UNITS }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-medium">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {units.map((u) => {
          const publicLesson = PUBLIC_LESSONS.find((l) => l.unitId === u.id)
          return publicLesson ? (
            <Link key={u.id} href={publicLesson.path}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    {u.id} · {u.title}
                  </CardTitle>
                  <Badge>Public lesson</Badge>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{publicLesson.title}. Open with no account.</p>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card key={u.id} className="h-full">
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <CardTitle className="text-base">
                  {u.id} · {u.title}
                </CardTitle>
                <Badge variant="secondary">Unpublished</Badge>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Not a hidden course. Ask to be told when this lesson is ready.</p>
                <a className="mt-2 inline-block underline" href={waitlistHref(u.id)}>
                  Waitlist this unit
                </a>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
