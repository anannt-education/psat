import type { Difficulty, DomainId, Item, Section } from "@/lib/types"

/** Legacy diagnostic bank shape (short domain keys, numeric difficulty). */
export type LegacyDiagnosticItem = {
  id: string
  domain: string
  skill: string
  difficulty: number
  stem: string
  choices: { id: string; text: string }[]
  correct: string
  explanation: string
  passage: string | null
  passageTitle: string | null
  calculator: boolean
  gridIn: boolean
  source: string
}

const DOMAIN_MAP: Record<string, DomainId> = {
  craft: "craft-structure",
  info: "information-ideas",
  conventions: "standard-english-conventions",
  expression: "expression-of-ideas",
  algebra: "algebra",
  advanced: "advanced-math",
  "problem-solving": "problem-solving-data-analysis",
  geometry: "geometry-trigonometry",
}

const UNIT_FOR_DOMAIN: Record<DomainId, string> = {
  "information-ideas": "RW1",
  "craft-structure": "RW5",
  "expression-of-ideas": "RW10",
  "standard-english-conventions": "RW8",
  algebra: "M2",
  "advanced-math": "M4",
  "problem-solving-data-analysis": "M7",
  "geometry-trigonometry": "M12",
}

function mapDifficulty(n: number): Difficulty {
  if (n <= 1) return "foundation"
  if (n === 2) return "core"
  return "stretch"
}

function sectionFor(domain: DomainId): Section {
  return domain === "algebra" ||
    domain === "advanced-math" ||
    domain === "problem-solving-data-analysis" ||
    domain === "geometry-trigonometry"
    ? "math"
    : "rw"
}

export function normalizeLegacyDiagnostic(raw: LegacyDiagnosticItem): Item {
  const domain = DOMAIN_MAP[raw.domain] ?? "information-ideas"
  return {
    id: raw.id,
    version: 1,
    familyId: raw.id,
    section: sectionFor(domain),
    domain,
    unitId: UNIT_FOR_DOMAIN[domain],
    skillId: raw.skill,
    difficulty: mapDifficulty(raw.difficulty),
    pool: "diagnostic",
    format: raw.gridIn ? "numeric" : "mcq",
    stimulus: raw.passage ?? undefined,
    stimulusLabel: raw.passageTitle ?? undefined,
    stem: raw.stem,
    choices: raw.choices.map((c) => ({ id: c.id, text: c.text, rationale: "" })),
    correctChoiceId: raw.correct,
    explanation: raw.explanation,
    fullReasoning: raw.explanation,
    misconceptionTag: raw.skill,
  }
}
