import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a3d66",
          color: "#f4efe4",
          fontSize: 110,
          fontFamily: "Georgia, ui-serif, serif",
        }}
      >
        A
      </div>
    ),
    { ...size }
  )
}
