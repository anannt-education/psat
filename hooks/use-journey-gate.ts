"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useStudent } from "@/lib/storage"
import { gateUrl, isGatedPath, unitForGate } from "@/lib/mount"

export function useJourneyGate() {
  const { state, hydrated } = useStudent()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return
    if (isGatedPath(pathname)) {
      window.location.assign(gateUrl(unitForGate(pathname)))
    }
  }, [hydrated, pathname])

  return { hydrated, state }
}
