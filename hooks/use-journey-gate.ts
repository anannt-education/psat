"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useStudent } from "@/lib/storage"

const OPEN_EXACT = new Set(["/", "/method", "/for-families", "/faq", "/privacy", "/diagnostic", "/learn"])

function isOpen(pathname: string) {
  if (OPEN_EXACT.has(pathname)) return true
  if (pathname === "/learn/RW0/RW0-L1" || pathname === "/learn/M2/M2-L1") return true
  return false
}

export function useJourneyGate() {
  const { state, hydrated } = useStudent()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return
    if (isOpen(pathname)) return
    if (!state.profile) {
      return
    }
    if (!state.orientationComplete && pathname !== "/orient") {
      router.replace("/orient")
      return
    }
    if (state.orientationComplete && !state.diagnostic && pathname === "/today") {
      router.replace("/diagnostic")
    }
  }, [hydrated, state.profile, state.orientationComplete, state.diagnostic, pathname, router])

  return { hydrated, state }
}
