import { Badge } from "@/components/ui/badge"
import { MASTERY_LABELS } from "@/lib/curriculum"
import type { MasteryState } from "@/lib/types"
import { cn } from "@/lib/utils"

const TONE: Record<MasteryState, string> = {
  unknown: "bg-muted text-muted-foreground",
  learning: "bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100",
  practising: "bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100",
  "provisionally-secure": "bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-100",
  retained: "bg-teal-100 text-teal-950 dark:bg-teal-900/40 dark:text-teal-100",
  "needs-refresh": "bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-100",
}

export function MasteryChip({ state, className }: { state: MasteryState; className?: string }) {
  const meta = MASTERY_LABELS[state]
  return (
    <Badge
      variant="secondary"
      title={meta.hint}
      className={cn("font-medium", TONE[state], className)}
    >
      {meta.title}
    </Badge>
  )
}

export function EvidenceCounts({
  coverage,
  accuracy,
  retention,
  timed,
}: {
  coverage: string
  accuracy: string
  retention: string
  timed: string
}) {
  return (
    <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
      <div className="rounded-lg border bg-card p-3">
        <dt className="text-muted-foreground">Coverage</dt>
        <dd className="mt-1 font-medium">{coverage}</dd>
      </div>
      <div className="rounded-lg border bg-card p-3">
        <dt className="text-muted-foreground">Independent accuracy</dt>
        <dd className="mt-1 font-medium">{accuracy}</dd>
      </div>
      <div className="rounded-lg border bg-card p-3">
        <dt className="text-muted-foreground">Retention</dt>
        <dd className="mt-1 font-medium">{retention}</dd>
      </div>
      <div className="rounded-lg border bg-card p-3">
        <dt className="text-muted-foreground">Timed performance</dt>
        <dd className="mt-1 font-medium">{timed}</dd>
      </div>
    </dl>
  )
}
