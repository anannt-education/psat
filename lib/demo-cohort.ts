export type DemoLearner = {
  id: string
  name: string
  track: "psat-nmsqt" | "psat-10"
  grade: string
  trigger: string
  why: string
  suggestedLesson: string
  href: string
  lastActive: string
  unsuccessfulAttempts: number
}

export const DEMO_COHORT: DemoLearner[] = [
  {
    id: "demo-arun",
    name: "Arun M.",
    track: "psat-nmsqt",
    grade: "10",
    trigger: "Three unsuccessful attempts on the same skill",
    why: "Sentence boundaries: fused sentences in two independent quizzes and one mixed set. Hinted retries were correct, so independent mastery never moved.",
    suggestedLesson: "RW8 · Sentence boundaries",
    href: "/learn/RW8/RW8-L1",
    lastActive: "Yesterday",
    unsuccessfulAttempts: 3,
  },
  {
    id: "demo-sara",
    name: "Sara K.",
    track: "psat-10",
    grade: "10",
    trigger: "Repeated prerequisite failure",
    why: "Slope-in-context items are missed after swapping intercept and rate. Numerical foundations checks are still inconsistent, so M2 is being practised on a weak M0.",
    suggestedLesson: "M0 · Numerical foundations, then M2",
    href: "/learn/M0/M0-L1",
    lastActive: "2 days ago",
    unsuccessfulAttempts: 4,
  },
  {
    id: "demo-noah",
    name: "Noah P.",
    track: "psat-nmsqt",
    grade: "11",
    trigger: "Timed versus untimed gap",
    why: "Untimed algebra accuracy is high; timed mini-set pacing shows unfinished items in the last four minutes. Not a content hole — a performance hole.",
    suggestedLesson: "Timed mini-set, then a section module",
    href: "/practice/run?mode=timed-mini",
    lastActive: "Today",
    unsuccessfulAttempts: 0,
  },
  {
    id: "demo-leah",
    name: "Leah C.",
    track: "psat-nmsqt",
    grade: "10",
    trigger: "A week without a session",
    why: "Last independent attempt was eight days ago, mid-RW8. A short check-in is more useful than a new unit: ten minutes on sentence boundaries (fused vs splice), then stop. Returning is the skill.",
    suggestedLesson: "RW8 · Sentence boundaries, then stop",
    href: "/learn/RW8/RW8-L1",
    lastActive: "8 days ago",
    unsuccessfulAttempts: 0,
  },
]
