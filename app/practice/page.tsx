"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MentorNote } from "@/components/mentor-note"
import { BRAND } from "@/lib/brand"
import { UNITS } from "@/lib/curriculum"

const MODES = [
  {
    href: "/practice/run?mode=guided",
    title: "Guided practice",
    body: "Hints on a ladder: concept cue, then representation, then a partial step. Immediate explanations. Hinted work is assisted.",
    hints: true,
    pause: true,
    immediate: true,
  },
  {
    href: "/practice/run?mode=independent-quiz",
    title: "Independent topic quiz",
    body: "Explanations after you submit each item. Choose a unit, or we pick a weak high-relevance skill.",
    hints: false,
    pause: true,
    immediate: true,
  },
  {
    href: "/practice/run?mode=mixed-review",
    title: "Mixed review",
    body: "Fresh items across units so practice does not stay locked to one lesson.",
    hints: false,
    pause: true,
    immediate: true,
  },
  {
    href: "/practice/run?mode=timed-mini",
    title: "Timed mini-set",
    body: "A short mixed set with a countdown and a five-minute warning. Extra time is available from Account if you use a practice accommodation profile — this is not formal College Board approval.",
    hints: false,
    pause: false,
    immediate: false,
  },
  {
    href: "/practice/run?mode=section-module",
    title: "Section module",
    body: "One Reading and Writing or Math rehearsal module. Free movement inside the set; explanations after submission.",
    hints: false,
    pause: false,
    immediate: false,
  },
  {
    href: "/mocks",
    title: "Full two-stage mock",
    body: "RW module 1 → routed module 2 → 10-minute break → Math module 1 → routed module 2. Frozen form version. No return after submit.",
    hints: false,
    pause: false,
    immediate: false,
  },
]

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Practice</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every mode shows whether hints, pauses, and immediate explanations are available. There is no guessing penalty
          in Anannt practice policy. Numeric items use deterministic validation — not a language model. {BRAND.name}{" "}
          marks hinted work as assisted so independent mastery stays honest.
        </p>
      </div>
      <MentorNote>
        Guided practice is for learning the move (slope as rate, a legal sentence join). Independent quizzes are for
        evidence. If a set felt heavy on hints, the next honest step is the same skill with hints off — not a harder
        mock.
      </MentorNote>
      <div className="grid gap-3">
        {MODES.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle>{m.title}</CardTitle>
                <CardDescription>{m.body}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                <Badge variant={m.hints ? "default" : "outline"}>Hints {m.hints ? "on" : "off"}</Badge>
                <Badge variant={m.pause ? "secondary" : "outline"}>Pauses {m.pause ? "allowed" : "off"}</Badge>
                <Badge variant={m.immediate ? "secondary" : "outline"}>
                  Explanations {m.immediate ? "after each item" : "after the set"}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Units on the path: {UNITS.map((u) => u.id).join(", ")}.
      </p>
    </div>
  )
}
