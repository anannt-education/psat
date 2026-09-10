/** Study host mount for PSAT/NMSQT. Catalog slug: psat. SAT feeder — never AP. */

export const STUDY_ORIGIN = "https://study.anannt.ae";
export const BASE_PATH = "/psat";
export const SUBJECT_SLUG = "psat";
export const SITE_URL = `${STUDY_ORIGIN}${BASE_PATH}`;

export const SAT_COACHING_URL = "https://anannt.ae/sat-coaching-dubai";

export const NAP =
  "Anannt Education · Office 105, Bank Street Building, Burjuman Metro Exit 2, Dubai · +971 58585 3551 · wecare@anannt.ae";

export const FOOTER_AP =
  "AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.";

export const FOOTER_PSAT =
  "PSAT/NMSQT® is a registered trademark of the College Board and the National Merit Scholarship Corporation, which are not affiliated with, and do not endorse, this website.";

export const FOOTER_STUDIO =
  "This studio is a self-study supplement. It does not predict an official AP score and is not Bluebook or AP Classroom.";

export const PUBLIC_LESSONS = [
  {
    id: "M2-L1",
    unitId: "M2",
    path: "/learn/M2/M2-L1",
    unit: "M2",
    title: "Slope in context: rate versus starting value",
    description:
      "Interpret slope as a rate and the intercept as a start in a linear model. Free PSAT math lesson from Anannt Education. A SAT feeder, not an AP course.",
  },
  {
    id: "RW1-L1",
    unitId: "RW1",
    path: "/learn/RW1/RW1-L1",
    unit: "RW1",
    title: "Central meaning and keeping the author’s scope",
    description:
      "Keep some, may, and not studied when you summarise a cautious claim. Free PSAT Reading lesson from Anannt Education in Dubai. A SAT feeder, not an AP course.",
  },
] as const;

export const PUBLIC_LESSON_IDS = PUBLIC_LESSONS.map((l) => l.id);

export const PUBLIC_PATHS = new Set<string>([
  "/",
  "/method",
  "/for-families",
  "/diagnostic",
  "/learn",
  ...PUBLIC_LESSONS.map((l) => l.path),
]);

const GATED_PREFIXES = [
  "/practice",
  "/mocks",
  "/parent",
  "/mentor",
  "/today",
  "/progress",
  "/onboard",
  "/orient",
  "/mistakes",
  "/help",
];

export function gateUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function whatsappUrl(sku = "sat-mentoring") {
  const text = `Hi Anannt Burjuman — I started ${SUBJECT_SLUG} on study.anannt.ae and want help with ${sku}`;
  return `https://wa.me/971585853551?text=${encodeURIComponent(text)}`;
}

export function normalizePath(pathname: string) {
  let path = pathname;
  if (path.startsWith(BASE_PATH)) {
    path = path.slice(BASE_PATH.length) || "/";
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

export function isPublicLesson(id: string) {
  return PUBLIC_LESSON_IDS.includes(id as (typeof PUBLIC_LESSON_IDS)[number]);
}

export function isPublicPath(pathname: string) {
  const path = normalizePath(pathname);
  return PUBLIC_PATHS.has(path);
}

export function isGatedPath(pathname: string) {
  const path = normalizePath(pathname);
  if (isPublicPath(path)) return false;
  if (path.startsWith("/learn/")) {
    const lesson = PUBLIC_LESSONS.find((l) => l.path === path);
    return !lesson;
  }
  return GATED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function unitForGate(pathname: string) {
  const path = normalizePath(pathname);
  const lesson = PUBLIC_LESSONS.find((l) => l.path === path);
  if (lesson) return lesson.unit;
  if (path.startsWith("/practice")) return "practice";
  if (path.startsWith("/mocks")) return "mocks";
  return "";
}

export function robotsDisallow() {
  return [
    `${BASE_PATH}/mocks`,
    `${BASE_PATH}/mock`,
    `${BASE_PATH}/api`,
    `${BASE_PATH}/practice`,
    `${BASE_PATH}/parent`,
    `${BASE_PATH}/mentor`,
    `${BASE_PATH}/today`,
    `${BASE_PATH}/progress`,
    `${BASE_PATH}/onboard`,
    `${BASE_PATH}/orient`,
    `${BASE_PATH}/mistakes`,
  ];
}

export function robotsAllow() {
  return [BASE_PATH, ...PUBLIC_LESSONS.map((l) => `${BASE_PATH}${l.path}`)];
}
