export type Track = "psat-nmsqt" | "psat-10"
export type Grade = "9" | "10" | "11"
export type PlannerTemplate = "16" | "12" | "6"
export type Role = "student" | "mentor" | "parent"
export type Section = "rw" | "math"

export type DomainId =
  | "information-ideas"
  | "craft-structure"
  | "expression-of-ideas"
  | "standard-english-conventions"
  | "algebra"
  | "advanced-math"
  | "problem-solving-data-analysis"
  | "geometry-trigonometry"

export type MasteryState =
  | "unknown"
  | "learning"
  | "practising"
  | "provisionally-secure"
  | "retained"
  | "needs-refresh"

export type PracticeMode =
  | "guided"
  | "independent-quiz"
  | "mixed-review"
  | "timed-mini"
  | "section-module"
  | "full-mock"
  | "diagnostic"
  | "lesson-check"
  | "lesson-independent"
  | "mistake-retest"

export type ErrorCategory =
  | "knowledge"
  | "interpretation"
  | "method"
  | "calculation"
  | "timing"

export type Difficulty = "foundation" | "core" | "stretch"
export type Pool =
  | "diagnostic"
  | "guided"
  | "practice"
  | "review"
  | "mock"
  | "lesson-check"
  | "independent"

export type ResponseFormat = "mcq" | "numeric"

export type Choice = {
  id: string
  text: string
  rationale: string
}

export type NumericSpec = {
  accepted: number[]
  tolerance?: number
  formatsNote: string
}

export type Item = {
  id: string
  version: number
  familyId: string
  section: Section
  domain: DomainId
  unitId: string
  skillId: string
  difficulty: Difficulty
  pool: Pool
  format: ResponseFormat
  stimulus?: string
  stimulusLabel?: string
  stem: string
  choices?: Choice[]
  correctChoiceId?: string
  numeric?: NumericSpec
  explanation: string
  fullReasoning: string
  misconceptionTag: string
  alternateMethod?: string
  nextSkillId?: string
  accessibilityText?: string
  diagram?: "delivery-cost" | "water-volume" | "scatter" | "triangle" | "none"
}

export type LessonExample = {
  title: string
  body: string
  kind: "example" | "contrast"
  diagram?: Item["diagram"]
}

export type Lesson = {
  id: string
  unitId: string
  skillId: string
  title: string
  durationMin: number
  complete: boolean
  objective: string
  relevance: string
  explanation: string
  examples: [LessonExample, LessonExample]
  checkItemIds: string[]
  misconception: { title: string; body: string; tag: string }
  independentItemIds: string[]
  takeaway: string
  mentorNote?: string
  comparisonActivity?: {
    triggerTag: string
    title: string
    body: string
  }
  reviewNote?: string
}

export type Unit = {
  id: string
  section: Section
  domain: DomainId
  order: number
  title: string
  shortTitle: string
  coverage: string
  evidence: string
  prerequisites: string[]
  lessonIds: string[]
}

export type Skill = {
  id: string
  unitId: string
  title: string
  domain: DomainId
  section: Section
  highRelevance: boolean
}

export type Profile = {
  displayName: string
  track: Track
  grade: Grade
  targetWindow: string
  targetUnknown: boolean
  weeklyMinutes: number
  daysAvailable: string[]
  timezone: string
  previousScore?: {
    total?: number
    rw?: number
    math?: number
    date?: string
    source: "self-reported"
  }
  needs: string[]
  plannerTemplate: PlannerTemplate
  studyLanguageSupport: string
}

export type AccessibilitySettings = {
  largerText: boolean
  reduceMotion: boolean
  extraTimePractice: boolean
  highContrast: boolean
}

export type AttemptRecord = {
  id: string
  itemId: string
  familyId: string
  skillId: string
  unitId: string
  answer: string
  correct: boolean
  hinted: boolean
  solutionRevealed: boolean
  hintLevel: 0 | 1 | 2 | 3
  timeMs: number
  mode: PracticeMode
  timestamp: string
  confidence?: "low" | "medium" | "high"
  sessionId: string
}

export type MistakeRecord = {
  id: string
  attemptId: string
  itemId: string
  skillId: string
  unitId: string
  studentAnswer: string
  correctAnswer: string
  category?: ErrorCategory
  autoSuggestion?: ErrorCategory
  resolved: boolean
  resolvedAt?: string
  retestItemId?: string
  createdAt: string
  slowCorrect?: boolean
}

export type MasteryRecord = {
  skillId: string
  state: MasteryState
  coverage: boolean
  independentCorrect: number
  independentTotal: number
  firstAttemptUnhintedCorrect: number
  firstAttemptUnhintedTotal: number
  sessionIds: string[]
  familiesSeen: string[]
  lastAttemptAt?: string
  provisionallySecureAt?: string
  retainedAt?: string
  retentionCorrect: number
  retentionTotal: number
  timedCorrect: number
  timedTotal: number
  misconceptionCounts: Record<string, number>
}

export type LessonProgress = {
  lessonId: string
  step: number
  completed: boolean
  completedAt?: string
}

export type PlanTask = {
  id: string
  date: string
  type:
    | "orientation"
    | "diagnostic"
    | "lesson"
    | "practice"
    | "review"
    | "mixed"
    | "timed-mini"
    | "mock"
    | "bluebook"
    | "testday"
  title: string
  durationMin: number
  reason: string
  href: string
  unitId?: string
  lessonId?: string
  skillId?: string
  completed: boolean
  completedAt?: string
}

export type StudyPlan = {
  template: PlannerTemplate
  generatedAt: string
  startDate: string
  tasks: PlanTask[]
  catchUpNote: string
}

export type DiagnosticResult = {
  completedAt: string
  itemIds: string[]
  answers: Record<string, string>
  domainEvidence: Record<
    DomainId,
    { correct: number; total: number; band: "needs-support" | "mixed" | "likely-ready" | "untested" }
  >
  placement: Record<string, "foundation" | "core" | "stretch" | "unknown">
}

export type MockModuleId = "rw-1" | "rw-2" | "math-1" | "math-2"
export type MockBranch = "easier" | "harder"
export type MockAttemptState =
  | "created"
  | "in-progress"
  | "between-modules"
  | "break"
  | "submitted"
  | "interrupted"

export type MockAttempt = {
  id: string
  formVersion: string
  routingPolicy: string
  timingProfile: "standard" | "extra-time" | "untimed-rehearsal"
  state: MockAttemptState
  currentModule: MockModuleId | null
  rwBranch?: MockBranch
  mathBranch?: MockBranch
  startedAt: string
  moduleDeadlineAt?: string
  moduleStartedAt?: string
  responses: Record<string, { answer: string; marked: boolean; eliminated: string[]; updatedAt: string }>
  submittedModules: MockModuleId[]
  moduleItemIds: Record<string, string[]>
  breakEndsAt?: string
  completedAt?: string
  lastSavedAt: string
}

export type BluebookRecord = {
  id: string
  date: string
  testName: string
  selfReportedTotal?: number
  selfReportedRw?: number
  selfReportedMath?: number
  notes: string
}

export type AnalyticsEvent = {
  name: string
  at: string
  payload?: Record<string, string | number | boolean>
}

export type StudentState = {
  version: 1
  profile: Profile | null
  orientationComplete: boolean
  diagnostic: DiagnosticResult | null
  mastery: Record<string, MasteryRecord>
  attempts: AttemptRecord[]
  mistakes: MistakeRecord[]
  lessonProgress: Record<string, LessonProgress>
  plan: StudyPlan | null
  mockAttempts: MockAttempt[]
  activeMockId: string | null
  bluebookRecords: BluebookRecord[]
  events: AnalyticsEvent[]
  quarantinedItemIds: string[]
  accessibility: AccessibilitySettings
  role: Role
  completedTaskIds: string[]
}

export const STORAGE_KEY = "anannt-psat-v1"
export const FORM_VERSION = "anannt-rehearsal-2026.1"
export const ROUTING_POLICY = "anannt-practice-v1"
export const CONTENT_REVIEW_DATE = "9 September 2026"
