import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PUBLIC_LESSONS, SAT_MENTORING_URL, gateHref } from "@/lib/mount"

export function ContinueToPath() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="lg" render={<Link href={PUBLIC_LESSONS[0].path} />}>
        Start lesson 1 — free, no account
      </Button>
      <Button size="lg" variant="outline" render={<Link href={PUBLIC_LESSONS[1].path} />}>
        Open lesson 2 · some vs all
      </Button>
      <Button size="lg" variant="ghost" render={<a href={SAT_MENTORING_URL} />}>
        Digital SAT mentoring
      </Button>
      <Button size="lg" variant="ghost" render={<a href={gateHref("")} />}>
        After two lessons
      </Button>
    </div>
  )
}
