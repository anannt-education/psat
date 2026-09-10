import type { Lesson } from "@/lib/types"
import { UNITS } from "@/lib/curriculum"

const COMPLETE: Record<string, Lesson> = {
  "RW0-L1": {
    id: "RW0-L1",
    unitId: "RW0",
    skillId: "RW0-S1",
    title: "Claims, paraphrases, and how sentences connect",
    durationMin: 12,
    complete: true,
    objective:
      "Separate a writer’s claim from an example, paraphrase a sentence without copying it, and name the logical link between two clauses.",
    relevance:
      "Digital Reading and Writing items often hide the tested skill behind a short original text. If you cannot say what a sentence is doing, later evidence and inference items feel like guesswork.",
    explanation:
      "A claim is the point someone wants you to accept. An example or count is support — it is not the claim. Paraphrase replaces words and structure while keeping both ideas, including contrast words such as although. When two clauses are joined by because, although, or if, name that relationship before you look at options.",
    examples: [
      {
        title: "Claim versus example",
        kind: "example",
        body: "“The fair was a success because 60 students presented.” Success is the claim; 60 presentations are the support. A parent who praises popcorn is offering a different claim, not the principal’s evidence.",
      },
      {
        title: "Contrast: copy versus paraphrase",
        kind: "contrast",
        body: "Original: “Although the river was shallow, the current moved a branch.” A copy merely shuffles words. A paraphrase: “The water was not deep, but it still had enough force to carry a branch.” Both the concession and the contrast survive.",
      },
    ],
    checkItemIds: ["RW0-C1", "RW0-C2"],
    misconception: {
      title: "Treating a vivid detail as the claim",
      body: "Readers remember popcorn, colour, or a number and think that was the point. Ask: what is the author trying to get me to believe? That sentence is the claim; the rest may only illustrate it.",
      tag: "claim-vs-example",
    },
    independentItemIds: ["RW0-I1", "RW0-I2", "RW0-I3", "RW0-I4", "RW0-I5", "RW0-I6"],
    takeaway:
      "Name the claim, restate each sentence in new words, and label the logical link. Those three moves are the foundation for every later Reading item.",
    mentorNote:
      "Before you touch the choices, say the claim in one sentence. If you cannot, the item is still a reading problem — not a trick.",
  },
  "RW1-L1": {
    id: "RW1-L1",
    unitId: "RW1",
    skillId: "RW1-S1",
    title: "Central meaning and keeping the author’s scope",
    durationMin: 14,
    complete: true,
    objective:
      "Identify a short passage’s main claim, choose support that matches it, and reject answers that change cautious words such as some into all.",
    relevance:
      "Information and Ideas items reward precise reading of what the author actually concluded. Inflating a cautious finding is one of the most common attractive errors on this test.",
    explanation:
      "Central meaning includes scope. If researchers write that trees “may reduce heat on some streets” and that commercial avenues were not studied, those limits are part of the finding. A correct summary keeps may, some, and the sample. Supporting evidence must speak to the same outcome in the same population. An answer that is true in the world but wider than the text is still wrong.",
    examples: [
      {
        title: "A cautious finding (urban trees)",
        kind: "example",
        body: "Forty-eight residential streets; lower pavement temperatures on some of the hottest days; commercial avenues excluded. The honest summary keeps all three constraints. “Trees eliminate heat on every street” is a different claim.",
      },
      {
        title: "Contrast: same skill, new topic (sleep and quizzes)",
        kind: "contrast",
        body: "A counsellor says some students who slept eight hours improved on their own later quiz. She does not speak for every student. The trap answer upgrades some to every. Later practice in this lesson uses turtles, flour, and ferries so you are not memorising trees.",
      },
    ],
    checkItemIds: ["RW1-C1", "RW1-C2"],
    misconception: {
      title: "Changing some into all",
      body: "An attractive wrong answer often feels “more complete.” Completeness that the passage did not earn is an error. Circle some, most, may, appear, and not studied before you look at choices.",
      tag: "scope-some-to-all",
    },
    independentItemIds: ["RW1-I1", "RW1-I2", "RW1-I3", "RW1-I4", "RW1-I5", "RW1-I6"],
    takeaway:
      "A summary is wrong if it quietly drops a limit. Match evidence to both the content and the scope of the claim.",
    reviewNote:
      "A later review should use a new topic with the same some-versus-all trap, not another tree study.",
    mentorNote:
      "Circle some, may, and not studied. If an option drops those limits, it is already wrong — even if it sounds more complete.",
  },
  "RW2-L1": {
    id: "RW2-L1",
    unitId: "RW2",
    skillId: "RW2-S1",
    title: "Evidence that actually supports the claim",
    durationMin: 12,
    complete: true,
    objective:
      "Match a quotation or detail to a stated claim, and reject a plausible sentence that is off-topic, mistimed, or merely restates the claim.",
    relevance:
      "Official Information and Ideas work includes textual evidence. The hard part is not finding a sentence that mentions the topic; it is finding one that could make the claim true.",
    explanation:
      "Ask three checks: Does this detail measure the same outcome? Does its timing fit the claimed cause? Does it add information rather than repeat the claim in new words? A charming fact about otters does not show that they returned after water quality improved.",
    examples: [
      {
        title: "Clay scraps",
        kind: "example",
        body: "Claim: the workshop reduced waste by reusing trimmings. Support: scrap bins went from 12 kg to 3 kg after the rule. “Students painted more mugs” is a different outcome.",
      },
      {
        title: "Contrast: a bicycle bought too early",
        kind: "contrast",
        body: "Claim: a new bike lane increased weekend cycling. A resident who bought a bicycle last year, before the lane opened, mentions cycling but fails the timing test.",
      },
    ],
    checkItemIds: ["RW2-C1", "RW2-C2"],
    misconception: {
      title: "The relevant-sounding quotation",
      body: "If it names the topic, it feels like evidence. Topic overlap is not support. Demand a measurable link to the claimed outcome.",
      tag: "irrelevant-but-plausible-quote",
    },
    independentItemIds: ["RW2-I1", "RW2-I2", "RW2-I3", "RW2-I4", "RW2-I5", "RW2-I6"],
    takeaway:
      "Evidence can be checked. Restatements, mistimed stories, and neighbouring facts are not support.",
    mentorNote:
      "Ask whether the quotation could make the claim true. Naming the topic is not the same as supporting the outcome.",
  },
  "RW8-L1": {
    id: "RW8-L1",
    unitId: "RW8",
    skillId: "RW8-S1",
    title: "Sentence boundaries: complete ideas need legal joins",
    durationMin: 12,
    complete: true,
    objective:
      "Spot fused sentences, comma splices, and fragments, then choose a legal boundary and explain the clause relationship.",
    relevance:
      "Standard English Conventions items on the digital suite still test whether two complete ideas are joined legally. You do not need obscure grammar names if you can find subjects and finite verbs.",
    explanation:
      "An independent clause can stand as a sentence. Two of them may be joined by a period, a semicolon, or a comma plus a coordinating conjunction (for, and, nor, but, or, yet, so). A comma alone is a splice. No mark is a fused sentence. A because- or while-clause cannot stand alone — that is a fragment. A colon is allowed when the second complete clause explains the first.",
    examples: [
      {
        title: "Legal join",
        kind: "example",
        body: "“The lights dimmed, and the orchestra began.” Two subjects, two verbs, comma plus and.",
      },
      {
        title: "Contrast: three illegal shapes",
        kind: "contrast",
        body: "Fused: “The lights dimmed the orchestra began.” Splice: “The lights dimmed, the orchestra began.” Fragment: “Because the printer jammed during the meeting.”",
      },
    ],
    checkItemIds: ["RW8-C1", "RW8-C2"],
    misconception: {
      title: "A comma feels like enough of a pause",
      body: "Speech has pauses; written independent clauses need a stronger legal mark than a comma alone. Name the error type, then pick the fix.",
      tag: "comma-splice",
    },
    independentItemIds: ["RW8-I1", "RW8-I2", "RW8-I3", "RW8-I4", "RW8-I5", "RW8-I6"],
    takeaway:
      "Find two complete ideas. If both can stand alone, use a period, semicolon, colon (for an explanation), or comma plus FANBOYS — never a comma alone.",
    mentorNote:
      "Find two subjects and two finite verbs. If both clauses can stand alone, a comma is not a legal join. Name the error type first: fused, splice, or fragment.",
  },
  "M0-L1": {
    id: "M0-L1",
    unitId: "M0",
    skillId: "M0-S1",
    title: "Keeping quantities equivalent",
    durationMin: 12,
    complete: true,
    objective:
      "Use order of operations, equivalent fractions and decimals, signed numbers, and unit rates without changing the quantity you meant to compute.",
    relevance:
      "Algebra items assume this fluency. A slope question is hopeless if 3 × 4 + 2 and 3 + 4 × 2 feel interchangeable.",
    explanation:
      "Multiply and divide before you add and subtract, unless grouping symbols say otherwise. Equivalent forms (3/4 and 0.75) name the same amount. On the number line, −3 is greater than −7. A unit rate (rupees per notebook) preserves a proportion; adding the same number to both parts of a ratio does not.",
    examples: [
      {
        title: "Order of operations",
        kind: "example",
        body: "2 + 3 × 4 = 2 + 12 = 14. Adding first to get 20 changes the quantity.",
      },
      {
        title: "Contrast: a ratio is not a sum",
        kind: "contrast",
        body: "5 notebooks for 200 rupees means 40 rupees each, not 200 − 5. Scaling a 3:2 ratio uses multiplication, not adding 1 to each part.",
      },
    ],
    checkItemIds: ["M0-C1", "M0-C2"],
    misconception: {
      title: "Working left to right through every symbol",
      body: "Left-to-right feels fair. The convention is not about fairness; it is about preserving a defined value. Write the multiplication first, then add.",
      tag: "order-of-operations",
    },
    independentItemIds: ["M0-I1", "M0-I2", "M0-I3", "M0-I4", "M0-I5", "M0-I6"],
    takeaway:
      "Decide which operations are defined first, then check that the new expression still names the same quantity.",
    mentorNote:
      "Write the multiplication before you add. The convention is not about fairness; it preserves a defined quantity.",
  },
  "M1-L1": {
    id: "M1-L1",
    unitId: "M1",
    skillId: "M1-S1",
    title: "Linear equations you can explain",
    durationMin: 12,
    complete: true,
    objective:
      "Solve a one-variable linear equation, translate a short story into an equation, and say what the solution means in the original units.",
    relevance:
      "Algebra on the PSAT suite is built on linear equations. The tested skill is not only getting x = 5; it is knowing that 5 is hours, rupees, or pears.",
    explanation:
      "Undo operations in reverse order. If the story is three tickets plus a 20-rupee fee equalling 155, write 3t + 20 = 155, not 3 + t + 20. After you solve, substitute back into the original. Negative solutions are allowed when the model allows them.",
    examples: [
      {
        title: "Clean undo",
        kind: "example",
        body: "5x − 9 = 16 → 5x = 25 → x = 5. Check: 25 − 9 = 16.",
      },
      {
        title: "Contrast: a story that is not 3 + t",
        kind: "contrast",
        body: "Three tickets and a fee: the 3 multiplies the price. Writing 3 + t treats 3 as rupees. Meaning first, symbols second.",
      },
    ],
    checkItemIds: ["M1-C1", "M1-C2"],
    misconception: {
      title: "Translating each word in order without the operations",
      body: "English order is not always algebraic order. Identify the unknown, the operations, and what equals what.",
      tag: "translation",
    },
    independentItemIds: ["M1-I1", "M1-I2", "M1-I3", "M1-I4", "M1-I5", "M1-I6"],
    takeaway:
      "Write the equation from the story, solve by inverse operations, and interpret the number in the original units.",
    mentorNote:
      "Name the unknown in units first — hours, rupees, pears — then write the equation. English order is not always algebraic order.",
  },
  "M2-L1": {
    id: "M2-L1",
    unitId: "M2",
    skillId: "M2-S1",
    title: "Slope in context: rate versus starting value",
    durationMin: 15,
    complete: true,
    objective:
      "Interpret the rate of change and the starting value of a linear model, and move among an equation, a table, and a graph without swapping those two roles.",
    relevance:
      "Linear representations are a core Algebra skill. Test items will change the story — delivery cost, water in a tank, a taxi — while keeping the same structure. If you only memorise “3 is slope in the delivery problem,” a water graph will catch you.",
    explanation:
      "Anannt’s teaching example is an original model C = 12 + 3d, where C is delivery cost in rupees and d is distance in kilometres. The 12 is the amount when d = 0: a fixed charge. The 3 is rupees per additional kilometre: the rate of change, or slope. A table (0 → 12, 1 → 15, 2 → 18) shows the same +3 each kilometre. On a graph, 12 is the C-intercept and 3 is the steepness. Swapping those two numbers is the featured error.",
    examples: [
      {
        title: "Delivery cost C = 12 + 3d",
        kind: "example",
        diagram: "delivery-cost",
        body: "Fixed amount 12 rupees; 3 rupees per kilometre. At 7 km, C = 12 + 21 = 33. The graph starts at 12, not at 3. The table differences are 3, 3, 3 — that is the slope, not the intercept.",
      },
      {
        title: "Contrast: water volume V = 8 + 2t",
        kind: "contrast",
        diagram: "water-volume",
        body: "Same structure, new context. The tank starts with 8 litres. Water is added at 2 litres per minute. After 6 minutes, V = 20. If you still say “8 is the rate,” you memorised the delivery story instead of the roles.",
      },
    ],
    checkItemIds: ["M2-C1", "M2-C2"],
    misconception: {
      title: "Swapping slope and intercept",
      body: "Students often call the first number they see the rate. In y = b + mx or y = mx + b, the coefficient of the variable is the rate; the standalone constant is the starting value. A short comparison: match “when distance is zero” to 12, and “for each extra kilometre” to 3.",
      tag: "slope-intercept-swap",
    },
    independentItemIds: ["M2-I1", "M2-I2", "M2-I3", "M2-I4", "M2-I5", "M2-I6"],
    takeaway:
      "Name the starting value and the rate in words, then check that the table differences and the graph intercept agree. A later review should use a new context, not another delivery-cost equation.",
    comparisonActivity: {
      triggerTag: "slope-intercept-swap",
      title: "Compare rate and start",
      body: "For C = 12 + 3d, finish these sentences. “When the distance is 0 km, the cost is ____ rupees.” “Each extra kilometre adds ____ rupees.” The first blank is the intercept 12. The second is the slope 3. If you swapped them, write both sentences with the numbers in the opposite blanks and notice that the table (0 → 12, 1 → 15) no longer matches.",
    },
    reviewNote:
      "Delayed review uses a water-volume graph, not another courier equation, so success is not memorisation of one story.",
    mentorNote:
      "Say out loud: when distance is zero, cost is 12; each extra kilometre adds 3. Those two sentences are the whole skill. A water tank later will use the same roles, not the same numbers.",
  },
  "M7-L1": {
    id: "M7-L1",
    unitId: "M7",
    skillId: "M7-S1",
    title: "Rates, units, and percents that stay consistent",
    durationMin: 12,
    complete: true,
    objective:
      "Compute a unit rate, convert units, scale a ratio, and find a percent of a quantity without flipping the rate or dropping units.",
    relevance:
      "Problem-Solving and Data Analysis items are often easy algebra wrapped in units. The error is usually a flipped rate or a percent taken of the wrong base.",
    explanation:
      "Write the rate as a fraction with units in the numerator and denominator: kilometres per hour, pages per minute. Conversions multiply by a factor that equals 1 (60 minutes / 1 hour). Percent change divides the change by the original amount, not by the new amount. A 1:3 concentrate-to-water mix scales by multiplication.",
    examples: [
      {
        title: "Constant speed",
        kind: "example",
        body: "45 km in 3 hours is 15 km/h, not 3/45 hours per kilometre unless that is what was asked.",
      },
      {
        title: "Contrast: map scale versus adding",
        kind: "contrast",
        body: "1 cm : 4 km and a 6 cm path is 24 km. Adding 6 + 4 treats unlike units as a sum.",
      },
    ],
    checkItemIds: ["M7-C1", "M7-C2"],
    misconception: {
      title: "Flipping the rate or adding ratio parts",
      body: "If the question asks for kilometres per hour, distance belongs on top. If a ratio is 1:3, doubling both parts is not the same as adding 2.",
      tag: "rate-flip",
    },
    independentItemIds: ["M7-I1", "M7-I2", "M7-I3", "M7-I4", "M7-I5", "M7-I6"],
    takeaway:
      "Keep units visible in every factor. Percent change uses the original as the denominator.",
    mentorNote:
      "Keep units in the fraction. Kilometres per hour means distance on top. Percent change divides by the original amount, not the new one.",
  },
}

function shellLesson(unitId: string): Lesson {
  const unit = UNITS.find((u) => u.id === unitId)!
  const id = `${unitId}-L1`
  return {
    id,
    unitId,
    skillId: `${unitId}-S1`,
    title: unit.title,
    durationMin: 10,
    complete: false,
    objective: `Practise the core of ${unit.title}: ${unit.coverage}`,
    relevance: `This unit sits on the visible sequential path so you can see what “next” means. It is a full instructional shell with original checks — not a blank stub — and it still feeds mastery evidence on skill ${unitId}-S1.`,
    explanation: `${unit.coverage} Evidence of learning: ${unit.evidence} Work the two contrasting mini-examples, complete the checks, then try independent items. Recommendations guide sequence; you may still open this lesson from the map.`,
    examples: [
      {
        title: `Worked direction for ${unit.shortTitle}`,
        kind: "example",
        body: `Start by naming the quantity or textual job. For ${unit.title.toLowerCase()}, that means stating the relationship in one sentence before looking at options. ${unit.evidence}`,
      },
      {
        title: "Contrast: the attractive wrong move",
        kind: "contrast",
        body:
          unit.section === "rw"
            ? "The attractive error usually adds a fact, widens some into all, or picks a transition that does not match the actual logic. Name the error before you pick a fix."
            : "The attractive error usually swaps two roles (rate vs start, mean vs median, association vs cause) or drops a unit. Write the roles in words, then compute.",
      },
    ],
    checkItemIds: [`${unitId}-C1`, `${unitId}-C2`],
    misconception: {
      title: `Typical slip in ${unit.shortTitle}`,
      body: `Students rush the first operation that looks familiar. Slow down: ${unit.evidence}`,
      tag: "method",
    },
    independentItemIds: [`${unitId}-I1`, `${unitId}-I2`],
    takeaway: unit.evidence,
    mentorNote: `This unit is on the map so you can see what comes next. Complete lessons — M2 slope, RW8 sentence boundaries, RW1 scope — show the full Anannt method. This shell still records honest evidence on ${unitId}-S1.`,
  }
}

export const LESSONS: Lesson[] = UNITS.map((unit) => {
  const id = unit.lessonIds[0]
  return COMPLETE[id] ?? shellLesson(unit.id)
})

export function lessonById(id: string) {
  return LESSONS.find((l) => l.id === id)
}

export function lessonsForUnit(unitId: string) {
  return LESSONS.filter((l) => l.unitId === unitId)
}
