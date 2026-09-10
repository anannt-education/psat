import type { AttemptRecord, MasteryRecord, MasteryState } from "./types"
import { SKILLS } from "./curriculum"

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function emptyMastery(skillId: string): MasteryRecord {
  return {
    skillId,
    state: "unknown",
    coverage: false,
    independentCorrect: 0,
    independentTotal: 0,
    firstAttemptUnhintedCorrect: 0,
    firstAttemptUnhintedTotal: 0,
    sessionIds: [],
    familiesSeen: [],
    retentionCorrect: 0,
    retentionTotal: 0,
    timedCorrect: 0,
    timedTotal: 0,
    misconceptionCounts: {},
  }
}

export function ensureMasteryMap(
  map: Record<string, MasteryRecord>
): Record<string, MasteryRecord> {
  const next = { ...map }
  for (const skill of SKILLS) {
    if (!next[skill.id]) next[skill.id] = emptyMastery(skill.id)
  }
  return next
}

function independent(attempt: AttemptRecord) {
  return (
    !attempt.hinted &&
    !attempt.solutionRevealed &&
    ["independent-quiz", "mixed-review", "timed-mini", "section-module", "full-mock", "diagnostic", "lesson-independent", "mistake-retest"].includes(
      attempt.mode
    )
  )
}

export function applyAttempt(
  record: MasteryRecord,
  attempt: AttemptRecord,
  now = Date.now()
): MasteryRecord {
  const next: MasteryRecord = {
    ...record,
    misconceptionCounts: { ...record.misconceptionCounts },
    sessionIds: [...record.sessionIds],
    familiesSeen: [...record.familiesSeen],
  }

  if (attempt.mode === "lesson-check" || attempt.mode === "guided") {
    next.coverage = true
    if (next.state === "unknown") next.state = "learning"
  }

  if (independent(attempt)) {
    next.independentTotal += 1
    if (attempt.correct) next.independentCorrect += 1
    next.lastAttemptAt = attempt.timestamp
    if (!next.sessionIds.includes(attempt.sessionId)) next.sessionIds.push(attempt.sessionId)
    if (!next.familiesSeen.includes(attempt.familyId)) next.familiesSeen.push(attempt.familyId)
    next.firstAttemptUnhintedTotal += 1
    if (attempt.correct) next.firstAttemptUnhintedCorrect += 1
    if (next.state === "unknown" || next.state === "learning") next.state = "practising"
  }

  if (attempt.mode === "timed-mini" || attempt.mode === "section-module" || attempt.mode === "full-mock") {
    next.timedTotal += 1
    if (attempt.correct) next.timedCorrect += 1
  }

  if (!attempt.correct) {
    const tag = attempt.skillId
    next.misconceptionCounts[tag] = (next.misconceptionCounts[tag] ?? 0) + 1
  }

  return recomputeState(next, now)
}

export function recomputeState(record: MasteryRecord, now = Date.now()): MasteryRecord {
  const next = { ...record }
  const acc =
    next.firstAttemptUnhintedTotal === 0
      ? 0
      : next.firstAttemptUnhintedCorrect / next.firstAttemptUnhintedTotal
  const enoughIndependent =
    next.firstAttemptUnhintedTotal >= 10 &&
    next.sessionIds.length >= 2 &&
    next.familiesSeen.length >= 2 &&
    acc >= 0.8

  if (enoughIndependent && next.state !== "retained" && next.state !== "needs-refresh") {
    next.state = "provisionally-secure"
    next.provisionallySecureAt = next.provisionallySecureAt ?? next.lastAttemptAt
  }

  if (next.provisionallySecureAt && next.lastAttemptAt) {
    const gap =
      new Date(next.lastAttemptAt).getTime() - new Date(next.provisionallySecureAt).getTime()
    if (gap >= SEVEN_DAYS_MS && next.retentionTotal >= 5) {
      if (next.retentionCorrect / next.retentionTotal >= 0.8) {
        next.state = "retained"
        next.retainedAt = next.lastAttemptAt
      } else {
        next.state = "needs-refresh"
      }
    }
  }

  if (next.state === "provisionally-secure" || next.state === "retained") {
    const recentWrong = next.independentTotal >= 6 && next.independentCorrect / next.independentTotal < 0.5
    if (recentWrong) next.state = "needs-refresh"
  }

  if (next.coverage && next.state === "unknown") next.state = "learning"
  return next
}

export function timedReadiness(record: MasteryRecord): "unknown" | "building" | "observed" {
  if (record.timedTotal < 4) return "unknown"
  const acc = record.timedCorrect / record.timedTotal
  if (acc >= 0.75 && record.timedTotal >= 8) return "observed"
  return "building"
}

export function coverageRate(map: Record<string, MasteryRecord>) {
  const skills = Object.values(map)
  if (skills.length === 0) return 0
  return skills.filter((s) => s.coverage).length / skills.length
}

export function accuracyRate(map: Record<string, MasteryRecord>) {
  const totals = Object.values(map).reduce(
    (acc, s) => {
      acc.c += s.independentCorrect
      acc.t += s.independentTotal
      return acc
    },
    { c: 0, t: 0 }
  )
  return { correct: totals.c, total: totals.t }
}

export function retentionRate(map: Record<string, MasteryRecord>) {
  const totals = Object.values(map).reduce(
    (acc, s) => {
      acc.c += s.retentionCorrect
      acc.t += s.retentionTotal
      return acc
    },
    { c: 0, t: 0 }
  )
  return { correct: totals.c, total: totals.t }
}

export function timedRate(map: Record<string, MasteryRecord>) {
  const totals = Object.values(map).reduce(
    (acc, s) => {
      acc.c += s.timedCorrect
      acc.t += s.timedTotal
      return acc
    },
    { c: 0, t: 0 }
  )
  return { correct: totals.c, total: totals.t }
}

export const STATE_ORDER: MasteryState[] = [
  "unknown",
  "learning",
  "practising",
  "provisionally-secure",
  "retained",
  "needs-refresh",
]
