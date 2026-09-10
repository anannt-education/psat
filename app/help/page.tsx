"use client"

import { Button } from "@/components/ui/button"
import { SAT_COACHING_URL, whatsappUrl } from "@/lib/mount"

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Help</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          This PSAT path is a SAT feeder. After two public lessons, the only human next step we
          offer is Digital SAT mentoring — never an AP package.
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-medium">Accessibility</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use Account controls for larger text, reduced motion, and stronger contrast. Keyboard: tab
          through questions and skip-to-content on each page. Diagrams include text alternatives.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-medium">Digital SAT mentoring</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Official College Board digital practice stays outbound. Anannt never collects College Board
          credentials. If you want a person after two lessons, we sit in Burjuman for SAT coaching.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button render={<a href={SAT_COACHING_URL} />}>Open Digital SAT mentoring</Button>
          <Button variant="outline" render={<a href={whatsappUrl("sat-mentoring")} />}>
            WhatsApp Burjuman
          </Button>
        </div>
      </section>
    </div>
  )
}
