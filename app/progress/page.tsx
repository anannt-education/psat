"use client"

import { EvidenceCounts, MasteryChip } from "@/components/mastery-chip"
import { UNITS } from "@/lib/curriculum"
import { accuracyRate, coverageRate, ensureMasteryMap, retentionRate, timedRate, timedReadiness } from "@/lib/mastery"
import { useStudent } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MentorNote } from "@/components/mentor-note"

export default function ProgressPage() {
  const { state, hydrated } = useStudent()
  if (!hydrated) return <p className="text-muted-foreground">Loading evidence…</p>
  const mastery = ensureMasteryMap(state.mastery)
  const cov = coverageRate(mastery)
  const acc = accuracyRate(mastery)
  const ret = retentionRate(mastery)
  const timed = timedRate(mastery)
  const mocks = state.mockAttempts.filter((m) => m.state === "submitted")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Progress</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Coverage, independent accuracy, retention, and timed performance are stored separately. They are not collapsed
          into one opaque percentage. Heuristics below are transparent MVP rules, not psychometric claims. A 4/5 result
          is not high statistical certainty — counts and recency are shown.
        </p>
      </div>
      <MentorNote>
        Read the four numbers as four questions: did instruction start, can you do it unhinted, does it survive a week,
        and does it survive a clock? A high independent mark with thin timed evidence is a pacing hole, not a content
        celebration.
      </MentorNote>
      <EvidenceCounts
        coverage={`${Math.round(cov * 100)}% of skills have instruction started (${Object.values(mastery).filter((m) => m.coverage).length} of ${Object.keys(mastery).length})`}
        accuracy={acc.total ? `${acc.correct} / ${acc.total} independent` : "No independent attempts yet"}
        retention={ret.total ? `${ret.correct} / ${ret.total} delayed checks` : "No delayed checks yet (need seven days after provisional mastery)"}
        timed={timed.total ? `${timed.correct} / ${timed.total} on timed mixed work` : "No timed evidence yet"}
      />
      <Card>
        <CardHeader>
          <CardTitle>Mock participation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {mocks.length} submitted rehearsal{mocks.length === 1 ? "" : "s"}. Readiness labels that describe observed
          preparation would require at least two fresh full-length mocks, stable timing, and tool familiarity. This
          slice reports participation only.
        </CardContent>
      </Card>
      <div className="grid gap-2">
        {UNITS.map((u) => {
          const rec = mastery[`${u.id}-S1`]
          if (!rec) return null
          const timedLabel = timedReadiness(rec)
          return (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
              <div>
                <p className="font-medium">
                  {u.id} {u.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Independent {rec.independentCorrect}/{rec.independentTotal} · families {rec.familiesSeen.length} ·
                  sessions {rec.sessionIds.length} · timed {timedLabel}
                  {rec.lastAttemptAt ? ` · last ${new Date(rec.lastAttemptAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              <MasteryChip state={rec.state} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
