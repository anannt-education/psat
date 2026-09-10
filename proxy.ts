import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "anannt_session"
const SITE_ORIGIN = "https://study.anannt.ae"
const SUBJECT_SLUG = "psat"

const PUBLIC_EXACT = new Set([
  "/",
  "/method",
  "/faq",
  "/privacy",
  "/diagnostic",
  "/learn",
  "/for-families",
])

const PUBLIC_LESSONS = new Set(["/learn/RW0/RW0-L1", "/learn/M2/M2-L1"])

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true
  if (PUBLIC_LESSONS.has(pathname)) return true
  if (pathname.startsWith("/api/events")) return true
  if (pathname.startsWith("/api/keys")) return true
  if (pathname.startsWith("/opengraph-image")) return true
  if (pathname === "/icon" || pathname.startsWith("/icon/")) return true
  if (pathname.startsWith("/apple-icon")) return true
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true
  return false
}

function startUrl(unit = ""): string {
  const url = new URL(`${SITE_ORIGIN}/start`)
  url.searchParams.set("subject", SUBJECT_SLUG)
  url.searchParams.set("unit", unit)
  return url.toString()
}

function unitFromPath(pathname: string): string {
  if (pathname.startsWith("/learn/M2")) return "M2"
  if (pathname.startsWith("/learn/RW0")) return "RW0"
  if (pathname.startsWith("/practice")) return "practice"
  if (pathname.startsWith("/mock")) return "mock"
  return ""
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isPublic(pathname)) return NextResponse.next()

  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (session) return NextResponse.next()

  return NextResponse.redirect(startUrl(unitFromPath(pathname)))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)", "/"],
}
