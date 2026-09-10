/** Study host mount for PSAT. Keep this module isomorphic (no next/server). */

export const SUBJECT_SLUG = "psat";
export const BASE_PATH = "/psat";
export const SITE_ORIGIN = "https://study.anannt.ae";
export const SITE_URL = SITE_ORIGIN;
export const DEV_PORT = 43133;
export const SESSION_COOKIE = "anannt_session";
export const SAT_COACHING_URL = "https://anannt.ae/sat-coaching-dubai";

export const PUBLIC_LESSON_IDS = ["RW0-L1", "M2-L1"] as const;
export const PUBLIC_LESSON_PATHS = ["/learn/RW0/RW0-L1", "/learn/M2/M2-L1"] as const;

export const PUBLIC_LESSON_1 = {
  id: "RW0-L1",
  path: "/learn/RW0/RW0-L1",
  title: "Start the SAT preview",
  unit: "RW0",
} as const;

export const PUBLIC_LESSON_2 = {
  id: "M2-L1",
  path: "/learn/M2/M2-L1",
  title: "Slope in context",
  unit: "M2",
} as const;

export function absUrl(path = "/"): string {
  const normalized = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${BASE_PATH}${normalized}`;
}

export function startUrl(unit = ""): string {
  const url = new URL(`${SITE_ORIGIN}/start`);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function whatsappUrl(sku: string): string {
  const text = `Hi Anannt Burjuman — I started ${SUBJECT_SLUG} on study.anannt.ae and want help with ${sku}`;
  return `https://wa.me/971585853551?text=${encodeURIComponent(text)}`;
}

export function appPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}

export function isPublicLessonId(id: string): boolean {
  return (PUBLIC_LESSON_IDS as readonly string[]).includes(id);
}

export const FOOTER_AP =
  "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.";
export const FOOTER_PSAT =
  "PSAT/NMSQT® is a registered trademark of the College Board and the National Merit Scholarship Corporation, which are not affiliated with, and do not endorse, this website.";
export const FOOTER_STUDIO =
  "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.";
export const FOOTER_CONTACT =
  "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae";

export const EVENT_NAMES = [
  "diagnostic_start",
  "lesson2_complete",
  "otp_verified",
  "report_unlock",
  "wa_click",
  "demo_book",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

export const PUBLIC_SEO = {
  home: {
    path: "/",
    title: "PSAT/NMSQT · SAT preview path",
    description:
      "A short PSAT path into Digital SAT habits. Two public lessons, then mentoring on Digital SAT only. Not an AP course, and not a National Merit claim here.",
  },
  method: {
    path: "/method",
    title: "PSAT exam guide · SAT feeder",
    description:
      "How Anannt teaches PSAT/NMSQT and PSAT 10 as a Digital SAT preview. Two public lessons. Mentoring continues on Digital SAT in Dubai — never an AP upsell.",
  },
  faq: {
    path: "/faq",
    title: "PSAT FAQ · SAT preview only",
    description:
      "What this PSAT preview covers, which two lessons are public, and where mentoring goes (Digital SAT in Dubai). No AP upsell and no National Merit claims.",
  },
  privacy: {
    path: "/privacy",
    title: "PSAT privacy and local data",
    description:
      "How Anannt stores PSAT progress on this device, what we do not collect, and Burjuman contact details. No payment, no AP checkout, and no student-data sale.",
  },
  lesson1: {
    path: "/learn/RW0/RW0-L1",
    title: "Start the SAT preview · PSAT lesson 1",
    description:
      "Separate a writer’s claim from an example and name how sentences connect. Public PSAT lesson 1 — a Digital SAT preview, not an AP subject upsell in Dubai.",
  },
  lesson2: {
    path: "/learn/M2/M2-L1",
    title: "Slope in context · PSAT lesson 2",
    description:
      "Name rate versus start in a linear model such as C = 12 + 3d. Public PSAT lesson 2. Completing it opens Anannt’s mentor gate toward Digital SAT in Dubai.",
  },
  diagnostic: {
    path: "/diagnostic",
    title: "PSAT diagnostic · start the SAT preview",
    description:
      "Start the PSAT domain screening. Placement hints only — not a 320–1520. After you submit, continue on study.anannt.ae toward Digital SAT help in Dubai.",
  },
} as const;
