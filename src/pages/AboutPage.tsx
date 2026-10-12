import { Info, ExternalLink } from "lucide-react";
import { CASE_STUDIES, VERIFICATION_NOTE } from "../content/caseStudies";
import { Callout, Card, PageHeader } from "../components/ui";

const OFFICIAL = [
  { title: "Business Studies Stage 6 Syllabus (2010) — NESA", url: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/business-studies-stage-6-2010" },
  { title: "Business Studies — assessment and reporting (examination specifications) — NESA", url: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsie/business-studies-stage-6-2010/assessment-and-reporting" },
  { title: "Business Studies HSC exam papers and marking guidelines — NESA", url: "https://www.nsw.gov.au/education-and-training/nesa/curriculum/hsc-exam-papers/business-studies" },
  { title: "Australian Competition and Consumer Commission (consumer law, enforcement)", url: "https://www.accc.gov.au" },
  { title: "Australian Securities and Investments Commission", url: "https://asic.gov.au" },
  { title: "Australian Taxation Office (company tax rates)", url: "https://www.ato.gov.au" },
  { title: "Fair Work Ombudsman (NES, awards, pay)", url: "https://www.fairwork.gov.au" },
  { title: "Fair Work Commission (awards, agreements, disputes)", url: "https://www.fwc.gov.au" },
  { title: "SafeWork NSW (work health and safety)", url: "https://www.safework.nsw.gov.au" },
  { title: "Australian Bureau of Statistics (labour force data)", url: "https://www.abs.gov.au" },
];

export default function AboutPage() {
  const sources = CASE_STUDIES.flatMap((c) => c.sources.map((s) => ({ ...s, business: c.business })));
  return (
    <div className="space-y-6">
      <PageHeader icon={<Info className="h-6 w-6" />} title="About this guide, sources and disclaimer" subtitle="How the content was prepared, what is syllabus content and what is supplementary, and where the facts come from." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-5 text-sm">
          <p className="font-semibold">Syllabus alignment</p>
          <p>The guide follows the NESA Business Studies Stage 6 Syllabus (2010), which applies to the 2026 HSC. All four HSC topics are covered: Operations, Marketing, Finance and Human Resources (each 25% of indicative course time).</p>
          <p>Syllabus dot points are reproduced in condensed form; 'students learn to' statements are paraphrased. Items labelled <span className="font-semibold">Supplementary</span> are optional explanations beyond the dot points. Always check the official syllabus for exact wording.</p>
        </Card>
        <Card className="space-y-2 p-5 text-sm">
          <p className="font-semibold">Fictional versus real</p>
          <p>Simulations, calculator examples, report stimuli and named businesses such as “Ironbark Outdoor Furniture”, “Harbourside Homewares” and “Tidal Bottles” are <span className="font-semibold">fictional</span> classroom examples with illustrative figures.</p>
          <p>Case studies in the Case Study Centre describe <span className="font-semibold">real businesses</span>, using dated, publicly reported information with sources. {VERIFICATION_NOTE}</p>
        </Card>
        <Card className="space-y-2 p-5 text-sm">
          <p className="font-semibold">Automated feedback</p>
          <p>Writing feedback in the report builder, short-answer practice and extended response tools is keyword- and pattern-based. It is a guide to relevance, terminology, application, analysis and evaluation — it is not identical to, and cannot replace, marking by NESA's human markers.</p>
        </Card>
        <Card className="space-y-2 p-5 text-sm">
          <p className="font-semibold">Privacy and storage</p>
          <p>No account, server, AI service or tracking is used. Progress, bookmarks, drafts and settings are saved in your browser's local storage. Use Progress → Export to back them up.</p>
          <p className="font-semibold">Keyboard shortcuts</p>
          <p>Ctrl/⌘ + K or “/” — search · Space — flip flashcard · ← → — previous/next flashcard · Tab — move between controls.</p>
        </Card>
      </div>
      <Card className="p-5">
        <p className="font-semibold">Official and government sources</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {OFFICIAL.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-bronze-700 underline dark:text-bronze-400">
                {s.title} <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5">
        <p className="font-semibold">Case study sources</p>
        <ul className="mt-2 space-y-1 text-sm">
          {sources.map((s, i) => (
            <li key={i}>
              <span className="font-medium">{s.business}:</span> {s.publisher}, <span className="italic">{s.title}</span>, {s.date}
              {s.url && <> — <a href={s.url} target="_blank" rel="noreferrer" className="text-bronze-700 underline dark:text-bronze-400">{new URL(s.url).hostname}</a></>}
            </li>
          ))}
        </ul>
      </Card>
      <Callout tone="warning" title="Disclaimer">
        This is an independent study resource. It is not produced, endorsed or reviewed by NESA or any business named. Laws, rates and company strategies change — check current official sources before relying on specific figures. Wikipedia was not used as a source.
      </Callout>
    </div>
  );
}
