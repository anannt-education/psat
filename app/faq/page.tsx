import type { Metadata } from "next"
import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { PUBLIC_LESSON_1, PUBLIC_LESSON_2, PUBLIC_SEO, SAT_COACHING_URL, whatsappUrl } from "@/lib/mount"

export const metadata: Metadata = pageMetadata({
  title: PUBLIC_SEO.faq.title,
  description: PUBLIC_SEO.faq.description,
  path: PUBLIC_SEO.faq.path,
})

export default function FaqPage() {
  return (
    <article className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold">PSAT FAQ</h1>
      <p className="text-muted-foreground">
        This path is a Digital SAT preview. It is not an AP course. Mentoring continues on Digital SAT only.
      </p>
      <dl className="space-y-5 text-[15px] leading-7">
        <div>
          <dt className="font-medium">Which lessons are public?</dt>
          <dd className="mt-1 text-muted-foreground">
            <Link className="underline" href={PUBLIC_LESSON_1.path}>
              {PUBLIC_LESSON_1.title}
            </Link>{" "}
            and{" "}
            <Link className="underline" href={PUBLIC_LESSON_2.path}>
              {PUBLIC_LESSON_2.title}
            </Link>
            .
          </dd>
        </div>
        <div>
          <dt className="font-medium">Do you upsell AP subjects from PSAT?</dt>
          <dd className="mt-1 text-muted-foreground">
            No. Every mentoring CTA goes to Digital SAT coaching:{" "}
            <a className="underline" href={SAT_COACHING_URL}>
              anannt.ae/sat-coaching-dubai
            </a>
            .
          </dd>
        </div>
        <div>
          <dt className="font-medium">Do you promise National Merit?</dt>
          <dd className="mt-1 text-muted-foreground">
            No. Anannt does not decide eligibility, publish cutoffs, or treat practice percent as an official PSAT
            score.
          </dd>
        </div>
        <div>
          <dt className="font-medium">WhatsApp</dt>
          <dd className="mt-1 text-muted-foreground">
            <a className="underline" href={whatsappUrl("psat-faq")}>
              +971 58585 3551
            </a>
          </dd>
        </div>
      </dl>
    </article>
  )
}
