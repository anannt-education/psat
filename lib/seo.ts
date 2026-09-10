import type { Metadata } from "next"
import { BRAND } from "@/lib/brand"
import { UNITS } from "@/lib/curriculum"
import { SITE_URL as MOUNT_SITE_URL, absUrl } from "@/lib/mount"

export const SITE_URL = MOUNT_SITE_URL

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path
  return absUrl(path)
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

export const PUBLIC_PATHS: { path: string; title: string; description: string; noIndex?: boolean }[] = [
  {
    path: "/",
    title: "PSAT/NMSQT path — SAT feeder, two open lessons",
    description:
      "A short SAT-feeder path: slope in context and some versus all. Two lessons open, no account. Digital SAT mentoring in Dubai if you want a person.",
  },
  {
    path: "/method",
    title: "How this PSAT desk teaches SAT habits",
    description:
      "Orient, try two public lessons, then a Digital SAT mentor if you want a person. This path does not sell AP packages and does not promise scholarships.",
  },
  {
    path: "/for-families",
    title: "PSAT desk notes for families",
    description:
      "Protect a quiet hour. Ask for one worked example on slope or some-versus-all. This is SAT preview, not an AP package, and not a scholarship promise.",
  },
  {
    path: "/learn",
    title: "PSAT map — two public lessons, rest unpublished",
    description:
      "Open slope in context and some versus all with no account. Later units stay unpublished. SAT feeder only — Digital SAT mentoring if you want a person.",
  },
  {
    path: "/learn/M2/M2-L1",
    title: "Slope in context — public PSAT lesson",
    description:
      "Rate versus starting value in a linear story. First public PSAT lesson, no account. A SAT-feeder habit, not an AP upsell and not a scholarship claim.",
  },
  {
    path: "/learn/RW1/RW1-L1",
    title: "Some versus all — public PSAT lesson",
    description:
      "Keep the author’s limits: some, may, not studied. Second public PSAT lesson, no account. SAT feeder path toward Digital SAT mentoring if you want help.",
  },
  {
    path: "/diagnostic",
    title: "PSAT diagnostic start — SAT feeder screening",
    description:
      "Start a short domain screening with no account. Submit sends you to study.anannt.ae/start. Placement hints only — not an official score.",
  },
  {
    path: "/help",
    title: "PSAT help and Digital SAT mentoring",
    description:
      "Accessibility, outbound College Board practice, and Digital SAT mentoring in Dubai. This path does not sell AP packages and does not promise scholarships.",
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
  return pageMetadata(row)
}

export function sitemapEntries() {
  return PUBLIC_PATHS.filter((p) => !p.noIndex).map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(),
    changeFrequency: p.path === "/" || p.path === "/learn" ? ("weekly" as const) : ("monthly" as const),
    priority: p.path === "/" ? 1 : p.path.startsWith("/learn/") ? 0.8 : 0.6,
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
