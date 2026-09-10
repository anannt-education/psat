export const BRAND = {
  name: "Anannt Education",
  shortName: "Anannt",
  product: "Anannt PSAT Path",
  exams: "PSAT/NMSQT and PSAT 10",
  mentor: "Your Anannt mentor",
  tagline: "Understand what you are learning, know what to do next, and practise until you can apply it independently.",
  description:
    "A short SAT-feeder path: slope in context and some versus all. Two lessons open, no account. Digital SAT mentoring in Dubai if you want a person today.",
  disclaimer:
    "Anannt Education is not affiliated with the College Board. This path does not deliver the official exam, convert practice into official scores, or promise scholarships.",
} as const

export const METHOD_STEPS = [
  { title: "Orient", body: "See how the digital suite is built: two Reading and Writing modules, two Math modules, a break, and two-stage adaptation inside each section." },
  { title: "Diagnose", body: "A 28-item screening across eight official domains. Small samples yield placement hints, not an official score." },
  { title: "Place", body: "Foundation, core, or stretch at skill level. Untested skills stay unknown rather than guessed." },
  { title: "Plan", body: "Dated sessions from weekly minutes. A missed day is rescheduled; the planner does not pile shame work." },
  { title: "Learn", body: "An 8–15 minute lesson: objective, why it matters, explanation, two examples, checks, misconception, independent items, takeaway." },
  { title: "Apply", body: "Independent questions. A hint or a revealed solution is assisted evidence and cannot satisfy mastery." },
  { title: "Retain", body: "Delayed fresh items. Coverage, accuracy, retention, and timed performance stay separate numbers." },
  { title: "Perform", body: "Mixed sets, timed modules, and a shortened two-stage mock that freezes an Anannt routing rule." },
  { title: "Reflect", body: "An error notebook with knowledge, interpretation, method, calculation, and timing — suggestions, not diagnoses." },
  { title: "Test day", body: "Outbound College Board digital practice and a logistics checklist. Anannt never collects College Board credentials." },
] as const

export const TRUST_POINTS = [
  {
    title: "College Board exam-prep authors, not a score mill",
    body: "Lessons are written to the digital SAT suite: slope as rate versus start, sentence boundaries, some versus all. We do not invent percentiles or promise scholarships.",
  },
  {
    title: "A mentor in the room",
    body: "Each lesson names the objective, why the skill is tested, the attractive error, and the next honest step. Wrong answers become material for the error notebook.",
  },
  {
    title: "Visible curriculum, honest gaps",
    body: "RW0–RW12 and M0–M14 sit on one map. Complete lessons carry the full method. Walkable shells stay labelled so untested skills are not dressed up as mastered.",
  },
] as const
