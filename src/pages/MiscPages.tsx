import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Bookmark, BookOpen, Search, Trash2, Printer, Compass } from "lucide-react";
import { GLOSSARY, TOPICS, search, topicById, allDotPoints } from "../content";
import { formulaById } from "../content/formulas";
import type { TopicId } from "../content/types";
import { TOPIC_THEME, cx } from "../lib/theme";
import { Button, Card, EmptyState, Formula, PageHeader, Segmented, TopicBadge } from "../components/ui";
import { useProgress } from "../state/progress";

export function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useProgress();
  return (
    <div className="space-y-6">
      <PageHeader icon={<Bookmark className="h-6 w-6" />} title="Revision bookmarks" subtitle="Concepts, strategies, visuals, formulas and case studies you have saved. Use the bookmark icon anywhere in the guide." />
      {bookmarks.length === 0 ? (
        <EmptyState title="No bookmarks yet" icon={<Bookmark className="h-6 w-6" />}>Click the bookmark icon on any concept, strategy, visual or case study.</EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {bookmarks.map((b) => (
            <li key={b.id}>
              <Card className="flex items-start justify-between gap-3 p-4">
                <Link to={b.to} className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {b.topic && <TopicBadge topic={b.topic} short />}
                    <span className="text-[11px] font-semibold text-stone-500 uppercase">{b.kind}</span>
                  </div>
                  <p className="mt-1 font-semibold hover:underline">{b.title}</p>
                  <p className="text-xs text-stone-500">Saved {new Date(b.at).toLocaleDateString("en-AU")}</p>
                </Link>
                <button type="button" onClick={() => toggleBookmark(b)} aria-label={`Remove bookmark ${b.title}`} className="rounded-lg p-1.5 text-stone-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GlossaryPage() {
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      [...GLOSSARY]
        .filter((g) => (topic === "all" || g.topic === topic) && (!q || (g.term + " " + g.definition).toLowerCase().includes(q.toLowerCase())))
        .sort((a, b) => a.term.localeCompare(b.term)),
    [topic, q],
  );
  const letters = [...new Set(list.map((g) => g.term[0].toUpperCase()))];
  return (
    <div className="space-y-6">
      <PageHeader icon={<BookOpen className="h-6 w-6" />} title="Glossary of business terminology" subtitle={`${GLOSSARY.length} terms, each linking back to its full explanation.`} />
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Topic" size="sm" value={topic} onChange={setTopic} options={[{ value: "all", label: "All" }, ...(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))]} />
        <label className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm dark:border-stone-700 dark:bg-night-3">
          <Search className="h-4 w-4 text-stone-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter terms" aria-label="Filter glossary" className="bg-transparent outline-none" />
        </label>
      </div>
      <div className="flex flex-wrap gap-1">
        {letters.map((l) => (
          <a key={l} href={`#/glossary`} onClick={(e) => { e.preventDefault(); document.getElementById(`letter-${l}`)?.scrollIntoView({ behavior: "smooth" }); }} className="grid h-7 w-7 place-items-center rounded-md border border-stone-200 text-xs font-semibold hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800">
            {l}
          </a>
        ))}
      </div>
      <div className="space-y-6">
        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="scroll-mt-28">
            <h2 className="mb-2 font-display text-2xl font-semibold text-bronze-700 dark:text-bronze-400">{l}</h2>
            <dl className="grid gap-2 md:grid-cols-2">
              {list.filter((g) => g.term[0].toUpperCase() === l).map((g) => (
                <div key={g.id} className="rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-night-2">
                  <dt className="flex items-start justify-between gap-2">
                    <Link to={`/topic/${g.topic}/${g.section}?focus=${g.id}`} className={cx("font-semibold hover:underline", TOPIC_THEME[g.topic].textStrong)}>{g.term}</Link>
                    <TopicBadge topic={g.topic} short />
                  </dt>
                  <dd className="mt-1 text-sm text-stone-600 dark:text-stone-400">{g.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const results = useMemo(() => search(q, 80), [q]);
  return (
    <div className="space-y-6">
      <PageHeader icon={<Search className="h-6 w-6" />} title="Search" subtitle="Keyword and concept search across every topic, formula, case study, directive verb and syllabus dot point." />
      <label className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 dark:border-stone-700 dark:bg-night-3">
        <Search className="h-5 w-5 text-stone-400" />
        <input value={q} onChange={(e) => setParams({ q: e.target.value }, { replace: true })} placeholder="e.g. factoring, leadership, product life cycle" aria-label="Search" className="w-full bg-transparent text-base outline-none" autoFocus />
      </label>
      {q && <p className="text-sm text-stone-500">{results.length} results for “{q}”</p>}
      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.id + r.kind}>
            <Link to={r.to} className="block rounded-xl border border-stone-200 bg-white p-3 hover:border-stone-400 dark:border-stone-800 dark:bg-night-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">{r.kind}</span>
                {r.topic && <TopicBadge topic={r.topic} short />}
              </div>
              <p className="mt-1 font-semibold">{r.title}</p>
              <p className="line-clamp-2 text-sm text-stone-500">{r.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrintSummary() {
  const { topicId } = useParams();
  const t = topicById(topicId ?? "");
  if (!t) return <EmptyState title="Topic not found" />;
  const th = TOPIC_THEME[t.id];
  return (
    <article className="mx-auto max-w-3xl space-y-6 bg-white p-2 text-stone-900 print:max-w-none dark:bg-transparent dark:text-stone-100 print:dark:text-black">
      <div className="no-print flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
        <p className="text-sm">Use your browser's print dialog and choose “Save as PDF”. Navigation is hidden automatically.</p>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((x) => (
            <Link key={x.id} to={`/print/${x.id}`} className={cx("rounded-lg px-2 py-1 text-xs font-semibold", x.id === t.id ? `${TOPIC_THEME[x.id].bgSolid} text-white` : "border border-stone-300 dark:border-stone-700")}>{x.name}</Link>
          ))}
          <Button onClick={() => window.print()}><Printer className="h-4 w-4" /> Print / Save PDF</Button>
        </div>
      </div>
      <header className={cx("border-b-4 pb-3", th.border)}>
        <p className="text-xs font-semibold tracking-widest uppercase">HSC Business Studies 2026 · Topic {t.number}</p>
        <h1 className="font-display text-3xl font-semibold">{t.name} — revision summary</h1>
        <p className="mt-1 text-sm italic">{t.focus}</p>
      </header>
      <section className="print-card">
        <h2 className="font-display text-xl font-semibold">30-second summary</h2>
        <p className="mt-1 text-sm leading-relaxed">{t.revision.thirtySecond}</p>
      </section>
      <section className="print-card">
        <h2 className="font-display text-xl font-semibold">Key takeaways</h2>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">{t.revision.takeaways.map((x) => <li key={x}>{x}</li>)}</ol>
      </section>
      <section className="print-card">
        <h2 className="font-display text-xl font-semibold">Syllabus dot points</h2>
        {t.syllabus.map((a) => (
          <div key={a.id} className="mt-2">
            <p className="text-sm font-semibold">{a.title}</p>
            <ul className="list-disc pl-5 text-sm">
              {allDotPoints({ ...t, syllabus: [a], learnTo: [] }).map((d) => <li key={d.id}>{d.text}</li>)}
            </ul>
          </div>
        ))}
      </section>
      <section className="print-break print-card">
        <h2 className="font-display text-xl font-semibold">Key terms</h2>
        <dl className="mt-1 space-y-1 text-sm">
          {GLOSSARY.filter((g) => g.topic === t.id).map((g) => (
            <div key={g.id}><dt className="inline font-semibold">{g.term}: </dt><dd className="inline">{g.definition}</dd></div>
          ))}
        </dl>
      </section>
      {t.revision.formulas.length > 0 && (
        <section className="print-card">
          <h2 className="font-display text-xl font-semibold">Formulas</h2>
          {t.revision.formulas.map((id) => {
            const f = formulaById(id);
            return f ? <div key={id}><Formula latex={f.latex} /></div> : null;
          })}
        </section>
      )}
      <section className="print-card">
        <h2 className="font-display text-xl font-semibold">Common misconceptions</h2>
        <ul className="mt-1 space-y-1 text-sm">{t.revision.misconceptions.map((m) => <li key={m.myth}>✗ {m.myth} → ✓ {m.fact}</li>)}</ul>
      </section>
      <section className="print-card">
        <h2 className="font-display text-xl font-semibold">Exam application</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{t.revision.examApplication.map((m) => <li key={m}>{m}</li>)}</ul>
      </section>
      <p className="text-xs text-stone-500">Aligned with the NESA Business Studies Stage 6 Syllabus (2010). Independent study guide; not endorsed by NESA.</p>
    </article>
  );
}

export function NotFound() {
  return (
    <EmptyState title="Page not found" icon={<Compass className="h-6 w-6" />}>
      <Link to="/" className="underline">Return to the dashboard</Link>
    </EmptyState>
  );
}
