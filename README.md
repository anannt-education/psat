# Anannt PSAT Learning Platform

Guided, mastery-based prep for **PSAT/NMSQT** and **PSAT 10**. The product promise is:

> Understand what you are learning, know what to do next, and practise until you can apply it independently.

This repository is a student-facing first slice implemented from the Anannt PSAT Platform PRD (9 September 2026). **Anannt Education** authors the path, lessons, diagnostic, and mock routing rule. It is not College Board exam delivery.

Public pages (home, method, for families, curriculum map) are crawlable. Student tools (Today, practice sessions, mocks) still run in the browser on this device.

## Voice

Copy is written as a skilled mentor: calm, specific, growth-oriented. Process is celebrated (unhinted tries, classified mistakes, returning after a quiet week). Empty cheerleading and shame after misses are avoided. The named voice is “Your Anannt mentor” — a role, not a fictional faculty list.

## SEO

- Unique title and description per meaningful route; Open Graph and Twitter cards; `metadataBase`; canonical URLs
- `app/sitemap.ts` and `app/robots.ts`
- JSON-LD for EducationalOrganization, Course (no fake ratings or prices), LearningResource and BreadcrumbList on lessons
- Semantic landmarks, one `h1` per page, skip link, footer internal links

## What students can do

1. Onboard (track, grade, target window, weekly availability, timezone, optional self-reported score, needs).
2. Read orientation on test structure and the Orient → Diagnose → Place → Plan → Learn → Apply → Retain → Perform → Reflect → Test-day journey.
3. Take a 28-item diagnostic across the eight official domains, with uncertainty shown and **no official score**.
4. Follow a dated **Today** plan with time estimates and a visible reason for each task.
5. Walk the sequential Learn path **RW0–RW12** and **M0–M14**, including complete lessons for slope-in-context (M2) and a reading counterpart on scope (*some* vs *all*, RW1), plus other complete lessons and walkable shells.
6. Practise with hints (concept → representation → partial step). Revealing a solution marks the attempt assisted.
7. Keep an error notebook (knowledge / interpretation / method / calculation / timing) and retest on a fresh item.
8. Sit a timed mini-set and a **two-stage rehearsal mock** (RW two modules, 10-minute break, Math two modules, frozen form version, independent routing). Modules cannot be edited after submit.
9. See Progress with **separate** coverage, independent accuracy, retention, and timed-performance evidence.
10. Use Help for accessibility, outbound College Board digital practice, and a test-day checklist. SAT mentoring later: https://anannt.ae/sat-coaching-dubai.

Account controls include a role toggle for a lightweight **Mentor** exception queue and a **Family** summary. There is no login and no database; state is stored in `localStorage` on this device.

## Honest limits

- Not College Board exam delivery or registration.
- Does not convert raw percent correct into 320–1520 or invent percentiles.
- Does not promise scores or scholarships.
- Rehearsal mocks are **shortened** two-stage forms so routing can be practised without a 134-minute sitting. Official module lengths (27 RW / 32 min, 22 Math / 35 min) are cited in-product.
- Routing uses an Anannt practice rule, never advertised as College Board’s proprietary threshold.
- Academic editor CMS is out of scope except a quarantine / flag control on items.
- AI chat is not the product; questions use an approved hint ladder.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui

## Run locally

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0:43142` with `basePath` `/psat`. Production URLs are `https://study.anannt.ae/psat`.

```bash
npm run build
npm start
```

Open `http://127.0.0.1:43142/psat`.

## Persistence

Student profile, attempts, mastery, plans, and mocks live under the `anannt-psat-v1` key in local storage. Reset from Account → “Reset this device’s demo data”.
