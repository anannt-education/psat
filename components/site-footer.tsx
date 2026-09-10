import Link from "next/link"
import { BRAND } from "@/lib/brand"
import { SAT_MENTORING_URL } from "@/lib/gate"

export const LEGAL_LINES = [
  "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.",
  "PSAT/NMSQT® is a registered trademark of the College Board and the National Merit Scholarship Corporation, which are not affiliated with, and does not endorse, this website.",
  "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.",
] as const

export const NAP =
  "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae"

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/method", label: "How we teach" },
  { href: "/for-families", label: "For families" },
  { href: "/learn", label: "Curriculum map" },
  { href: "/diagnostic", label: "Domain screening" },
  { href: "/help", label: "Help" },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-sidebar/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-heading text-base font-semibold">{BRAND.name}</p>
          <p className="text-sm text-muted-foreground">
            {BRAND.product} for {BRAND.exams}. SAT feeder — not an AP path.
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{BRAND.disclaimer}</p>
          {LEGAL_LINES.map((line) => (
            <p key={line.slice(0, 24)} className="text-xs leading-relaxed text-muted-foreground">
              {line}
            </p>
          ))}
          <p className="text-xs text-muted-foreground">{NAP}</p>
          <a
            href={SAT_MENTORING_URL}
            className="inline-block text-xs underline underline-offset-2"
          >
            Digital SAT mentoring
          </a>
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
          </ul>
        </nav>
      </div>
    </footer>
  )
}
