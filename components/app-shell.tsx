"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  LineChart,
  Menu,
  Repeat,
  Timer,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SiteFooter } from "@/components/site-footer"
import { useStudent } from "@/lib/storage"
import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: ClipboardList },
  { href: "/mistakes", label: "Review Mistakes", icon: Repeat },
  { href: "/mocks", label: "Mock Tests", icon: Timer },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/help", label: "Help", icon: CircleHelp },
]

const MARKETING = new Set(["/", "/method", "/for-families"])

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { state, hydrated } = useStudent()
  const [open, setOpen] = useState(false)

  const ready = hydrated
  const showNav = ready && Boolean(state.profile)
  const isMarketing = MARKETING.has(pathname)

  const links = useMemo(() => {
    const extra =
      state.role === "mentor"
        ? [{ href: "/mentor", label: "Mentor queue", icon: UserRound }]
        : state.role === "parent"
          ? [{ href: "/parent", label: "Family summary", icon: UserRound }]
          : []
    return [...NAV, ...extra]
  }, [state.role])

  return (
    <div
      className={cn(
        "flex min-h-full flex-col bg-background text-foreground",
        state.accessibility.largerText && "text-[17px]",
        state.accessibility.highContrast && "contrast-125",
        state.accessibility.reduceMotion && "motion-reduce:transition-none"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {isMarketing ? (
        <MarketingChrome pathname={pathname} showResume={showNav} />
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
            <Link href="/" className="mb-6 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <p className="font-heading text-lg font-semibold tracking-tight">{BRAND.name}</p>
              <p className="text-xs text-muted-foreground">PSAT/NMSQT · PSAT 10</p>
            </Link>
            <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
              {showNav &&
                links.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/")
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70"
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  )
                })}
              {!showNav &&
                [
                  { href: "/method", label: "How we teach" },
                  { href: "/for-families", label: "For families" },
                  { href: "/learn", label: "Curriculum map" },
                  { href: "/onboard", label: "Start the path" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>
            <AccountMenu />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/90 px-3 py-2 backdrop-blur md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
                  <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <SheetHeader>
                    <SheetTitle>{BRAND.name}</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-4 flex flex-col gap-1 px-2" aria-label="Mobile">
                    {links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-2 py-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                    >
                      About this path
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <p className="font-heading font-semibold">{BRAND.shortName}</p>
              <AccountMenu compact />
            </header>
            <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-24 md:pb-10">
              {children}
            </main>
          </div>
        </div>
      )}

      {isMarketing && (
        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-12">
          {children}
        </main>
      )}

      <SiteFooter />

      {showNav && !isMarketing && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 md:hidden" aria-label="Primary">
          <div className="grid grid-cols-4 gap-0">
            {NAV.slice(0, 4).map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label.split(" ")[0]}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}

function MarketingChrome({ pathname, showResume }: { pathname: string; showResume: boolean }) {
  const items = [
    { href: "/method", label: "How we teach" },
    { href: "/for-families", label: "For families" },
    { href: "/learn", label: "Curriculum" },
  ]
  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <p className="font-heading text-lg font-semibold tracking-tight">{BRAND.name}</p>
          <p className="text-xs text-muted-foreground">{BRAND.exams}</p>
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex" aria-label="About this path">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <Button size="sm" render={<Link href={showResume ? "/today" : "/onboard"} />}>
          {showResume ? "Enter path" : "Start"}
        </Button>
      </div>
      <nav className="mx-auto flex w-full max-w-5xl gap-4 px-4 pb-3 text-sm md:hidden" aria-label="About this path">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function AccountMenu({ compact }: { compact?: boolean }) {
  const { state, setRole, setAccessibility, resetAll } = useStudent()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant={compact ? "ghost" : "outline"}
            size={compact ? "icon" : "sm"}
            aria-label="Account and accessibility"
          />
        }
      >
        <UserRound className="size-4" />
        {!compact && <span className="ml-1">{state.profile?.displayName ?? "Account"}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>View as</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setRole("student")}>Student {state.role === "student" ? "· current" : ""}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("mentor")}>Mentor exception queue</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("parent")}>Family summary</DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="space-y-3 px-2 py-2">
          <p className="text-xs font-medium">Accessibility</p>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="lg">Larger text</Label>
            <Switch
              id="lg"
              checked={state.accessibility.largerText}
              onCheckedChange={(v) => setAccessibility({ largerText: Boolean(v) })}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="rm">Reduce motion</Label>
            <Switch
              id="rm"
              checked={state.accessibility.reduceMotion}
              onCheckedChange={(v) => setAccessibility({ reduceMotion: Boolean(v) })}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="et">Extra time in practice</Label>
            <Switch
              id="et"
              checked={state.accessibility.extraTimePractice}
              onCheckedChange={(v) => setAccessibility({ extraTimePractice: Boolean(v) })}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="hc">Stronger contrast</Label>
            <Switch
              id="hc"
              checked={state.accessibility.highContrast}
              onCheckedChange={(v) => setAccessibility({ highContrast: Boolean(v) })}
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/help">Help and Bluebook</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/method">How Anannt Education teaches</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/for-families">For families</Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => resetAll()}>
          Reset this device’s demo data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { Separator }
