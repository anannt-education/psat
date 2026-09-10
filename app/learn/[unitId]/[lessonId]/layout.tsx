import type { Metadata } from "next"
import { JsonLd } from "@/components/json-ld"
import { lessonById } from "@/data/lessons"
import { unitById } from "@/lib/curriculum"
import { breadcrumbJsonLd, learningResourceJsonLd, pageMetadata } from "@/lib/seo"
import { isPublicLesson, PUBLIC_LESSONS } from "@/lib/mount"

type Props = { params: Promise<{ unitId: string; lessonId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { unitId, lessonId } = await params
  const lesson = lessonById(lessonId)
  const unit = unitById(unitId)
  if (!lesson || !unit) {
    return pageMetadata({
      title: "Lesson",
      description: "Anannt Education PSAT lesson on the published RW0–RW12 and M0–M14 path.",
      path: `/learn/${unitId}/${lessonId}`,
    })
  }
  const publicLesson = PUBLIC_LESSONS.find((l) => l.id === lesson.id)
  return pageMetadata({
    title: `${unit.id} · ${lesson.title}`,
    description: publicLesson?.description ?? lesson.objective,
    path: `/learn/${unitId}/${lessonId}`,
    noIndex: !isPublicLesson(lesson.id),
  })
}

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Props["params"]
}) {
  const { unitId, lessonId } = await params
  const lesson = lessonById(lessonId)
  const unit = unitById(unitId)
  const path = `/learn/${unitId}/${lessonId}`
  const json = lesson && unit
    ? [
        learningResourceJsonLd({
          name: `${unit.id} · ${lesson.title}`,
          description: lesson.objective,
          path,
          unitId,
        }),
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Curriculum", path: "/learn" },
          { name: unit.id, path },
        ]),
      ]
    : []
  return (
    <>
      {json.length > 0 && <JsonLd data={json} />}
      {children}
    </>
  )
}
