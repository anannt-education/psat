import { redirect } from "next/navigation"
import { unitById } from "@/lib/curriculum"

export default async function UnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params
  const unit = unitById(unitId)
  if (!unit) redirect("/learn")
  redirect(`/learn/${unitId}/${unit.lessonIds[0]}`)
}
