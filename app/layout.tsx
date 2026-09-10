import type { Metadata } from "next"
import { Geist_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google"
import { Providers } from "@/components/providers"
import { BRAND } from "@/lib/brand"
import { SITE_URL } from "@/lib/seo"
import "./globals.css"

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
})

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.exams} path`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.product,
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  keywords: [
    "PSAT",
    "PSAT/NMSQT",
    "PSAT 10",
    "Reading and Writing",
    "PSAT Math",
    "Anannt Education",
    "digital SAT suite",
    "PSAT diagnostic",
    "SAT feeder Dubai",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.exams} path`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.exams} path`,
    description: BRAND.description,
  },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
