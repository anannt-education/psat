/**
 * Study.anannt.ae mount + gate contract (Agent C).
 * Agent A owns the /start form. Copy field names only — do not ship a second form.
 * PSAT intent later resolves to Digital SAT mentoring only — never an AP upsell.
 */
export const STUDY_ORIGIN = "https://study.anannt.ae";
export const BASE_PATH = "/psat";
export const SUBJECT_SLUG = "psat";
export const SESSION_COOKIE = "anannt_study_session";
export const SAT_MENTORING_URL = "https://anannt.ae/sat-coaching-dubai";

/** Catalog: slope-in-context + some-vs-all. */
export const PUBLIC_LESSON_IDS = ["M2-L1", "RW1-L1"] as const;
export const PUBLIC_LESSON_1 = "M2-L1";
export const PUBLIC_LESSON_2 = "RW1-L1";
export const PUBLIC_LESSON_PATHS = ["/learn/M2/M2-L1", "/learn/RW1/RW1-L1"] as const;

export const GATE_FIELDS = [
  "firstName",
  "email",
  "parentWhatsApp",
  "role",
  "ageBand",
  "sitting",
  "schoolType",
  "intent",
  "consent",
] as const;

export function isPublicLesson(id: string) {
  return (PUBLIC_LESSON_IDS as readonly string[]).includes(id);
}

export function studyStartUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("unit", unit);
  return url.toString();
}

export function waitlistUrl(unit = "") {
  const url = new URL("/start", STUDY_ORIGIN);
  url.searchParams.set("subject", SUBJECT_SLUG);
  url.searchParams.set("intent", "waitlist");
  url.searchParams.set("unit", unit);
  return url.toString();
}
