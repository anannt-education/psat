import type { Metadata } from "next"
import { BRAND } from "@/lib/brand"
import { UNITS } from "@/lib/curriculum"
import { PUBLIC_LESSONS, SITE_URL as MOUNT_URL } from "@/lib/mount"

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? MOUNT_URL).replace(/\/$/, "")

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function pageMetadata({
  title,
  description,
  path,
  noIndex = true,
}: {
  title: string
  description: string
  path: string
  noIndex?: boolean
}): Metadata {
  const url = absoluteUrl(path)
  return {
    title: {
      absolute: `${title} · ${BRAND.name}`,
    },
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: `${title} · ${BRAND.name}`,
      description,
      url,
      siteName: BRAND.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${BRAND.name}`,
      description,
    },
  }
}

export const PUBLIC_PATHS: { path: string; title: string; description: string; index?: boolean }[] = [
  {
    path: "/",
    title: "PSAT/NMSQT — SAT feeder, two public lessons",
    description:
      "Slope in context and some-versus-all are open with no account. A SAT feeder from Anannt Education — not an AP course. Full PSAT/NMSQT® disclaimer below.",
    index: true,
  },
  {
    path: "/method",
    title: "How Anannt Education teaches PSAT as a SAT feeder",
    description:
      "How Anannt Education teaches PSAT/NMSQT as a SAT feeder: two public lessons, then Digital SAT mentoring if you want a person. Never an AP upsell in Dubai.",
  },
  {
    path: "/for-families",
    title: "PSAT prep for families",
    description:
      "How families can support Anannt Education’s PSAT/NMSQT and PSAT 10 path: protect study days, ask for one worked example, and never treat practice percent as an official score.",
  },
  {
    path: "/onboard",
    title: "Set up your PSAT path",
    description:
      "Choose PSAT/NMSQT or PSAT 10, grade, weekly minutes, and what you want help with. Anannt Education stores this setup on this device only.",
  },
  {
    path: "/orient",
    title: "How the PSAT suite and this course work",
    description:
      "Official PSAT/NMSQT and PSAT 10 structure, two-stage modules, and Anannt Education’s ten-step learning journey.",
  },
  {
    path: "/diagnostic",
    title: "PSAT domain screening start",
    description:
      "Start a short PSAT domain screening with no account. After you submit, we point only to Digital SAT mentoring in Dubai — never an AP course.",
  },
  {
    path: "/today",
    title: "Today’s PSAT plan",
    description: "A dated Anannt Education study plan for PSAT/NMSQT or PSAT 10, with a reason and duration for each task.",
  },
  {
    path: "/learn",
    title: "PSAT curriculum map",
    description:
      "Anannt Education’s sequential PSAT path: Reading and Writing RW0–RW12 and Math M0–M14, including slope in context and sentence boundaries.",
  },
  {
    path: "/practice",
    title: "PSAT practice modes",
    description:
      "Guided hints, independent quizzes, mixed review, timed mini-sets, and section modules written by Anannt Education for the digital PSAT suite.",
  },
  {
    path: "/mistakes",
    title: "Review PSAT mistakes",
    description:
      "Anannt Education’s error notebook: knowledge, interpretation, method, calculation, and timing — then a fresh analogous item.",
  },
  {
    path: "/mocks",
    title: "PSAT two-stage mock rehearsal",
    description:
      "Shortened two-stage PSAT/NMSQT rehearsal with an Anannt routing rule. Raw accuracy and pacing — never a converted official score.",
  },
  {
    path: "/progress",
    title: "PSAT learning evidence",
    description:
      "Coverage, independent accuracy, retention, and timed performance stored separately by Anannt Education. No opaque composite score.",
  },
  {
    path: "/help",
    title: "Help and Digital SAT mentoring",
    description:
      "Accessibility, test-day logistics, and Digital SAT mentoring from Anannt Education. This PSAT path does not upsell AP courses.",
  },
  {
    path: "/parent",
    title: "Family summary",
    description:
      "Effort and learning evidence for the student on this device. Anannt Education does not stream failure alerts to families.",
  },
  {
    path: "/mentor",
    title: "Mentor exception queue",
    description:
      "Anannt Education’s mentor view: inactivity, repeated errors, and timed-versus-untimed gaps — with inspectable reasons.",
  },
]

export function metadataForPath(path: string): Metadata {
  const row = PUBLIC_PATHS.find((p) => p.path === path)
  if (!row) {
    return pageMetadata({
      title: BRAND.product,
      description: BRAND.description,
      path,
    })
  }
  return pageMetadata({
    title: row.title,
    description: row.description,
    path: row.path,
    noIndex: row.index !== true,
  })
}

export function sitemapEntries() {
  const now = new Date()
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...PUBLIC_LESSONS.map((lesson, i) => ({
      url: absoluteUrl(lesson.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: i === 0 ? 0.9 : 0.8,
    })),
  ]
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: BRAND.name,
    alternateName: BRAND.shortName,
    description: BRAND.description,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 105, Bank Street Building, Burjuman Metro Exit 2",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    telephone: "+971585853551",
    email: "wecare@anannt.ae",
    slogan: BRAND.tagline,
    knowsAbout: ["PSAT/NMSQT", "PSAT 10", "SAT Suite", "Reading and Writing", "High school mathematics"],
  }
}

export function courseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: BRAND.product,
    description: BRAND.description,
    url: SITE_URL,
    provider: {
      "@type": "EducationalOrganization",
      name: BRAND.name,
      url: SITE_URL,
    },
    educationalLevel: "High school",
    teaches: "PSAT/NMSQT and PSAT 10 Reading and Writing and Math",
    inLanguage: "en",
    isAccessibleForFree: true,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      instructor: {
        "@type": "EducationalOrganization",
        name: BRAND.name,
      },
    },
  }
}

export function learningResourceJsonLd(opts: {
  name: string
  description: string
  path: string
  unitId: string
}) {
  const unit = UNITS.find((u) => u.id === opts.unitId)
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    learningResourceType: "Lesson",
    educationalLevel: "High school",
    inLanguage: "en",
    isAccessibleForFree: true,
    provider: {
      "@type": "EducationalOrganization",
      name: BRAND.name,
    },
    about: unit ? `${unit.title} for ${BRAND.exams}` : BRAND.exams,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
