"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useStudent } from "@/lib/storage"
import { CONTENT_REVIEW_DATE } from "@/lib/types"

export default function HelpPage() {
  const { state, addBluebook, hydrated } = useStudent()
  const nmsqt = state.profile?.track !== "psat-10"
  const [testName, setTestName] = useState("Bluebook full PSAT practice")
  const [total, setTotal] = useState("")
  const [notes, setNotes] = useState("")

  if (!hydrated) return <p className="text-muted-foreground">Loading help…</p>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Help</h1>
        <p className="mt-2 text-muted-foreground">
          Accessibility, official Bluebook practice, test-day logistics, and careful National Merit context. Academic
          facts last reviewed {CONTENT_REVIEW_DATE}. Check current College Board guides before every sitting. Anannt
          Education authors this guidance; we are not affiliated with the College Board.
        </p>
      </div>

      <section id="accessibility" className="space-y-3">
        <h2 className="text-xl font-medium">Accessibility</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use Account controls for larger text, reduced motion, stronger contrast, and extra time in Anannt practice.
          Timing adaptations are available for practice and are labelled in mock results. They are not formal College
          Board accommodation approval. Keyboard: tab through questions, native form controls, skip-to-content on each
          page. Diagrams include text alternatives. Mastery is never colour alone — chips have words.
        </p>
      </section>

      <section id="bluebook" className="space-y-3">
        <h2 className="text-xl font-medium">Official Bluebook practice</h2>
        <p className="text-sm leading-relaxed">
          Practise in College Board’s Bluebook, then record a self-reported result here. Anannt does not assume an API
          exists and will not collect College Board credentials.
        </p>
        <Button render={<a href="https://bluebook.collegeboard.org/students/practice" target="_blank" rel="noreferrer" />}>
          Open Bluebook practice (outbound)
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Record a self-reported official-practice result</CardTitle>
            <CardDescription>Tagged self-reported, with date. Never mixed with Anannt mock outcomes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="tn">What you sat</Label>
              <Input id="tn" value={testName} onChange={(e) => setTestName(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="tot">Self-reported total (optional)</Label>
              <Input id="tot" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Do not invent a number" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="nt">Notes</Label>
              <Textarea id="nt" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button
              onClick={() => {
                addBluebook({
                  date: new Date().toISOString(),
                  testName,
                  selfReportedTotal: total ? Number(total) : undefined,
                  notes,
                })
                setNotes("")
              }
            }
            >
              Save on this device
            </Button>
            {state.bluebookRecords.map((r) => (
              <p key={r.id} className="text-sm text-muted-foreground">
                {new Date(r.date).toLocaleDateString()} · {r.testName}
                {r.selfReportedTotal ? ` · self-reported ${r.selfReportedTotal}` : ""} — {r.notes}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="test-day" className="space-y-3">
        <h2 className="text-xl font-medium">Test-day checklist</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Confirm the exact product you are sitting (PSAT/NMSQT vs PSAT 10) with your school, not only this app.</li>
          <li>Complete at least one official Bluebook practice so the tools are not new on the day.</li>
          <li>Know the two-module structure, the 10-minute break, and that you cannot return to a submitted module.</li>
          <li>Charge the allowed device; follow school rules for calculators and reference use.</li>
          <li>Do not cram a new Anannt unit the night before. Retrieve weak skills, then stop.</li>
          <li>This checklist is practical rehearsal, not a guarantee of performance.</li>
        </ul>
      </section>

      <section id="nmsqt" className="space-y-3">
        <h2 className="text-xl font-medium">National Merit information</h2>
        {nmsqt ? (
          <Alert>
            <AlertTitle>NMSQT track only · dated {CONTENT_REVIEW_DATE}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                National Merit scholarship programmes use PSAT/NMSQT as an entry vehicle. Eligibility involves more than
                a practice score, particularly for students outside the United States. Completing Anannt lessons does not
                make you a National Merit entrant, semi-finalist, or scholar.
              </p>
              <p>
                We do not publish cutoffs, because they change by year and state, and because this product has no
                validated score estimator. Read the current student guide and entry-year materials:
              </p>
              <p>
                <a
                  className="underline"
                  href="https://satsuite.collegeboard.org/media/pdf/psat-nmsqt-student-guide.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  PSAT/NMSQT Student Guide (PDF)
                </a>
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            You are on the PSAT 10 track. National Merit counselling is not shown here. Switch tracks in onboarding only
            if you are actually sitting the NMSQT.
          </p>
        )}
      </section>

      <Accordion>
        <AccordionItem value="mastery">
          <AccordionTrigger>How mastery states work</AccordionTrigger>
          <AccordionContent>
            Unknown, Learning, Practising, Provisionally secure, Retained, Needs refresh. Provisional security asks for
            at least 10 first-attempt unhinted responses across two sessions, 80%+ correct, more than one item family.
            Retention is a later check at least seven days later. Hinted attempts cannot satisfy independent mastery.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ai">
          <AccordionTrigger>Where is the AI tutor?</AccordionTrigger>
          <AccordionContent>
            The PRD launches AI tutoring only after lessons work without it. This slice uses approved hint ladders
            inside questions. There is no chat that can change keys, invent official rules, or declare scholarship
            eligibility. Assessment assistance is off during mocks.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
