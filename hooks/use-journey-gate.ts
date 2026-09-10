"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useStudent } from "@/lib/storage"

const OPEN_EXACT = new Set(["/", "/method", "/for-families", "/help", "/learn", "/diagnostic"])
const PUBLIC_LESSONS = new Set(["/learn/M2/M2-L1", "/learn/RW1/RW1-L1"])

function isOpen(pathname: string) {
  if (OPEN_EXACT.has(pathname)) return true
  if (PUBLIC_LESSONS.has(pathname)) return true
  return false
}

/** Client companion to proxy.ts. Gated routes also redirect at the network boundary. */
export function useJourneyGate() {
  const { state, hydrated } = useStudent()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return
    if (isOpen(pathname)) return
  }, [hydrated, state.profile, pathname, router])

  return { hydrated, state }
}
