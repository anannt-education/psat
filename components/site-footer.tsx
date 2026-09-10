import Link from "next/link"
import { BRAND } from "@/lib/brand"
import { LEGAL, PUBLIC_LESSONS, SAT_MENTORING_URL, gateHref } from "@/lib/mount"

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/method", label: "How we teach" },
  { href: "/for-families", label: "For families" },
  { href: PUBLIC_LESSONS[0].path, label: "Lesson 1 · slope" },
  { href: PUBLIC_LESSONS[1].path, label: "Lesson 2 · some vs all" },
  { href: "/help", label: "Help" },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-[#0F245C] text-[#F4EFE4]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-heading text-base font-semibold">{BRAND.name}</p>
          <p className="text-sm text-white/80">{BRAND.product} — SAT feeder on study.anannt.ae.</p>
          <p className="text-xs leading-relaxed text-white/75">{BRAND.disclaimer}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/80 underline-offset-2 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={SAT_MENTORING_URL}
                className="text-white/80 underline-offset-2 hover:text-white hover:underline"
              >
                Digital SAT mentoring
              </a>
            </li>
            <li>
              <a
                href={gateHref("")}
                className="text-white/80 underline-offset-2 hover:text-white hover:underline"
              >
                After two lessons
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-5xl space-y-2 px-4 pb-6 text-xs leading-relaxed text-white/75">
        <p>{LEGAL.psat}</p>
        <p>{LEGAL.ap}</p>
        <p>{LEGAL.supplement}</p>
        <p>{LEGAL.nap}</p>
      </div>
    </footer>
  )
}
