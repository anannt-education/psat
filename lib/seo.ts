import type { Metadata } from "next"
import { BRAND } from "@/lib/brand"
import { UNITS } from "@/lib/curriculum"
import { BASE_PATH, STUDY_ORIGIN } from "@/lib/gate"

export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || STUDY_ORIGIN).replace(/\/$/, "")

export { BASE_PATH, STUDY_ORIGIN }

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path
  const p = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${BASE_PATH}${p}`
}

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
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

export const PUBLIC_PATHS: { path: string; title: string; description: string }[] = [
  {
    path: "/",
    title: "PSAT/NMSQT path · SAT preview",
    description:
      "A short SAT feeder: slope-in-context and some-versus-all, free, no account. Dual College Board disclaimer. Digital SAT mentoring later—never an AP upsell.",
  },
  {
    path: "/method",
    title: "How this PSAT desk teaches",
    description:
      "Orient, two public lessons, then a gate. SAT habits only. Anannt is not affiliated with the College Board and does not convert practice into an official score.",
  },
  {
    path: "/for-families",
    title: "PSAT prep for families",
    description:
      "Protect study days. Ask for one worked example. Do not treat a practice percent as an official score. SAT mentoring lives on anannt.ae/sat-coaching-dubai.",
  },
  {
    path: "/help",
    title: "PSAT FAQ and test-day notes",
    description:
      "Accessibility and practical test-day notes for PSAT 10 and PSAT/NMSQT. Official digital practice is outbound. SAT mentoring, not AP, if you want a human later.",
  },
  {
    path: "/learn",
    title: "PSAT map · two lessons open",
    description:
      "Slope in context and some-versus-all are public. Other units are unpublished shells or gated. This path does not sell AP and is not a complete SAT course.",
  },
  {
    path: "/learn/M2/M2-L1",
    title: "Slope in context",
    description:
      "Lesson 1, free and no account: in C = 12 + 3d, 12 is the start and 3 is the rate. Swapping slope and intercept is the featured error.",
  },
  {
    path: "/learn/RW1/RW1-L1",
    title: "Some versus all",
    description:
      "Lesson 2, free and no account: keep some, may, and not studied. Inflating a cautious finding is the attractive wrong answer on this SAT feeder.",
  },
  {
    path: "/diagnostic",
    title: "PSAT diagnostic start",
    description:
      "Start a domain screening with no account. After you submit, we ask for email and a required parent WhatsApp. Not an official 320–1520 score.",
  },
]

export function metadataForPath(path: string): Metadata {
  const row = PUBLIC_PATHS.find((p) => p.path === path)
  if (!row) {
    return pageMetadata({
      title: BRAND.product,
      description: BRAND.description,
      path,
      noIndex: true,
    })
  }
  return pageMetadata(row)
}

export function sitemapEntries() {
  return PUBLIC_PATHS.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(),
    changeFrequency: p.path === "/" || p.path === "/learn" ? ("weekly" as const) : ("monthly" as const),
    priority: p.path === "/" ? 1 : p.path === "/learn" || p.path === "/method" ? 0.8 : 0.6,
  }))
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: BRAND.name,
    alternateName: BRAND.shortName,
    description: BRAND.description,
    url: SITE_URL,
    slogan: BRAND.tagline,
    knowsAbout: ["PSAT/NMSQT", "PSAT 10", "SAT Suite", "Reading and Writing", "High school mathematics"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 105, Bank Street Building, Burjuman Metro Exit 2",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    telephone: "+971 58585 3551",
    email: "wecare@anannt.ae",
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
