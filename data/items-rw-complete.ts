import { mcq } from "./author"
import type { Item } from "@/lib/types"

const P = "lesson-check" as const
const I = "independent" as const

export const RW_COMPLETE_ITEMS: Item[] = [
  mcq({
    id: "RW0-C1",
    unitId: "RW0",
    domain: "information-ideas",
    pool: P,
    difficulty: "foundation",
    stimulus:
      "The school’s science fair “was a success,” the principal wrote, “because 60 students presented projects.” A parent later said the fair was a success because the hall smelled like popcorn.",
    stem: "Which option correctly separates the principal’s claim from an example or a different opinion?",
    choices: [
      "The principal’s claim is that the hall smelled like popcorn.",
      "The principal’s claim is that the fair was a success; the 60 projects are the support offered.",
      "The parent and the principal offered identical evidence.",
      "Sixty is an opinion, not a number.",
    ],
    correct: 1,
    rationales: [
      "That detail belongs to the parent, not the principal.",
      "Claim = success; example/support = 60 presentations.",
      "They used different reasons.",
      "60 is a count the principal used as support.",
    ],
    explanation: "A claim is the point being argued. An example or count is support, not the claim itself.",
    misconceptionTag: "claim-vs-example",
  }),
]
