import Link from "next/link"
import { BRAND } from "@/lib/brand"

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
          <p className="text-sm text-muted-foreground">{BRAND.product} for {BRAND.exams}.</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{BRAND.disclaimer}</p>
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
