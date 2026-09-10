import { SKILLS, UNITS, unitById } from "./curriculum"
import { ensureMasteryMap } from "./mastery"
import type {
  DiagnosticResult,
  DomainId,
  PlanTask,
  PlannerTemplate,
  Profile,
  StudentState,
  StudyPlan,
} from "./types"

const TEMPLATES: Record<
  PlannerTemplate,
  { weeks: number; label: string; description: string }
> = {
  "16": {
    weeks: 16,
    label: "Foundation \u00b7 16 weeks",
    description:
      "More time for prerequisite repair. This is a scheduling template, not a promise that every student finishes in 16 weeks.",
  },
  "12": {
    weeks: 12,
    label: "Standard \u00b7 12 weeks",
    description:
      "Orientation and screening, then foundational domains, mixed practice, mocks, and test-day rehearsal.",
  },
  "6": {
    weeks: 6,
    label: "Intensive \u00b7 6 weeks",
    description:
      "Compressed calendar with explicit prioritization. Unfinished topics stay incomplete — they are never silently marked done.",
  },
}

export { TEMPLATES }

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function availableDates(start: Date, weeks: number, daysAvailable: string[], weeklyMinutes: number) {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const wanted = new Set(daysAvailable)
  const dates: { date: string; budget: number }[] = []
  const end = addDays(start, weeks * 7)
  const sessionsPerWeek = Math.max(wanted.size, 1)
  const perSession = Math.max(25, Math.round(weeklyMinutes / sessionsPerWeek))
  for (let d = new Date(start); d < end; d = addDays(d, 1)) {
    if (wanted.has(names[d.getDay()])) {
      dates.push({ date: isoDate(d), budget: perSession })
    }
  }
  return dates
}

function placementUnitIds(diagnostic: DiagnosticResult | null): string[] {
  if (!diagnostic) return ["RW0", "M0"]
  const weak: string[] = []
  const mixed: string[] = []
  const rest: string[] = []
  for (const unit of UNITS) {
    const band = diagnostic.domainEvidence[unit.domain]?.band
    if (band === "needs-support") weak.push(unit.id)
    else if (band === "mixed") mixed.push(unit.id)
    else rest.push(unit.id)
  }
  return [...weak, ...mixed, ...rest]
}

export function generatePlan(state: StudentState, from = new Date()): StudyPlan {
  const profile = state.profile
  const template = profile?.plannerTemplate ?? "12"
  const weeks = TEMPLATES[template].weeks
  const days = profile?.daysAvailable?.length
    ? profile.daysAvailable
    : ["Mon", "Wed", "Fri"]
  const weekly = profile?.weeklyMinutes ?? 180
  const slots = availableDates(from, weeks, days, weekly)
  const catchUpSlots = Math.round(slots.length * 0.2)
  const workSlots = slots.slice(0, Math.max(1, slots.length - catchUpSlots))

  const tasks: PlanTask[] = []
  const orderedUnits = placementUnitIds(state.diagnostic)
  const mastery = ensureMasteryMap(state.mastery)

  let slotIndex = 0
  const takeSlot = () => workSlots[Math.min(slotIndex++, workSlots.length - 1)]

  if (!state.orientationComplete) {
    const slot = takeSlot()
    tasks.push({
      id: "task-orient",
      date: slot.date,
      type: "orientation",
      title: "Orientation: how this test and this course work",
      durationMin: 12,
      reason: "Start here so later recommendations make sense.",
      href: "/orient",
      completed: false,
    })
  }

  if (!state.diagnostic) {
    const slot = takeSlot()
    tasks.push({
      id: "task-diag",
      date: slot.date,
      type: "diagnostic",
      title: "Domain screening (28 items)",
      durationMin: 35,
      reason:
        "A short screening across the eight official domains. It is not an official score and cannot place every micro-skill.",
      href: "/diagnostic",
      completed: false,
    })
  }

  const overdueReviews = Object.values(mastery).filter((m) => m.state === "needs-refresh")
  for (const rec of overdueReviews.slice(0, 6)) {
    const skill = SKILLS.find((s) => s.id === rec.skillId)
    const slot = takeSlot()
    tasks.push({
      id: `task-refresh-${rec.skillId}`,
      date: slot.date,
      type: "review",
      title: `Refresh: ${skill?.title ?? rec.skillId}`,
      durationMin: 15,
      reason: `Review ${skill?.title} because later evidence contradicted an earlier result.`,
      href: `/practice/run?mode=mixed-review&skill=${rec.skillId}`,
      skillId: rec.skillId,
      unitId: skill?.unitId,
      completed: false,
    })
  }

  const mistakeSkills = countBy(
    state.mistakes.filter((m) => !m.resolved).map((m) => m.skillId)
  )
  const recurring = Object.entries(mistakeSkills)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
  for (const [skillId, n] of recurring.slice(0, 4)) {
    const skill = SKILLS.find((s) => s.id === skillId)
    const slot = takeSlot()
    tasks.push({
      id: `task-err-${skillId}`,
      date: slot.date,
      type: "review",
      title: `Repair a repeating error in ${skill?.title ?? skillId}`,
      durationMin: 12,
      reason: `Review ${skill?.title} because this error appeared in ${n} recent sets.`,
      href: "/mistakes",
      skillId,
      unitId: skill?.unitId,
      completed: false,
    })
  }

  for (const unitId of orderedUnits) {
    const unit = unitById(unitId)
    if (!unit) continue
    const skill = SKILLS.find((s) => s.unitId === unitId)
    const rec = skill ? mastery[skill.id] : undefined
    if (rec?.state === "provisionally-secure" || rec?.state === "retained") continue
    const lessonId = unit.lessonIds[0]
    const slot = takeSlot()
    const reason = reasonForUnit(unitId, state.diagnostic, rec?.state)
    tasks.push({
      id: `task-lesson-${unitId}`,
      date: slot.date,
      type: "lesson",
      title: `Learn: ${unit.id} ${unit.title}`,
      durationMin: 12,
      reason,
      href: `/learn/${unitId}/${lessonId}`,
      unitId,
      lessonId,
      skillId: skill?.id,
      completed: false,
    })
    const practiceSlot = takeSlot()
    tasks.push({
      id: `task-practice-${unitId}`,
      date: practiceSlot.date,
      type: "practice",
      title: `Independent practice: ${unit.shortTitle}`,
      durationMin: 15,
      reason: `Apply ${unit.title} on fresh items after the lesson. Hinted attempts will not count toward independent mastery.`,
      href: `/practice/run?mode=independent-quiz&unit=${unitId}`,
      unitId,
      skillId: skill?.id,
      completed: false,
    })
  }

  const mixEvery = 4
  for (let i = mixEvery; i < workSlots.length; i += mixEvery) {
    tasks.push({
      id: `task-mixed-${i}`,
      date: workSlots[i].date,
      type: "mixed",
      title: "Mixed retrieval",
      durationMin: 15,
      reason: "At least one weekly session should mix skills so practice does not stay locked to a single lesson.",
      href: "/practice/run?mode=mixed-review",
      completed: false,
    })
  }

  const third = Math.floor(workSlots.length * 0.55)
  if (workSlots[third]) {
    tasks.push({
      id: "task-mini",
      date: workSlots[third].date,
      type: "timed-mini",
      title: "Timed mini-set",
      durationMin: 18,
      reason: "Build pacing on a short mixed set before a full two-stage mock.",
      href: "/practice/run?mode=timed-mini",
      completed: false,
    })
  }

  const mockSlot = workSlots[Math.floor(workSlots.length * 0.7)]
  if (mockSlot) {
    tasks.push({
      id: "task-mock-1",
      date: mockSlot.date,
      type: "mock",
      title: "Two-stage rehearsal mock",
      durationMin: 70,
      reason:
        "A shortened adaptive form that freezes routing at start. It reports raw accuracy, not an official 320–1520 score.",
      href: "/mocks",
      completed: false,
    })
  }

  const blueSlot = workSlots[Math.floor(workSlots.length * 0.82)]
  if (blueSlot) {
    tasks.push({
      id: "task-bluebook",
      date: blueSlot.date,
      type: "bluebook",
      title: "Official Bluebook practice (outbound)",
      durationMin: 30,
      reason:
        "Practise in College Board’s Bluebook, then record your self-reported result here. Anannt does not collect College Board credentials.",
      href: "/help#bluebook",
      completed: false,
    })
  }

  const last = workSlots[workSlots.length - 1]
  if (last) {
    tasks.push({
      id: "task-testday",
      date: last.date,
      type: "testday",
      title: "Test-day checklist and tool familiarization",
      durationMin: 20,
      reason: "Finish with practical rehearsal, not cramming a new unit the night before.",
      href: "/help#test-day",
      completed: false,
    })
  }

  tasks.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))

  return {
    template,
    generatedAt: new Date().toISOString(),
    startDate: isoDate(from),
    tasks,
    catchUpNote: `About 20% of available sessions (${catchUpSlots} of ${slots.length}) are held back for catch-up. Missing a day reschedules work without doubling tomorrow.`,
  }
}

function reasonForUnit(
  unitId: string,
  diagnostic: DiagnosticResult | null,
  state?: string
) {
  const unit = unitById(unitId)
  const band = unit ? diagnostic?.domainEvidence[unit.domain]?.band : undefined
  if (band === "needs-support") {
    return `Start ${unitId} because the screening showed limited evidence in ${unit?.domain.replaceAll("-", " ")}. Untested skills stay unknown.`
  }
  if (state === "learning") {
    return `Continue ${unitId} because instruction has started and independent evidence is still thin.`
  }
  if (unit?.prerequisites.length) {
    return `Learn ${unitId} next in the sequential path after its prerequisites (${unit.prerequisites.join(", ")}). Recommendations guide sequence; you may still open any lesson.`
  }
  return `Learn ${unitId} as the next uncovered objective in the visible path.`
}

function countBy(ids: string[]) {
  const m: Record<string, number> = {}
  for (const id of ids) m[id] = (m[id] ?? 0) + 1
  return m
}

export function todayTasks(plan: StudyPlan | null, completedTaskIds: string[], day = isoDate(new Date())) {
  if (!plan) return []
  return plan.tasks
    .filter((t) => !completedTaskIds.includes(t.id) && !t.completed)
    .sort((a, b) => {
      const ad = a.date <= day ? 0 : 1
      const bd = b.date <= day ? 0 : 1
      if (ad !== bd) return ad - bd
      return a.date.localeCompare(b.date)
    })
}

export function missedDayMessage(plan: StudyPlan | null, completedTaskIds: string[]) {
  if (!plan) return null
  const today = isoDate(new Date())
  const overdue = plan.tasks.filter(
    (t) => t.date < today && !completedTaskIds.includes(t.id) && !t.completed
  )
  if (overdue.length === 0) return null
  return `${overdue.length} session${overdue.length === 1 ? "" : "s"} slipped. They move into today’s list without stacking a double load.`
}

export function weeklyCapacityNote(profile: Profile | null) {
  if (!profile) return "Add weekly availability in onboarding so plans stay realistic."
  const days = profile.daysAvailable.length || 3
  const per = Math.round(profile.weeklyMinutes / days)
  return `${profile.weeklyMinutes} minutes across ${days} day${days === 1 ? "" : "s"} (~${per} min/session). Catch-up time is reserved; the planner will not silently mark omitted topics complete.`
}
