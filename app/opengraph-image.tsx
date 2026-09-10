import { ImageResponse } from "next/og"
import { BRAND } from "@/lib/brand"

export const alt = `${BRAND.name} — ${BRAND.exams} prep`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4efe4",
          color: "#1c2740",
          padding: 72,
          fontFamily: "Georgia, ui-serif, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#4a5878" }}>
            {BRAND.name}
          </div>
          <div style={{ fontSize: 64, lineHeight: 1.1, maxWidth: 980 }}>
            PSAT/NMSQT and PSAT 10 with a mentor in the work.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#4a5878", maxWidth: 920 }}>
          Reading and Writing · Math · diagnostic · independent practice · two-stage mock rehearsal
        </div>
      </div>
    ),
    { ...size }
  )
}
