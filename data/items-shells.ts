import { mcq, numeric } from "./author"
import type { Item } from "@/lib/types"

const C = "lesson-check" as const
const N = "independent" as const

export const SHELL_ITEMS: Item[] = [
  mcq({
    id: "RW3-C1",
    unitId: "RW3",
    domain: "information-ideas",
    pool: C,
    stimulus:
      "A bar chart of rainfall (mm) for four weeks reads 10, 12, 11, 40. The caption notes a storm in week 4. A student says rainfall “grew steadily.”",
    stem: "The student’s sentence is",
    choices: [
      "accurate, because week 4 is largest.",
      "inaccurate: three similar weeks and one storm spike are not a steady rise.",
      "accurate, because rain is wet.",
      "unjudgeable without colour in the chart.",
    ],
    correct: 1,
    rationales: [
      "Largest is not the same as steadily growing.",
      "Axes and caption explain a spike, not a trend.",
      "Irrelevant.",
      "Values are given in text.",
    ],
    explanation: "Read units and pattern. A labelled storm is a cause for an outlier, not proof of a trend.",
    misconceptionTag: "trend-vs-spike",
  }),
]
