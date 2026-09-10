import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STUDY_ORIGIN = "https://study.anannt.ae";
const SUBJECT = "psat";
const COOKIE = "anannt_study_session";
const PUBLIC_LESSON_PATHS = new Set(["/learn/M2/M2-L1", "/learn/RW1/RW1-L1"]);

function startUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT);
  url.searchParams.set("unit", unit);
  return url;
}

function isPublicPath(pathname: string) {
  if (pathname === "/" || pathname === "") return true;
  if (
    pathname === "/method" ||
    pathname === "/for-families" ||
    pathname === "/help" ||
    pathname === "/learn" ||
    pathname === "/diagnostic"
  ) {
    return true;
  }
  if (pathname.startsWith("/api/")) return true;
  if (PUBLIC_LESSON_PATHS.has(pathname)) return true;
  return false;
}

function unitFromPath(pathname: string) {
  const lesson = pathname.match(/^\/learn\/([^/]+)\/([^/]+)$/);
  if (lesson) return lesson[2];
  return pathname.replace(/^\//, "").split("/")[0] ?? "";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.nextUrl.searchParams.get("unlocked") === "1") {
    const res = NextResponse.next();
    res.cookies.set(COOKIE, "1", {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  if (isPublicPath(pathname)) return NextResponse.next();
  if (request.cookies.get(COOKIE)?.value) return NextResponse.next();
  return NextResponse.redirect(startUrl(unitFromPath(pathname)));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|sitemap.xml|robots.txt).*)",
  ],
};
