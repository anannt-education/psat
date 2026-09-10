import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/json-ld"
import { MentorNote } from "@/components/mentor-note"
import { BRAND, METHOD_STEPS } from "@/lib/brand"
import { organizationJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "How Anannt Education teaches PSAT",
  description:
    "Anannt Education’s method for PSAT/NMSQT and PSAT 10: orient, diagnose, place, plan, learn, apply, retain, perform. No score guarantees and no College Board affiliation.",
  path: "/method",
})

export default function MethodPage() {
  return (
    <article className="space-y-8">
      <JsonLd data={organizationJsonLd()} />
      <header className="space-y-3">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{BRAND.name}</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">How we teach the PSAT suite</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Anannt Education authors this path. The exam is PSAT/NMSQT or PSAT 10 — College Board assessments we prepare
          students to sit, not products we deliver. We do not convert practice into official scores, and we do not
          advertise a partnership we do not have.
        </p>
      </header>

      <MentorNote>
        A skilled tutor does three things on every skill: name the objective, show the attractive error, and ask for an
        independent try. That is the lesson template — from slope in C = 12 + 3d to sentence boundaries — not a video to
        click through.
      </MentorNote>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">The ten-step journey</h2>
        <ol className="list-decimal space-y-3 pl-5">
          {METHOD_STEPS.map((s) => (
            <li key={s.title} className="leading-relaxed">
              <span className="font-medium">{s.title}. </span>
              {s.body}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">What “complete” versus “shell” means</h2>
        <p className="leading-relaxed text-muted-foreground">
          The map shows RW0–RW12 and M0–M14 so sequence is visible. Complete lessons (among them M2 slope in context,
          RW8 sentence boundaries, RW1 some versus all) carry original worked examples, checks, and independent items.
          Walkable shells still have an objective, two mini-examples, and checks — they are not blank — but they are
          labelled so a unit you have not really been taught is not marked mastered.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">Evidence we will not collapse</h2>
        <p className="leading-relaxed text-muted-foreground">
          Coverage (did instruction start?), independent accuracy (unhinted), retention (delayed fresh items), and timed
          performance stay separate. A hinted correct answer is useful teaching and cannot satisfy mastery. Mocks report
          raw module accuracy and an Anannt routing branch — never a 320–1520.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button render={<Link href="/onboard" />}>Set up a path</Button>
        <Button variant="outline" render={<Link href="/learn" />}>
          See the curriculum map
        </Button>
      </div>
    </article>
  )
}
