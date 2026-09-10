"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { DOMAINS } from "./curriculum"
import { applyAttempt, emptyMastery, ensureMasteryMap } from "./mastery"
import { generatePlan } from "./planner"
import { isCorrectAnswer, suggestErrorCategory } from "./scoring"
import { getItem } from "@/data/catalog"
import type {
  AccessibilitySettings,
  AttemptRecord,
  BluebookRecord,
  DiagnosticResult,
  DomainId,
  ErrorCategory,
  MockAttempt,
  PracticeMode,
  Profile,
  Role,
  StudentState,
} from "./types"
import { STORAGE_KEY } from "./types"

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function defaultState(): StudentState {
  return {
    version: 1,
    profile: null,
    orientationComplete: false,
    diagnostic: null,
    mastery: {},
    attempts: [],
    mistakes: [],
    lessonProgress: {},
    plan: null,
    mockAttempts: [],
    activeMockId: null,
    bluebookRecords: [],
    events: [],
    quarantinedItemIds: [],
    accessibility: {
      largerText: false,
      reduceMotion: false,
      extraTimePractice: false,
      highContrast: false,
    },
    role: "student",
    completedTaskIds: [],
  }
}

function loadState(): StudentState {
  if (typeof window === "undefined") return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as StudentState
    if (parsed.version !== 1) return defaultState()
    return { ...defaultState(), ...parsed, mastery: ensureMasteryMap(parsed.mastery ?? {}) }
  } catch {
    return defaultState()
  }
}

type Store = {
  state: StudentState
  hydrated: boolean
  error: string | null
  setProfile: (profile: Profile) => void
  completeOrientation: () => void
  completeDiagnostic: (answers: Record<string, string>, itemIds: string[]) => void
  recordAttempt: (input: {
    itemId: string
    answer: string
    correct: boolean
    hinted: boolean
    solutionRevealed: boolean
    hintLevel: 0 | 1 | 2 | 3
    timeMs: number
    mode: PracticeMode
    sessionId: string
    confidence?: AttemptRecord["confidence"]
  }) => void
  tagMistake: (mistakeId: string, category: ErrorCategory) => void
  resolveMistake: (mistakeId: string, retestItemId: string) => void
  saveLessonProgress: (lessonId: string, step: number, completed?: boolean) => void
  rebuildPlan: () => void
  completeTask: (taskId: string) => void
  setRole: (role: Role) => void
  setAccessibility: (patch: Partial<AccessibilitySettings>) => void
  saveMock: (attempt: MockAttempt) => void
  addBluebook: (record: Omit<BluebookRecord, "id">) => void
  quarantine: (itemId: string) => void
  resetAll: () => void
  track: (name: string, payload?: Record<string, string | number | boolean>) => void
}

const Ctx = createContext<Store | null>(null)

export function StudentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudentState>(defaultState)
  const [hydrated, setHydrated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setState(loadState())
    } catch (e) {
      setError("Could not read saved progress on this device.")
      console.error(e)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      setError("Could not save progress. Check that this browser allows local storage.")
    }
  }, [state, hydrated])

  const update = useCallback((fn: (s: StudentState) => StudentState) => {
    setState((s) => fn(s))
  }, [])

  const store = useMemo<Store>(() => {
    return {
      state,
      hydrated,
      error,
      setProfile: (profile) =>
        update((s) => {
          const next = { ...s, profile }
          next.plan = generatePlan(next)
          next.events = [
            ...s.events,
            { name: "onboarding_completed", at: new Date().toISOString(), payload: { track: profile.track } },
          ]
          return next
        }),
      completeOrientation: () =>
        update((s) => ({
          ...s,
          orientationComplete: true,
          events: [...s.events, { name: "orientation_completed", at: new Date().toISOString() }],
        })),
      completeDiagnostic: (answers, itemIds) =>
        update((s) => {
          const domainEvidence = {} as DiagnosticResult["domainEvidence"]
          for (const id of Object.keys(DOMAINS) as DomainId[]) {
            const items = itemIds
              .map((i) => getItem(i))
              .filter((it): it is NonNullable<ReturnType<typeof getItem>> => it != null && it.domain === id)
            const total = items.length
            const realCorrect = items.filter((it) => answers[it.id] && isCorrectAnswer(it, answers[it.id])).length
            const ratio = total === 0 ? 0 : realCorrect / total
            const band: DiagnosticResult["domainEvidence"][DomainId]["band"] =
              total === 0 ? "untested" : ratio < 0.4 ? "needs-support" : ratio < 0.75 ? "mixed" : "likely-ready"
            domainEvidence[id] = { correct: realCorrect, total, band }
          }
          const placement: DiagnosticResult["placement"] = {}
          for (const [domain, ev] of Object.entries(domainEvidence)) {
            placement[domain] =
              ev.band === "needs-support" ? "foundation" : ev.band === "likely-ready" ? "stretch" : ev.band === "mixed" ? "core" : "unknown"
          }
          const diagnostic: DiagnosticResult = {
            completedAt: new Date().toISOString(),
            itemIds,
            answers,
            domainEvidence,
            placement,
          }
          const next: StudentState = {
            ...s,
            diagnostic,
            events: [...s.events, { name: "diagnostic_completed", at: new Date().toISOString() }],
          }
          next.plan = generatePlan(next)
          return next
        }),
      recordAttempt: (input) =>
        update((s) => {
          const item = getItem(input.itemId)
          if (!item) return s
          const attempt: AttemptRecord = {
            id: uid("att"),
            itemId: item.id,
            familyId: item.familyId,
            skillId: item.skillId,
            unitId: item.unitId,
            answer: input.answer,
            correct: input.correct,
            hinted: input.hinted,
            solutionRevealed: input.solutionRevealed,
            hintLevel: input.hintLevel,
            timeMs: input.timeMs,
            mode: input.mode,
            timestamp: new Date().toISOString(),
            confidence: input.confidence,
            sessionId: input.sessionId,
          }
          const mastery = ensureMasteryMap(s.mastery)
          const rec = applyAttempt(mastery[item.skillId] ?? emptyMastery(item.skillId), attempt)
          mastery[item.skillId] = rec
          const mistakes = [...s.mistakes]
          if (!attempt.correct || (attempt.timeMs > 90_000 && attempt.correct)) {
            mistakes.unshift({
              id: uid("mis"),
              attemptId: attempt.id,
              itemId: item.id,
              skillId: item.skillId,
              unitId: item.unitId,
              studentAnswer: attempt.answer,
              correctAnswer: item.format === "mcq" ? item.correctChoiceId ?? "" : String(item.numeric?.accepted[0] ?? ""),
              autoSuggestion: suggestErrorCategory(
                item,
                input.mode === "timed-mini" || input.mode === "full-mock" || input.mode === "section-module"
              ),
              resolved: false,
              createdAt: attempt.timestamp,
              slowCorrect: attempt.correct && attempt.timeMs > 90_000,
            })
          }
          return {
            ...s,
            attempts: [attempt, ...s.attempts].slice(0, 2000),
            mistakes: mistakes.slice(0, 400),
            mastery,
            events: [
              ...s.events,
              {
                name: input.mode.startsWith("lesson") ? "lesson_check_submitted" : "independent_response_saved",
                at: attempt.timestamp,
                payload: { itemId: item.id, correct: attempt.correct, hinted: attempt.hinted },
              },
            ],
          }
        }),
      tagMistake: (mistakeId, category) =>
        update((s) => ({
          ...s,
          mistakes: s.mistakes.map((m) => (m.id === mistakeId ? { ...m, category } : m)),
        })),
      resolveMistake: (mistakeId, retestItemId) =>
        update((s) => ({
          ...s,
          mistakes: s.mistakes.map((m) =>
            m.id === mistakeId ? { ...m, resolved: true, resolvedAt: new Date().toISOString(), retestItemId } : m
          ),
        })),
      saveLessonProgress: (lessonId, step, completed) =>
        update((s) => ({
          ...s,
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: {
              lessonId,
              step,
              completed: Boolean(completed || s.lessonProgress[lessonId]?.completed),
              completedAt: completed ? new Date().toISOString() : s.lessonProgress[lessonId]?.completedAt,
            },
          },
        })),
      rebuildPlan: () => update((s) => ({ ...s, plan: generatePlan(s) })),
      completeTask: (taskId) =>
        update((s) => ({
          ...s,
          completedTaskIds: s.completedTaskIds.includes(taskId) ? s.completedTaskIds : [...s.completedTaskIds, taskId],
        })),
      setRole: (role) => update((s) => ({ ...s, role })),
      setAccessibility: (patch) =>
        update((s) => ({ ...s, accessibility: { ...s.accessibility, ...patch } })),
      saveMock: (attempt) =>
        update((s) => {
          const exists = s.mockAttempts.some((m) => m.id === attempt.id)
          return {
            ...s,
            activeMockId: attempt.state === "submitted" ? null : attempt.id,
            mockAttempts: exists
              ? s.mockAttempts.map((m) => (m.id === attempt.id ? attempt : m))
              : [attempt, ...s.mockAttempts],
          }
        }),
      addBluebook: (record) =>
        update((s) => ({
          ...s,
          bluebookRecords: [{ ...record, id: uid("bb") }, ...s.bluebookRecords],
        })),
      quarantine: (itemId) =>
        update((s) => ({
          ...s,
          quarantinedItemIds: s.quarantinedItemIds.includes(itemId)
            ? s.quarantinedItemIds
            : [...s.quarantinedItemIds, itemId],
        })),
      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY)
        setState(defaultState())
      },
      track: (name, payload) =>
        update((s) => ({
          ...s,
          events: [...s.events, { name, at: new Date().toISOString(), payload }],
        })),
    }
  }, [state, hydrated, error, update])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStudent() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useStudent must be used within StudentProvider")
  return ctx
}
