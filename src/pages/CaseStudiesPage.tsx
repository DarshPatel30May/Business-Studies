import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Library, Search } from "lucide-react";
import { CASE_STUDIES, STRATEGY_TAGS, VERIFICATION_NOTE, type CaseStudy } from "../content/caseStudies";
import type { TopicId } from "../content/types";
import { TOPIC_THEME, cx } from "../lib/theme";
import { BookmarkButton, Callout, Card, PageHeader, Segmented, Tag, TopicBadge } from "../components/ui";

export function CaseStudyCard({ c, highlight }: { c: CaseStudy; highlight?: TopicId }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {c.topics.map((t) => (
            <TopicBadge key={t} topic={t} short />
          ))}
          <Tag>{c.status === "past" ? "Past strategy" : c.status === "current" ? "Current practice" : "Past & current"}</Tag>
        </div>
        <BookmarkButton id={`case:${c.id}`} title={c.business} to={`/case-studies/${c.id}`} kind="Case study" topic={highlight ?? c.topics[0]} />
      </div>
      <p className="mt-3 text-xs text-stone-500">{c.industry} · {c.period}</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-stone-900 dark:text-stone-50">{c.business}</h3>
      <p className="text-sm font-medium text-stone-700 dark:text-stone-300">{c.headline}</p>
      <p className="mt-2 line-clamp-3 text-sm text-stone-600 dark:text-stone-400">{c.strategy}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {c.tags.slice(0, 4).map((t) => (
          <span key={t} className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            {STRATEGY_TAGS.find((x) => x.id === t)?.label}
          </span>
        ))}
      </div>
      <Link to={`/case-studies/${c.id}`} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-bronze-700 dark:text-bronze-400">
        Read case study <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

export default function CaseStudiesPage() {
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [tag, setTag] = useState<string>("");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      CASE_STUDIES.filter((c) => (topic === "all" || c.topics.includes(topic)) && (!tag || c.tags.includes(tag)) && (!q || JSON.stringify(c).toLowerCase().includes(q.toLowerCase()))),
    [topic, tag, q],
  );
  const tags = STRATEGY_TAGS.filter((t) => topic === "all" || t.topic === topic);
  return (
    <div className="space-y-6">
      <PageHeader icon={<Library className="h-6 w-6" />} title="HSC Business Case Study Centre" subtitle="Real businesses, real strategies — each with dates, evidence, limitations, sources and an example of how to use it in an HSC response.">
        <div className="flex flex-wrap gap-2">
          <Link to="/case-studies/compare" className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium dark:border-stone-700 dark:bg-night-3">Compare businesses</Link>
          <Link to="/case-studies/apply" className="rounded-xl bg-bronze-700 px-3 py-2 text-sm font-medium text-white dark:bg-bronze-500 dark:text-night">Application tool</Link>
        </div>
      </PageHeader>
      <Callout tone="warning" title="How these case studies were prepared">{VERIFICATION_NOTE}</Callout>
      <div className="flex flex-wrap items-end gap-3">
        <Segmented
          label="Topic filter"
          value={topic}
          onChange={(t) => { setTopic(t); setTag(""); }}
          options={[{ value: "all", label: "All topics" }, ...(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))]}
          size="sm"
        />
        <label className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm dark:border-stone-700 dark:bg-night-3">
          <Search className="h-4 w-4 text-stone-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search case studies" aria-label="Search case studies" className="bg-transparent outline-none" />
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setTag("")} aria-pressed={!tag} className={cx("rounded-lg border px-2 py-1 text-xs", !tag ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/40" : "border-stone-200 dark:border-stone-700")}>
          All strategies
        </button>
        {tags.map((t) => (
          <button key={t.id} type="button" onClick={() => setTag(t.id)} aria-pressed={tag === t.id} className={cx("rounded-lg border px-2 py-1 text-xs", tag === t.id ? "border-bronze-500 bg-bronze-50 dark:bg-bronze-900/40" : "border-stone-200 dark:border-stone-700")}>
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-stone-500">{list.length} case {list.length === 1 ? "study" : "studies"}</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <CaseStudyCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
