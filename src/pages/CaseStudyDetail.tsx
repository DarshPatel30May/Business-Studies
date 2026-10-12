import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle2, XCircle, FileSearch, Scale, PenLine, ExternalLink, Calendar } from "lucide-react";
import { caseStudyById, STRATEGY_TAGS, VERIFICATION_NOTE } from "../content/caseStudies";
import { TOPIC_THEME } from "../lib/theme";
import { BookmarkButton, Callout, Card, PageHeader, Tag, TopicBadge, EmptyState } from "../components/ui";
import type { ReactNode } from "react";

function Row({ n, title, icon, children }: { n: number; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-bronze-100 text-xs font-bold text-bronze-800 dark:bg-bronze-900/50 dark:text-bronze-200">{n}</span>
        {icon}
        {title}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">{children}</div>
    </Card>
  );
}

export default function CaseStudyDetail() {
  const { id } = useParams();
  const c = caseStudyById(id ?? "");
  if (!c) return <EmptyState title="Case study not found"><Link to="/case-studies" className="underline">Back to the library</Link></EmptyState>;
  return (
    <div className="space-y-5">
      <Link to="/case-studies" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="h-4 w-4" /> All case studies
      </Link>
      <PageHeader topic={c.topics[0]} icon={<Building2 className="h-6 w-6" />} title={c.business} subtitle={c.headline}>
        <BookmarkButton id={`case:${c.id}`} title={c.business} to={`/case-studies/${c.id}`} kind="Case study" topic={c.topics[0]} />
      </PageHeader>
      <div className="flex flex-wrap gap-2">
        {c.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
        <Tag>{c.industry}</Tag>
        <Tag>
          <Calendar className="mr-1 h-3 w-3" />
          {c.period}
        </Tag>
        <Tag tone={c.status === "past" ? "warn" : "good"}>{c.status === "past" ? "Past strategy" : c.status === "current" ? "Current practice" : "Past and current"}</Tag>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Row n={1} title="Business strategy" icon={null}>{c.strategy}</Row>
        <Row n={2} title="Reasons for the strategy" icon={null}>{c.reasons}</Row>
        <Row n={3} title="Implementation" icon={null}>
          <ul className="space-y-1">{c.implementation.map((x) => <li key={x}>• {x}</li>)}</ul>
        </Row>
        <Row n={4} title="Benefits" icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}>
          <ul className="space-y-1">{c.benefits.map((x) => <li key={x}>• {x}</li>)}</ul>
        </Row>
        <Row n={5} title="Limitations" icon={<XCircle className="h-4 w-4 text-red-600" />}>
          <ul className="space-y-1">{c.limitations.map((x) => <li key={x}>• {x}</li>)}</ul>
        </Row>
        <Row n={6} title="Evidence of outcomes (dated)" icon={<FileSearch className="h-4 w-4" />}>
          <ul className="space-y-2">
            {c.evidence.map((e) => (
              <li key={e.text}>
                <span className="mr-1 rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-semibold dark:bg-stone-800">{e.date}</span>
                {e.text}
              </li>
            ))}
          </ul>
        </Row>
      </div>
      <Row n={7} title="Evaluation of effectiveness" icon={<Scale className="h-4 w-4" />}>{c.evaluation}</Row>
      <Card className="border-2 border-bronze-300 p-5 dark:border-bronze-800">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <PenLine className="h-4 w-4" /> Using it in an HSC response
        </p>
        <blockquote className="mt-2 border-l-4 border-bronze-400 pl-3 font-display text-[15px] leading-relaxed text-stone-800 italic dark:text-stone-200">{c.hscUse}</blockquote>
        <p className="mt-2 text-xs text-stone-500">Relevant syllabus links: {c.tags.map((t) => STRATEGY_TAGS.find((x) => x.id === t)?.label).join(" · ")}</p>
      </Card>
      {Object.keys(c.functions).length > 0 && (
        <Card className="p-5">
          <p className="text-sm font-semibold">Approach by key business function</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {Object.entries(c.functions).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-stone-50 p-3 text-sm dark:bg-night-3">
                <p className={`font-semibold ${TOPIC_THEME[k as keyof typeof TOPIC_THEME].text}`}>{TOPIC_THEME[k as keyof typeof TOPIC_THEME].label}</p>
                <p>{v}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card className="p-5">
        <p className="text-sm font-semibold">Sources</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {c.sources.map((s) => (
            <li key={s.title}>
              <span className="font-medium">{s.publisher}</span>, <span className="italic">{s.title}</span>, {s.date}.
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-0.5 text-bronze-700 underline dark:text-bronze-400">
                  {new URL(s.url).hostname} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-stone-500">Links go to the publisher's website; search the document title there for the specific report or release.</p>
      </Card>
      <Callout tone="warning" title="Verification">{VERIFICATION_NOTE}</Callout>
    </div>
  );
}
