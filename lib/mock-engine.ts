import { FORM_VERSION, ROUTING_POLICY, type MockAttempt, type MockBranch, type MockModuleId } from "./types"
import { MOCK_FORM } from "@/data/mock-form"

export const MOCK_TIMING = {
  standard: {
    "rw-1": 10 * 60,
    "rw-2": 10 * 60,
    "math-1": 12 * 60,
    "math-2": 12 * 60,
    break: 10 * 60,
  },
  "extra-time": {
    "rw-1": 15 * 60,
    "rw-2": 15 * 60,
    "math-1": 18 * 60,
    "math-2": 18 * 60,
    break: 10 * 60,
  },
  "untimed-rehearsal": {
    "rw-1": 24 * 60 * 60,
    "rw-2": 24 * 60 * 60,
    "math-1": 24 * 60 * 60,
    "math-2": 24 * 60 * 60,
    break: 30,
  },
} as const

export function createMockAttempt(
  timingProfile: MockAttempt["timingProfile"],
  now = Date.now()
): MockAttempt {
  const moduleItemIds: Record<string, string[]> = {
    "rw-1": MOCK_FORM.rw.module1.map((i) => i.id),
    "math-1": MOCK_FORM.math.module1.map((i) => i.id),
  }
  const started = new Date(now).toISOString()
  const seconds = MOCK_TIMING[timingProfile]["rw-1"]
  return {
    id: `mock-${now}`,
    formVersion: FORM_VERSION,
    routingPolicy: ROUTING_POLICY,
    timingProfile,
    state: "in-progress",
    currentModule: "rw-1",
    startedAt: started,
    moduleStartedAt: started,
    moduleDeadlineAt: new Date(now + seconds * 1000).toISOString(),
    responses: {},
    submittedModules: [],
    moduleItemIds,
    lastSavedAt: started,
  }
}

export function ananntRoute(correct: number, total: number): MockBranch {
  if (total === 0) return "easier"
  return correct / total >= 0.625 ? "harder" : "easier"
}

export function moduleItems(attempt: MockAttempt, moduleId: MockModuleId) {
  if (moduleId === "rw-1") return MOCK_FORM.rw.module1
  if (moduleId === "math-1") return MOCK_FORM.math.module1
  if (moduleId === "rw-2") {
    const branch = attempt.rwBranch ?? "easier"
    return MOCK_FORM.rw.module2[branch]
  }
  const branch = attempt.mathBranch ?? "easier"
  return MOCK_FORM.math.module2[branch]
}

export function nextAfterSubmit(
  attempt: MockAttempt,
  moduleId: MockModuleId,
  correct: number,
  total: number,
  now = Date.now()
): MockAttempt {
  const next: MockAttempt = {
    ...attempt,
    submittedModules: [...attempt.submittedModules, moduleId],
    lastSavedAt: new Date(now).toISOString(),
    moduleDeadlineAt: undefined,
  }

  if (moduleId === "rw-1") {
    const branch = ananntRoute(correct, total)
    next.rwBranch = branch
    next.state = "between-modules"
    next.currentModule = "rw-2"
    next.moduleItemIds = {
      ...next.moduleItemIds,
      "rw-2": MOCK_FORM.rw.module2[branch].map((i) => i.id),
    }
    return startModule(next, "rw-2", now)
  }

  if (moduleId === "rw-2") {
    next.state = "break"
    next.currentModule = null
    next.breakEndsAt = new Date(now + MOCK_TIMING[attempt.timingProfile].break * 1000).toISOString()
    return next
  }

  if (moduleId === "math-1") {
    const branch = ananntRoute(correct, total)
    next.mathBranch = branch
    next.state = "between-modules"
    next.currentModule = "math-2"
    next.moduleItemIds = {
      ...next.moduleItemIds,
      "math-2": MOCK_FORM.math.module2[branch].map((i) => i.id),
    }
    return startModule(next, "math-2", now)
  }

  next.state = "submitted"
  next.currentModule = null
  next.completedAt = new Date(now).toISOString()
  return next
}

export function startModule(attempt: MockAttempt, moduleId: MockModuleId, now = Date.now()): MockAttempt {
  const seconds = MOCK_TIMING[attempt.timingProfile][moduleId]
  return {
    ...attempt,
    state: "in-progress",
    currentModule: moduleId,
    moduleStartedAt: new Date(now).toISOString(),
    moduleDeadlineAt: new Date(now + seconds * 1000).toISOString(),
    lastSavedAt: new Date(now).toISOString(),
  }
}

export function endBreak(attempt: MockAttempt, now = Date.now()): MockAttempt {
  return startModule({ ...attempt, breakEndsAt: undefined }, "math-1", now)
}

export function moduleOrder(): MockModuleId[] {
  return ["rw-1", "rw-2", "math-1", "math-2"]
}

export function remainingSeconds(deadlineIso?: string, now = Date.now()) {
  if (!deadlineIso) return 0
  return Math.max(0, Math.floor((new Date(deadlineIso).getTime() - now) / 1000))
}
