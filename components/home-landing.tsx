import Link from "next/link"
import { ContinueToPath } from "@/components/continue-to-path"
import { BRAND, METHOD_STEPS, TRUST_POINTS } from "@/lib/brand"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PUBLIC_LESSONS, SAT_MENTORING_URL, gateHref } from "@/lib/mount"

export function HomeLanding() {
  return (
    <div className="space-y-14">
      <section className="space-y-5">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Self-prep studio · SAT feeder · PSAT/NMSQT
        </p>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">
          A short path into Digital SAT habits — not an AP package.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {BRAND.tagline} Open slope in context, then some versus all. No account to begin. If you want a person later, that
          person is Digital SAT mentoring — never an AP upsell.
        </p>
        <ContinueToPath />
      </section>

      <section aria-labelledby="public-lessons" className="grid gap-4 md:grid-cols-2">
        <h2 id="public-lessons" className="sr-only">
          Two lessons
        </h2>
        {PUBLIC_LESSONS.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={lesson.path}
            className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Lesson {i + 1} · {lesson.id}
            </p>
            <h3 className="mt-1 font-medium">{lesson.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {i === 0
                ? "C = 12 + 3d: 12 is the start, 3 is the rate. Do not swap them."
                : "Keep some, may, and not studied. Inflating a cautious finding is the trap."}
            </p>
          </Link>
        ))}
      </section>

      <section aria-labelledby="sat-cta" className="rounded-xl border bg-card p-6">
        <h2 id="sat-cta" className="font-heading text-xl font-semibold">
          If you want a person later
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This path feeds Digital SAT work. We do not send PSAT students to AP packages.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a className="underline underline-offset-4" href={SAT_MENTORING_URL}>
            Digital SAT mentoring
          </a>
          <a className="underline underline-offset-4" href={gateHref("")}>
            Continue on study.anannt.ae/start
          </a>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="how-we-teach">
        <h2 id="how-we-teach" className="font-heading text-2xl font-semibold">
          How Anannt Education teaches
        </h2>
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
    </div>
  )
}
