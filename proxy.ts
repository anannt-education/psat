import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  GATED_PREFIXES,
  SESSION_COOKIE,
  gateHref,
  isPublicLessonPath,
} from "@/lib/mount";

function unitFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "learn") return parts[1] ?? "";
  return parts[0] ?? "";
}

function isGated(pathname: string) {
  if (GATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  if (pathname.startsWith("/learn/") && !isPublicLessonPath(pathname)) {
    return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.next();
  }
  if (!isGated(pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(gateHref(unitFromPath(pathname)));
}

export const config = {
  matcher: [
    "/onboard",
    "/onboard/:path*",
    "/practice",
    "/practice/:path*",
    "/mocks",
    "/mocks/:path*",
    "/today",
    "/today/:path*",
    "/parent",
    "/parent/:path*",
    "/mentor",
    "/mentor/:path*",
    "/progress",
    "/progress/:path*",
    "/mistakes",
    "/mistakes/:path*",
    "/orient",
    "/orient/:path*",
    "/learn/:path*",
  ],
};
