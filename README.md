# HSC Business Studies 2026 — Interactive Visual Study Guide

An interactive, visual revision website covering the whole **2026 NSW HSC Business Studies** course, aligned with the **NESA Business Studies Stage 6 Syllabus (2010)**:

- **Topic 1 — Operations**
- **Topic 2 — Marketing**
- **Topic 3 — Finance**
- **Topic 4 — Human Resources**

It is a static single-page app (React + TypeScript + Vite). Everything runs in the browser — no account, server, database or AI service is required. Progress is stored in the browser's `localStorage`.

## What's inside

| Area | Features |
| --- | --- |
| Topic pages (A–H) | Overview · syllabus checklist · major concepts · influences · processes · strategies · case studies · quick revision — for all four topics |
| Visual learning | 48 interactive visual components plus 15 flowcharts and comparison tables: inputs–transformation–outputs explorer, four Vs, Gantt chart and critical path lab, FIFO/LIFO/JIT lab, SWOT builder, product life cycle, perceptual map, 7 Ps explorer, pricing/promotion/distribution tools, financial statements, ratio dashboard, HR lifecycle, dispute flowchart and more (React Flow, Recharts, custom SVG) |
| Simulations | Operations, marketing and HR strategy simulators; a multi-quarter business simulation (5 business types, decisions across all four functions); financial statement simulator — all deterministic and transparent, with stated assumptions |
| Finance tools | Formula Centre (all 7 syllabus ratios + supporting calculations, KaTeX), step-by-step ratio calculator with interpretation, implications and limitations |
| Case studies | 16 dated, sourced real-world case studies (Toyota, Qantas, Woolworths, Apple, McDonald's, ALDI, Kmart, Wesfarmers/Bunnings UK, Coca-Cola, Inditex/Zara, Nike, Atlassian, Patagonia), comparison tool and HSC application tool |
| HSC preparation | Section I MCQ practice (64 questions, 4 difficulty levels + adaptive mode, immediate or delayed marking, distractor explanations); Section II short answers (2–6 marks, criteria, samples, self-assessment); Section III business report builder (8 steps) and practice; Section IV extended-response planner, directive verbs, original sample responses |
| Revision | Flashcards, glossary, keyword search (Ctrl/⌘ K), bookmarks, syllabus checklist, weak-topic identification, beginner/advanced modes, visual-only mode, print-to-PDF summaries, light/dark themes |

## Local installation

Requirements: **Node.js 20+** (tested with Node 22) and npm.

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173
```

Other scripts:

```bash
npm test           # run the Vitest unit tests (finance, critical path, inventory, simulations, feedback, content integrity)
npm run typecheck  # TypeScript check
npm run build      # type-check and build the production site into dist/
npm run preview    # serve the production build locally
```

## Deployment

The build output in `dist/` is fully static. Asset paths are relative (`base: "./"`) and routing uses a hash router, so the site works from any folder or sub-path without server rewrites.

- **GitHub Pages:** run `npm run build` and publish the `dist/` folder (for example with the `actions/upload-pages-artifact` and `actions/deploy-pages` actions, or by pushing `dist/` to a `gh-pages` branch).
- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`, publish directory `dist`.
- **Any web server or file share:** copy the contents of `dist/` — no server configuration is needed.

## Project structure

```
src/
  content/            Educational content as typed data (no UI code)
    topics/           Operations, Marketing, Finance, HR — syllabus, concepts, influences, strategies, revision
    questions/        MCQ, short-answer, business report and extended-response banks
    caseStudies.ts    Verified case studies with sources and dates
    formulas.ts       Formula library (equations, components, mistakes, calculators)
    hsc.ts            Exam structure, directive verbs, marking bands, interdependence
  lib/                Pure, tested logic: finance ratios & statements, critical path, inventory valuation,
                      simulation models (sim/), writing feedback, analytics
  components/         UI primitives, layout, content renderers, interactive visuals, practice tools
  pages/              Route pages (lazy-loaded)
  state/              Settings, progress and localStorage persistence
```

## Accuracy notes

- Syllabus dot points are reproduced in condensed form; the "students learn to" statements are paraphrased. Check exact wording in the official NESA syllabus.
- Financial ratios follow the syllabus definitions (e.g. debt to equity = total liabilities ÷ total equity). NESA advises that HSC questions requiring a ratio include its formula; the site teaches application and interpretation.
- Simulations, report stimuli and named classroom businesses (e.g. "Ironbark Outdoor Furniture") are **fictional** and use illustrative figures.
- Case studies summarise publicly reported information with dates and sources. Check current reports before quoting figures. Wikipedia was not used.
- Automated writing feedback is keyword-based guidance, not a substitute for NESA marking.

This is an independent study resource and is not produced or endorsed by NESA.
