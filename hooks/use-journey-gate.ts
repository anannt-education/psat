"use client"

import { usePathname } from "next/navigation"
import { useStudent } from "@/lib/storage"

export function useJourneyGate() {
  const { state, hydrated } = useStudent()
  const pathname = usePathname()
  return { hydrated, state, pathname }
}
