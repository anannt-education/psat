"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { StudentProvider } from "@/lib/storage"
import { ThemeProvider } from "next-themes"
import { AppShell } from "@/components/app-shell"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <StudentProvider>
        <TooltipProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </TooltipProvider>
      </StudentProvider>
    </ThemeProvider>
  )
}
