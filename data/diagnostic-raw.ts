import type { Difficulty, DomainId, Item, Section } from "@/lib/types"

/** Loose shape used by the diagnostic bank before it is mapped onto `Item`. */
export type DiagnosticRawItem = {
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

const MATH_DOMAINS: ReadonlySet<DomainId> = new Set([
  "algebra",
  "advanced-math",
  "problem-solving-data-analysis",
  "geometry-trigonometry",
])

function asDifficulty(n: number): Difficulty {
  if (n <= 1) return "foundation"
  if (n >= 3) return "stretch"
  return "core"
}

export function normalizeDiagnosticItem(raw: DiagnosticRawItem): Item {
  const domain = DOMAIN_MAP[raw.domain]
  if (!domain) {
    throw new Error(`Unknown diagnostic domain: ${raw.domain}`)
  }
  const section: Section = MATH_DOMAINS.has(domain) ? "math" : "rw"
  const format = raw.gridIn || raw.choices.length === 0 ? "numeric" : "mcq"
  const numericAccepted = format === "numeric" ? Number(raw.correct) : Number.NaN
  return {
    id: raw.id,
    version: 1,
    familyId: raw.id,
    section,
    domain,
    unitId: "diagnostic",
    skillId: raw.skill,
    difficulty: asDifficulty(raw.difficulty),
    pool: "diagnostic",
    format,
    stimulus: raw.passage ?? undefined,
    stimulusLabel: raw.passageTitle ?? undefined,
    stem: raw.stem,
    choices:
      format === "mcq"
        ? raw.choices.map((c) => ({
            id: c.id,
            text: c.text,
            rationale: c.id === raw.correct ? raw.explanation : "This option does not match the stem.",
          }))
        : undefined,
    correctChoiceId: format === "mcq" ? raw.correct : undefined,
    numeric:
      format === "numeric"
        ? {
            accepted: Number.isFinite(numericAccepted) ? [numericAccepted] : [],
            formatsNote: "Enter a number.",
          }
        : undefined,
    explanation: raw.explanation,
    fullReasoning: raw.explanation,
    misconceptionTag: "",
  }
}
