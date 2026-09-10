import type { Item } from "./types"

function parseNumeric(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, "").replace(/%/g, "")
  if (!cleaned) return null
  if (cleaned.includes("/")) {
    const parts = cleaned.split("/")
    if (parts.length !== 2) return null
    const a = Number(parts[0])
    const b = Number(parts[1])
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null
    return a / b
  }
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function isCorrectAnswer(item: Item, raw: string): boolean {
  const format = item.format ?? (item.choices?.length ? "mcq" : "numeric")
  if (format === "mcq") {
    return raw === item.correctChoiceId
  }
  if (!item.numeric) return false
  const value = parseNumeric(raw)
  if (value === null) return false
  const tol = item.numeric.tolerance ?? 0
  return item.numeric.accepted.some((accepted) => Math.abs(accepted - value) <= tol)
}

export function correctAnswerLabel(item: Item): string {
  const format = item.format ?? (item.choices?.length ? "mcq" : "numeric")
  if (format === "mcq") {
    const choice = item.choices?.find((c) => c.id === item.correctChoiceId)
    return choice ? `${choice.id}. ${choice.text}` : item.correctChoiceId ?? ""
  }
  return item.numeric?.accepted.map(String).join(" or ") ?? ""
}

export const HINTS = {
  1: {
    label: "Concept cue",
    rw: "Name the skill this item is testing before you look back at the options: claim, evidence, word meaning, boundary, or purpose. If you cannot name it, reread the stem once more — not the choices.",
    math: "Name the relationship: linear, proportional, quadratic, geometric, or statistical. What quantity is the question actually asking for, and in which units?",
  },
  2: {
    label: "Representation cue",
    rw: "Mark the sentence or clause that carries the claim. Circle scope words such as some, most, may, or not. Those limits usually decide the item.",
    math: "Write the given information as an equation, table row, or labelled diagram. Keep the units next to each number so slope and intercept cannot swap places unnoticed.",
  },
  3: {
    label: "Partial step",
    rw: "Eliminate any option that adds a fact the passage does not state, or that changes the scope of a cautious word. What remains should match both content and limits.",
    math: "Compute the first operation only — isolate the target variable or find the unit rate — then pause before finishing. The pause is the method.",
  },
} as const

export function hintText(item: Item, level: 1 | 2 | 3): string {
  const bank = HINTS[level]
  return item.section === "rw" ? bank.rw : bank.math
}

export function suggestErrorCategory(item: Item, timed: boolean): import("./types").ErrorCategory {
  if (timed && item.section === "math") return "timing"
  const tag = item.misconceptionTag ?? ""
  if (tag.includes("scope") || tag.includes("beyond-text")) {
    return "interpretation"
  }
  if (tag.includes("slope-intercept") || tag.includes("method")) {
    return "method"
  }
  if (item.format === "numeric" || tag.includes("arithmetic")) {
    return "calculation"
  }
  return "knowledge"
}
