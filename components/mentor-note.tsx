import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

export function MentorNote({
  title,
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <aside
      className={cn(
        "border-l-2 border-primary/40 bg-secondary/40 px-4 py-3 text-sm leading-relaxed",
        className
      )}
      aria-label={BRAND.mentor}
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title ?? BRAND.mentor}</p>
      <div className="mt-1 text-foreground/90">{children}</div>
    </aside>
  )
}
