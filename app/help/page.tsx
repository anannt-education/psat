"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SAT_MENTORING_URL } from "@/lib/gate"

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Help</h1>
        <p className="mt-2 text-muted-foreground">
          Accessibility and practical test-day notes for PSAT 10 and PSAT/NMSQT. Official digital practice is
          outbound on College Board’s site. If you want a human after two lessons, that path is Digital SAT mentoring
          — never an AP upsell.
        </p>
      </div>

      <section id="accessibility" className="space-y-3">
        <h2 className="text-xl font-medium">Accessibility</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use account controls for larger text, reduced motion, stronger contrast, and extra time in Anannt practice.
          Timing adaptations are labelled in mock results. They are not formal College Board accommodation approval.
          Keyboard: tab through questions, native form controls, skip-to-content on each page. Diagrams include text
          alternatives. Mastery is never colour alone — chips have words.
        </p>
      </section>

      <section id="test-day" className="space-y-3">
        <h2 className="text-xl font-medium">Test-day checklist</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Confirm the exact product you are sitting (PSAT/NMSQT vs PSAT 10) with your school, not only this app.</li>
          <li>Complete at least one official College Board digital practice so the tools are not new on the day.</li>
          <li>Know the two-module structure, the 10-minute break, and that you cannot return to a submitted module.</li>
          <li>Charge the allowed device; follow school rules for calculators and reference use.</li>
          <li>Do not cram a new Anannt unit the night before. Retrieve weak skills, then stop.</li>
        </ul>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Want a human later?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          After two honest lessons, the study desk asks for email and a parent WhatsApp. Mentoring from there is
          Digital SAT only.{" "}
          <a className="underline underline-offset-2" href={SAT_MENTORING_URL}>
            SAT coaching in Dubai
          </a>
          .
        </CardContent>
      </Card>

      <Accordion>
        <AccordionItem value="mastery">
          <AccordionTrigger>How mastery states work</AccordionTrigger>
          <AccordionContent>
            Unknown, Learning, Practising, Provisionally secure, Retained, Needs refresh. Provisional security asks for
            at least 10 first-attempt unhinted responses across two sessions. Hinted attempts cannot satisfy independent
            mastery.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
