"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MentorNote } from "@/components/mentor-note"
import { useStudent } from "@/lib/storage"
import { TEMPLATES } from "@/lib/planner"
import type { Grade, PlannerTemplate, Profile, Track } from "@/lib/types"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const NEEDS = [
  "I lose marks on reading even when I understand the passage.",
  "Algebra feels shaky; I want foundations first.",
  "I know the material until the clock starts.",
  "English is not the language I think in.",
  "I have limited weekly time.",
]

export default function OnboardPage() {
  const { setProfile, state, hydrated } = useStudent()
  const router = useRouter()
  const [name, setName] = useState(state.profile?.displayName ?? "")
  const [track, setTrack] = useState<Track>(state.profile?.track ?? "psat-nmsqt")
  const [grade, setGrade] = useState<Grade>(state.profile?.grade ?? "10")
  const [window, setWindow] = useState(state.profile?.targetWindow ?? "")
  const [unknown, setUnknown] = useState(state.profile?.targetUnknown ?? false)
  const [minutes, setMinutes] = useState(String(state.profile?.weeklyMinutes ?? 180))
  const [days, setDays] = useState<string[]>(state.profile?.daysAvailable ?? ["Mon", "Wed", "Fri"])
  const [tz, setTz] = useState(state.profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [template, setTemplate] = useState<PlannerTemplate>(state.profile?.plannerTemplate ?? "12")
  const [prevTotal, setPrevTotal] = useState("")
  const [needs, setNeeds] = useState<string[]>([])
  const [lang, setLang] = useState("None — I am comfortable in the test language")
  const [error, setError] = useState<string | null>(null)

  if (!hydrated) {
    return <p className="text-sm text-muted-foreground">Loading your saved profile…</p>
  }

  function toggleDay(d: string) {
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]))
  }

  function submit() {
    if (!name.trim()) {
      setError("Add a display name so Today can greet you. It stays on this device.")
      return
    }
    if (days.length === 0) {
      setError("Pick at least one study day so the planner can date sessions.")
      return
    }
    const weekly = Number(minutes)
    if (!Number.isFinite(weekly) || weekly < 30) {
      setError("Weekly availability should be at least 30 minutes.")
      return
    }
    const profile: Profile = {
      displayName: name.trim(),
      track,
      grade,
      targetWindow: unknown ? "Date not yet known" : window.trim() || "Date not yet known",
      targetUnknown: unknown || !window.trim(),
      weeklyMinutes: weekly,
      daysAvailable: days,
      timezone: tz,
      plannerTemplate: template,
      needs,
      studyLanguageSupport: lang,
    }
    const total = Number(prevTotal)
    if (prevTotal && Number.isFinite(total)) {
      profile.previousScore = { total, source: "self-reported" }
    }
    setProfile(profile)
    router.push("/orient")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Anannt Education</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Set up your PSAT path</h1>
        <p className="mt-2 text-muted-foreground">
          Guided, mastery-based prep for PSAT/NMSQT and PSAT 10, written by Anannt Education. The promise is simple:
          understand what you are learning, know what to do next, and practise until you can apply it independently.
          Nothing here is stored on a server — progress stays in this browser.
        </p>
      </div>

      <MentorNote>
        Tell us the sitting you are aiming at and how many minutes you actually have. We will not infer skill from your
        school board. After this, a short orientation and a 28-item screening — not a mock exam — decide where to start.
      </MentorNote>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Check this field</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assessment track</CardTitle>
          <CardDescription>
            Instruction is shared. Reporting, exam guidance, and National Merit context are not. PSAT 8/9 is out of this
            release.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={track} onValueChange={(v) => setTrack(v as Track)}>
            <label className="flex items-start gap-3 rounded-lg border p-3">
              <RadioGroupItem value="psat-nmsqt" />
              <span>
                <span className="font-medium">PSAT/NMSQT</span>
                <span className="block text-sm text-muted-foreground">
                  Official scale 320–1520 (sections 160–760). National Merit information appears only in Help, with
                  dated official links and no eligibility guarantee.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border p-3">
              <RadioGroupItem value="psat-10" />
              <span>
                <span className="font-medium">PSAT 10</span>
                <span className="block text-sm text-muted-foreground">
                  Same score scale and shared core lessons. Distinct onboarding and reports — no National Merit
                  counselling in this track.
                </span>
              </span>
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>You and your calendar</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should Today greet you?" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="grade">Grade</Label>
            <select
              id="grade"
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade)}
            >
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
            </select>
            <p className="text-xs text-muted-foreground">
              We do not infer skill from school board or nationality. Grade only helps date the typical sitting.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="window">Target test window</Label>
            <Input
              id="window"
              value={window}
              onChange={(e) => setWindow(e.target.value)}
              placeholder="e.g. October 2026, or spring of Grade 10"
              disabled={unknown}
            />
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={unknown} onCheckedChange={(v) => setUnknown(Boolean(v))} />
              I do not know the date yet — that is allowed
            </label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mins">Weekly study minutes</Label>
            <Input id="mins" type="number" min={30} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Days you can usually study</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <label key={d} className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
                  <Checkbox checked={days.includes(d)} onCheckedChange={() => toggleDay(d)} />
                  {d}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tz">Timezone</Label>
            <Input id="tz" value={tz} onChange={(e) => setTz(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planner template</CardTitle>
          <CardDescription>Templates schedule work. They are not promises that every student finishes in that period.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={template} onValueChange={(v) => setTemplate(v as PlannerTemplate)} className="gap-3">
            {(Object.keys(TEMPLATES) as PlannerTemplate[]).map((k) => (
              <label key={k} className="flex items-start gap-3 rounded-lg border p-3">
                <RadioGroupItem value={k} />
                <span>
                  <span className="font-medium">{TEMPLATES[k].label}</span>
                  <span className="block text-sm text-muted-foreground">{TEMPLATES[k].description}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optional context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="prev">Previous PSAT total, if you have one (self-reported)</Label>
            <Input
              id="prev"
              inputMode="numeric"
              value={prevTotal}
              onChange={(e) => setPrevTotal(e.target.value)}
              placeholder="Leave blank if none — never mixed with Anannt mock results"
            />
          </div>
          <div className="grid gap-2">
            <Label>What do you want help with?</Label>
            {NEEDS.map((n) => (
              <label key={n} className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={needs.includes(n)}
                  onCheckedChange={(v) =>
                    setNeeds((cur) => (v ? [...cur, n] : cur.filter((x) => x !== n)))
                  }
                  className="mt-0.5"
                />
                {n}
              </label>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lang">Language support</Label>
            <Textarea id="lang" value={lang} onChange={(e) => setLang(e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Button size="lg" onClick={submit}>
        Continue to orientation
      </Button>
    </div>
  )
}
