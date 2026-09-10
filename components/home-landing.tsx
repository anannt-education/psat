import Link from "next/link"
import { ContinueToPath } from "@/components/continue-to-path"
import { BRAND, METHOD_STEPS, TRUST_POINTS } from "@/lib/brand"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HomeLanding() {
  return (
    <div className="space-y-14">
      <section className="space-y-5">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{BRAND.name}</p>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">
          PSAT as SAT practice — two lessons open, no account.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Slope in context and some-versus-all. This is a SAT feeder, not an AP course. After two
          honest lessons we ask for email and a parent WhatsApp. If you want a human later, that
          path is Digital SAT mentoring — never an AP upsell.
        </p>
        <ContinueToPath />
      </section>

      <section aria-labelledby="search-intent" className="grid gap-4 md:grid-cols-3">
        <h2 id="search-intent" className="sr-only">
          What this path covers
        </h2>
        <IntentCard
          title="PSAT/NMSQT"
          body="October sitting. Official scales are cited as facts, not as a score we can invent from practice."
          href="/learn/M2/M2-L1"
        />
        <IntentCard
          title="PSAT 10"
          body="Shared instructional core with a distinct track. Same two public lessons. SAT habits only."
          href="/learn/RW1/RW1-L1"
        />
        <IntentCard
          title="Digital SAT later"
          body="If you want a human after two lessons, that path is Digital SAT mentoring in Dubai — not an AP package."
          href="https://anannt.ae/sat-coaching-dubai"
        />
      </section>

      <section className="space-y-4" aria-labelledby="how-we-teach">
        <h2 id="how-we-teach" className="font-heading text-2xl font-semibold">
          How Anannt Education teaches
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          The method is the product. You always know the objective, why the skill is tested, and what honest evidence
          would look like next.
        </p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {METHOD_STEPS.map((step, i) => (
            <li key={step.title} className="rounded-lg border bg-card p-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <Link
          href="/method"
          className="inline-block text-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Read the full method
        </Link>
      </section>

      <section className="space-y-4" aria-labelledby="trust">
        <h2 id="trust" className="font-heading text-2xl font-semibold">
          Expertise you can inspect
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TRUST_POINTS.map((t) => (
            <Card key={t.title}>
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">{t.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="pilot-skills">
        <h2 id="pilot-skills" className="font-heading text-2xl font-semibold">
          Complete lessons you can open today
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          The map lists RW0–RW12 and M0–M14 so sequence is visible. Two public lessons are faculty-complete:
          slope in context and some versus all. Other units are unpublished shells or gated — labelled so
          unknown skills stay unknown.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          <SkillLink
            href="/learn/M2/M2-L1"
            id="M2"
            title="Slope in context"
            body="C = 12 + 3d: 12 is the cost at 0 km, 3 is rupees per kilometre. The featured error is swapping rate and start."
          />
          <SkillLink
            href="/learn/RW1/RW1-L1"
            id="RW1"
            title="Some versus all"
            body="Keep some, may, and not studied. Inflating a cautious finding is the attractive wrong answer."
          />
        </ul>
        <Link
          href="/learn"
          className="inline-block text-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open the full curriculum map
        </Link>
      </section>

      <section className="rounded-xl border bg-card p-6" aria-labelledby="families">
        <h2 id="families" className="font-heading text-xl font-semibold">
          For families
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Protect the planned study days. Ask your child to explain one worked example — why 12 is the intercept, or why
          a comma cannot join two complete ideas. Do not treat a practice percent as an official PSAT score.
        </p>
        <Link
          href="/for-families"
          className="mt-3 inline-block text-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Family guidance
        </Link>
      </section>
    </div>
  )
}

function IntentCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </Link>
  )
}

function SkillLink({ href, id, title, body }: { href: string; id: string; title: string; body: string }) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {id} · complete lesson
        </p>
        <h3 className="mt-1 font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </Link>
    </li>
  )
}
