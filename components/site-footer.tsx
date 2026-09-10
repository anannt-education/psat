import Link from "next/link"
import { BRAND } from "@/lib/brand"
import { FOOTER_AP, FOOTER_PSAT, FOOTER_STUDIO, NAP, PUBLIC_LESSONS, SAT_COACHING_URL } from "@/lib/mount"

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/method", label: "How we teach" },
  { href: "/for-families", label: "For families" },
  { href: PUBLIC_LESSONS[0].path, label: "Lesson 1 · slope" },
  { href: PUBLIC_LESSONS[1].path, label: "Lesson 2 · some vs all" },
  { href: "/diagnostic", label: "Diagnostic start" },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-sidebar/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-heading text-base font-semibold">{BRAND.name}</p>
          <p className="text-sm text-muted-foreground">
            {BRAND.product} is a SAT feeder for {BRAND.exams} — not an AP course.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{BRAND.disclaimer}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{FOOTER_AP}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{FOOTER_PSAT}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{FOOTER_STUDIO}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{NAP}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SAT_COACHING_URL}
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Digital SAT mentoring
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
