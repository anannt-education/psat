import type { Difficulty, DomainId, Item, Pool, Section } from "@/lib/types"
import { SKILLS } from "@/lib/curriculum"

const LETTERS = ["A", "B", "C", "D"] as const

export function skillIdFor(unitId: string) {
  return SKILLS.find((s) => s.unitId === unitId)?.id ?? `${unitId}-S1`
}

export function sectionFor(domain: DomainId): Section {
  return domain.startsWith("information") ||
    domain.startsWith("craft") ||
    domain.startsWith("expression") ||
    domain.startsWith("standard")
    ? "rw"
    : "math"
}

type McqDraft = {
  id: string
  unitId: string
  domain: DomainId
  pool: Pool
  stem: string
  choices: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  rationales: [string, string, string, string]
  explanation: string
  misconceptionTag: string
  stimulus?: string
  stimulusLabel?: string
  fullReasoning?: string
  difficulty?: Difficulty
  familyId?: string
  alternateMethod?: string
  nextSkillId?: string
  diagram?: Item["diagram"]
  accessibilityText?: string
}

export function mcq(d: McqDraft): Item {
  return {
    id: d.id,
    version: 1,
    familyId: d.familyId ?? d.id,
    section: sectionFor(d.domain),
    domain: d.domain,
    unitId: d.unitId,
    skillId: skillIdFor(d.unitId),
    difficulty: d.difficulty ?? "core",
    pool: d.pool,
    format: "mcq",
    stimulus: d.stimulus,
    stimulusLabel: d.stimulusLabel,
    stem: d.stem,
    choices: d.choices.map((text, i) => ({
      id: LETTERS[i],
      text,
      rationale: d.rationales[i],
    })),
    correctChoiceId: LETTERS[d.correct],
    explanation: d.explanation,
    fullReasoning: d.fullReasoning ?? d.explanation,
    misconceptionTag: d.misconceptionTag,
    alternateMethod: d.alternateMethod,
    nextSkillId: d.nextSkillId,
    diagram: d.diagram,
    accessibilityText: d.accessibilityText,
  }
}

type NumDraft = {
  id: string
  unitId: string
  domain: DomainId
  pool: Pool
  stem: string
  accepted: number[]
  formatsNote: string
  explanation: string
  misconceptionTag: string
  stimulus?: string
  fullReasoning?: string
  difficulty?: Difficulty
  familyId?: string
  tolerance?: number
  alternateMethod?: string
  diagram?: Item["diagram"]
}

export function numeric(d: NumDraft): Item {
  return {
    id: d.id,
    version: 1,
    familyId: d.familyId ?? d.id,
    section: "math",
    domain: d.domain,
    unitId: d.unitId,
    skillId: skillIdFor(d.unitId),
    difficulty: d.difficulty ?? "core",
    pool: d.pool,
    format: "numeric",
    stimulus: d.stimulus,
    stem: d.stem,
    numeric: {
      accepted: d.accepted,
      tolerance: d.tolerance ?? 0,
      formatsNote: d.formatsNote,
    },
    explanation: d.explanation,
    fullReasoning: d.fullReasoning ?? d.explanation,
    misconceptionTag: d.misconceptionTag,
    alternateMethod: d.alternateMethod,
    diagram: d.diagram,
  }
}
