import { DOMAINS, UNITS } from "@/lib/curriculum"
import type { DiagnosticResult, DomainId, Item, PracticeMode } from "@/lib/types"
import { BRAND } from "@/lib/brand"

export const MENTOR_LABEL = BRAND.mentor

const DOMAIN_START: Record<DomainId, { unitId: string; skill: string }> = {
  "information-ideas": { unitId: "RW1", skill: "central meaning and some-versus-all" },
  "craft-structure": { unitId: "RW5", skill: "words in context" },
  "expression-of-ideas": { unitId: "RW10", skill: "revision that matches purpose" },
  "standard-english-conventions": { unitId: "RW8", skill: "sentence boundaries" },
  algebra: { unitId: "M2", skill: "slope as rate versus starting value" },
  "advanced-math": { unitId: "M4", skill: "nonlinear expressions" },
  "problem-solving-data-analysis": { unitId: "M7", skill: "rates, units, and percents" },
  "geometry-trigonometry": { unitId: "M12", skill: "spatial measurement" },
}

export function diagnosticNextStep(result: DiagnosticResult) {
  const ranked = (Object.keys(DOMAINS) as DomainId[])
    .map((id) => {
      const ev = result.domainEvidence[id]
      const rate = ev.total ? ev.correct / ev.total : 1
      return { id, ev, rate }
    })
    .filter((d) => d.ev.total > 0)
    .sort((a, b) => a.rate - b.rate)

  const weakest = ranked[0]
  if (!weakest) {
    return {
      title: "Start on the map",
      body: "This screening did not yield a domain to prioritise. Open Learn and begin with a complete lesson — RW1 (scope) or M2 (slope in context) — so the method is visible before shells.",
      href: "/learn",
      cta: "Open the curriculum map",
    }
  }

  const start = DOMAIN_START[weakest.id]
  const unit = UNITS.find((u) => u.id === start.unitId)
  const title = DOMAINS[weakest.id].title
  return {
    title: `Next: ${unit?.id ?? start.unitId} \u00b7 ${start.skill}`,
    body: `${title} was the thinner sample (${weakest.ev.correct} of ${weakest.ev.total} in this probe). That is a starting place, not a label. Anannt’s first complete lesson in that neighbourhood is ${start.skill}. Untested micro-skills stay unknown.`,
    href: `/learn/${start.unitId}/${start.unitId}-L1`,
    cta: `Open ${start.unitId}`,
  }
}

export function attemptCoach(
  item: Item,
  result: { correct: boolean; assisted: boolean; revealed: boolean }
): { title: string; body: string } {
  const tag = item.misconceptionTag
  const skillBit = skillSpecificNote(item)

  if (result.revealed && !result.correct) {
    return {
      title: "Solution in view — still useful",
      body: `Revealing the working is a study move, not a mastery mark. ${skillBit} On the next analogous item, try the first step unhinted.`,
    }
  }

  if (result.correct && result.assisted) {
    return {
      title: "Correct, with a mentor in the room",
      body: `The answer is right, and a hint or reveal was used, so this cannot satisfy independent mastery. ${skillBit} A fresh unhinted item is the next honest check.`,
    }
  }

  if (result.correct) {
    return {
      title: "Independent — that is the evidence we keep",
      body: `You finished without a hint. ${skillBit} One clean item is not the whole skill; mixed review later will ask for the same move in a new story.`,
    }
  }

  if (tag.includes("slope-intercept")) {
    return {
      title: "Rate and start swapped",
      body: "In C = 12 + 3d, 12 is the cost when distance is 0 km; 3 is rupees per extra kilometre. Say those two sentences before you compute. The accepted answer is listed below — use it to check which role you assigned to each number.",
    }
  }
  if (tag.includes("scope") || tag.includes("some-to-all")) {
    return {
      title: "Scope drifted",
      body: "Circle some, may, most, and not studied, then reread the option you picked. Attractive wrong answers usually drop a limit the author earned. The accepted answer keeps the author’s caution.",
    }
  }
  if (tag.includes("comma-splice") || tag.includes("fused") || item.unitId === "RW8") {
    return {
      title: "Two complete ideas, one weak join",
      body: "Find subjects and finite verbs. If both clauses can stand alone, use a period, a semicolon, or a comma plus and/but — never a comma alone. Name the error type, then look at the accepted join.",
    }
  }
  if (tag.includes("order-of-operations")) {
    return {
      title: "The operations were defined in a different order",
      body: "Multiply and divide before you add, unless grouping symbols say otherwise. Rewrite the expression with the multiplication boxed, then compare with the accepted value.",
    }
  }
  if (tag.includes("rate-flip")) {
    return {
      title: "The rate was inverted or the base moved",
      body: "Write the rate with units in both parts. Kilometres per hour puts distance on top. Percent change divides by the original amount, not the new one.",
    }
  }

  return {
    title: "Not this time — the miss is material",
    body: `The accepted answer is below, with why this item was testing the skill. ${skillBit} Tag the miss in Review mistakes if the same move keeps appearing.`,
  }
}

function skillSpecificNote(item: Item): string {
  if (item.unitId === "M2") {
    return "Name starting value and rate in words before you touch the algebra."
  }
  if (item.unitId === "RW1") {
    return "Keep the author’s limits; completeness the passage did not earn is still wrong."
  }
  if (item.unitId === "RW8") {
    return "Legal joins, not speech pauses, decide sentence boundaries."
  }
  if (item.unitId === "M0") {
    return "Preserve the quantity: equivalent forms, not a new calculation."
  }
  if (item.section === "rw") {
    return "Say what the tested sentence is doing before you compare options."
  }
  return "Name the quantity the question is actually asking for, with units."
}

export function practiceSetCoach(mode: PracticeMode, results: { correct: number; total: number; assisted: number }) {
  const independentHits = Math.max(0, results.correct - results.assisted)
  if (results.total === 0) {
    return {
      title: "No items were scored",
      body: "Open a unit with a complete lesson (M2 or RW8) so the bank has original checks to work with.",
      href: "/learn",
      cta: "Open Learn",
    }
  }
  if (results.assisted >= Math.ceil(results.total / 2)) {
    return {
      title: "Hints did a lot of the lifting",
      body: `Raw ${results.correct} of ${results.total}, with ${results.assisted} assisted. That is useful teaching, not independent mastery. Repeat the same skill with hints off, or walk the misconception step in the lesson again.`,
      href: "/learn",
      cta: "Return to the lesson map",
    }
  }
  if (independentHits >= 3) {
    return {
      title: "Independent work showed up",
      body: `${independentHits} unhinted correct in a set of ${results.total}. Next: a mixed review so the skill is not glued to one story, or Review mistakes for any miss you want to classify.`,
      href: "/mistakes",
      cta: "Open the error notebook",
    }
  }
  if (mode === "timed-mini" || mode === "section-module") {
    return {
      title: "Timed evidence, not a verdict",
      body: `Raw ${results.correct} of ${results.total} under a clock. If untimed work on the same skills is cleaner, the hole is pacing — mark unfinished items and practise a shorter mini-set before another module.`,
      href: "/practice/run?mode=timed-mini",
      cta: "Sit another timed mini-set",
    }
  }
  return {
    title: "Keep the process, change the story",
    body: `Raw ${results.correct} of ${results.total}. Open Review mistakes for anything you missed, then try a fresh item from the same unit rather than replaying the identical stem.`,
    href: "/mistakes",
    cta: "Review mistakes",
  }
}

export function mockNextStep(modules: { id: string; correct: number; total: number }[]) {
  const thin = [...modules].filter((m) => m.total).sort((a, b) => a.correct / a.total - b.correct / b.total)[0]
  if (!thin) {
    return {
      title: "Rehearsal on file",
      body: "Open Progress to see this sitting as participation, not as a scaled score. A later rehearsal should use the same frozen-form discipline.",
      href: "/progress",
    }
  }
  const rw = thin.id.startsWith("rw")
  return {
    title: rw ? "Reading and Writing wanted more legal, scoped reading" : "Math wanted cleaner rates and linear models",
    body: `${thin.id} was the thinner module (${thin.correct} of ${thin.total} raw). ${
      rw
        ? "A short RW8 sentence-boundary lesson or RW1 scope review is more useful than another full mock this week."
        : "Check M2 (rate versus start) or M7 (units in the rate) before sitting another timed form."
    } This is rehearsal evidence, not a 320–1520.`,
    href: rw ? "/learn/RW8/RW8-L1" : "/learn/M2/M2-L1",
  }
}

export function inactivityCoach(daysSince: number, displayName: string) {
  if (daysSince < 3) return null
  if (daysSince >= 7) {
    return {
      title: `${MENTOR_LABEL} \u00b7 a quiet week`,
      body: `${displayName}, a week without a session is common around exams and travel. Do not stack two plans. Open Today, do the shortest lesson or a ten-minute independent set, then stop. Returning is the skill.`,
    }
  }
  return {
    title: `${MENTOR_LABEL} \u00b7 pick up the thread`,
    body: `A few days away does not undo prior evidence. Start with the queued task, not a new diagnostic. If the last miss was slope or sentence boundaries, reread the takeaway before the first item.`,
  }
}

export function emptyState(kind: "mistakes" | "plan" | "practice-bank" | "quarantine" | "lesson-missing") {
  switch (kind) {
    case "mistakes":
      return {
        title: "Nothing to review yet — that is expected",
        body: "Work a lesson check, the diagnostic, or a practice set. Misses land here with a suggested category (knowledge, interpretation, method, calculation, timing). Tagging a miss is part of the method, not a mark against you.",
      }
    case "plan":
      return {
        title: "No dated task is queued",
        body: "Finish orientation and the domain screening so Today can name a reason, or open Learn and choose a complete lesson (M2 slope, RW8 sentence boundaries) yourself.",
      }
    case "practice-bank":
      return {
        title: "The bank is thin for this filter",
        body: "Anannt will not manufacture mastery from repeats. Open another unit, or review a tagged miss on a fresh family.",
      }
    case "quarantine":
      return {
        title: "This item is flagged",
        body: "It will not be assigned again. Existing attempts keep their snapshot. Choose the next item in the set, or tell a mentor if the wording itself is the problem.",
      }
    default:
      return {
        title: "That lesson is not on the published path",
        body: "Return to Learn. RW0–RW12 and M0–M14 are the visible sequence; shells are labelled so gaps stay honest.",
      }
  }
}
