import { useEffect, useMemo, useRef } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, Circle, ExternalLink, Printer, Target, Timer, GraduationCap, AlertTriangle, Zap, Layers } from "lucide-react";
import { SECTIONS, topicById, allDotPoints, GLOSSARY } from "../content";
import { CASE_STUDIES } from "../content/caseStudies";
import { formulaById } from "../content/formulas";
import type { DotPoint, SectionId, TopicContent } from "../content/types";
import { TOPIC_THEME, cx } from "../lib/theme";
import { BlockRenderer } from "../components/content/Blocks";
import { Bar, Callout, Card, Formula, PageHeader, SectionHeading, Tag } from "../components/ui";
import { useProgress } from "../state/progress";
import { useSettings } from "../state/settings";
import { CaseStudyCard } from "./CaseStudiesPage";

export default function TopicPage() {
  const { topicId, section } = useParams();
  const topic = topicById(topicId ?? "");
  const [params] = useSearchParams();
  const focus = params.get("focus");
  const { markVisited } = useProgress();
  const navigate = useNavigate();

  const sectionId = (SECTIONS.find((s) => s.id === section)?.id ?? null) as SectionId | null;
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep the active section tab visible in the horizontally scrolling nav (mobile).
    const bar = tabsRef.current;
    const active = bar?.querySelector<HTMLElement>('[aria-current="page"]');
    if (bar && active) bar.scrollLeft = active.offsetLeft - bar.clientWidth / 2 + active.clientWidth / 2;
  }, [sectionId]);

  useEffect(() => {
    if (topic && sectionId) markVisited(`${topic.id}/${sectionId}`);
  }, [topic, sectionId, markVisited]);

  useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => {
      const el = document.getElementById(focus);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.remove("focus-flash");
        void el.offsetWidth;
        el.classList.add("focus-flash");
      }
    }, 120);
    return () => clearTimeout(t);
  }, [focus, section]);

  if (!topic) return <Navigate to="/" replace />;
  if (!sectionId) return <Navigate to={`/topic/${topic.id}/overview`} replace />;

  const th = TOPIC_THEME[topic.id];
  const Icon = th.icon;
  const idx = SECTIONS.findIndex((s) => s.id === sectionId);
  const prev = SECTIONS[idx - 1];
  const next = SECTIONS[idx + 1];

  return (
    <div>
      <PageHeader topic={topic.id} icon={<Icon className="h-6 w-6" />} title={`Topic ${topic.number}: ${topic.name}`} subtitle={topic.focus}>
        <Link to={`/print/${topic.id}`} className="no-print inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50 dark:border-stone-700 dark:bg-night-3 dark:hover:bg-stone-800">
          <Printer className="h-4 w-4" /> Print summary
        </Link>
      </PageHeader>

      <nav aria-label={`${topic.name} sections`} className="no-print sticky top-[98px] z-10 -mx-4 mb-8 border-b border-stone-200 bg-paper/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 xl:top-[57px] dark:border-stone-800 dark:bg-night/90">
        <div ref={tabsRef} className="scroll-thin relative flex gap-1 overflow-x-auto py-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={`/topic/${topic.id}/${s.id}`}
              aria-current={s.id === sectionId ? "page" : undefined}
              className={cx("shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors", s.id === sectionId ? cx(th.bgSolid, "text-white") : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800")}
            >
              <span className="mr-1 opacity-60">{s.letter}.</span>
              {s.label}
            </Link>
          ))}
        </div>
      </nav>

      {sectionId === "overview" && <Overview topic={topic} />}
      {sectionId === "syllabus" && <Syllabus topic={topic} />}
      {(sectionId === "concepts" || sectionId === "influences" || sectionId === "processes" || sectionId === "strategies") && <BlockRenderer blocks={topic.sections[sectionId]} topic={topic.id} section={sectionId} />}
      {sectionId === "case-studies" && <TopicCases topic={topic} />}
      {sectionId === "revision" && <Revision topic={topic} />}

      <div className="no-print mt-12 flex items-center justify-between gap-3 border-t border-stone-200 pt-6 dark:border-stone-800">
        {prev ? (
          <button type="button" onClick={() => navigate(`/topic/${topic.id}/${prev.id}`)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800">
            <ArrowLeft className="h-4 w-4" /> {prev.letter}. {prev.label}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" onClick={() => navigate(`/topic/${topic.id}/${next.id}`)} className={cx("flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white", th.bgSolid)}>
            {next.letter}. {next.label} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Overview({ topic }: { topic: TopicContent }) {
  const th = TOPIC_THEME[topic.id];
  const { visualOnly } = useSettings();
  const counts = useMemo(() => {
    const c = { concepts: 0, influences: 0, strategies: 0, visuals: 0 };
    for (const blocks of Object.values(topic.sections))
      for (const b of blocks) {
        if (b.kind === "concepts") c.concepts += b.items.length;
        if (b.kind === "influences") c.influences += b.items.length;
        if (b.kind === "strategies") c.strategies += b.items.length;
        if (b.kind === "visual" || b.kind === "flow" || b.kind === "comparison" || b.kind === "proscons") c.visuals += 1;
      }
    return c;
  }, [topic]);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <p className={cx("text-xs font-semibold tracking-wider uppercase", th.text)}>NESA focus</p>
          <p className="mt-1 font-display text-xl leading-snug text-stone-900 dark:text-stone-50">{topic.focus}</p>
          {!visualOnly && <p className="mt-4 text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">{topic.summary}</p>}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Tag>
              <Timer className="mr-1 h-3 w-3" /> {topic.indicativeTime}
            </Tag>
            <Tag>Outcomes: {topic.outcomes.join(", ")}</Tag>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold">In this topic</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-center">
            {[
              ["Concepts", counts.concepts],
              ["Influences", counts.influences],
              ["Strategies", counts.strategies],
              ["Visuals & tools", counts.visuals],
            ].map(([k, v]) => (
              <div key={k} className={cx("rounded-xl p-3", th.bgSoft)}>
                <dd className="text-2xl font-semibold tabular-nums">{v}</dd>
                <dt className="text-xs text-stone-500">{k}</dt>
              </div>
            ))}
          </dl>
        </Card>
      </div>
      <div>
        <SectionHeading title="Main learning goals" />
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {topic.goals.map((g) => (
            <li key={g} className="flex gap-2 rounded-xl border border-stone-200 bg-white p-3 text-sm dark:border-stone-800 dark:bg-night-2">
              <Target className={cx("mt-0.5 h-4 w-4 shrink-0", th.text)} /> {g}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SectionHeading title="Study path" intro="Work through the sections in order, or jump to what you need." />
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.slice(1).map((s) => (
            <Link key={s.id} to={`/topic/${topic.id}/${s.id}`} className="rounded-xl border border-stone-200 bg-white p-3 text-sm font-medium transition-colors hover:border-stone-400 dark:border-stone-800 dark:bg-night-2">
              <span className={cx("mr-1 font-bold", th.text)}>{s.letter}.</span> {s.label}
            </Link>
          ))}
        </div>
      </div>
      <Callout tone="syllabus" title="HSC outcomes addressed">
        H1 critically analyses the role of business in Australia and globally · H2 evaluates management strategies in response to changes in internal and external influences · H3 discusses the social and ethical responsibilities of management · H4 analyses business functions and processes in large and global businesses · H5 explains management strategies and their impact on businesses · H6 evaluates the effectiveness of management in the performance of businesses · H7 plans and conducts investigations into contemporary business issues · H8 organises and evaluates information for actions in business situations · H9 communicates business information, issues and concepts in appropriate formats · H10 applies mathematical concepts appropriately in business situations. This topic: {topic.outcomes.join(", ")}.
      </Callout>
    </div>
  );
}

function DotPointRow({ dp, topicId, depth = 0 }: { dp: DotPoint; topicId: string; depth?: number }) {
  const { checklist, toggleDotPoint } = useProgress();
  const done = !!checklist[dp.id];
  return (
    <>
      <li className={cx("flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-stone-50 dark:hover:bg-night-3", depth > 0 && "ml-7")}>
        <button type="button" onClick={() => toggleDotPoint(dp.id)} aria-pressed={done} aria-label={`${done ? "Mark as not understood" : "Mark as understood"}: ${dp.text}`} className="mt-0.5 shrink-0">
          {done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5 text-stone-300 dark:text-stone-600" />}
        </button>
        <span className={cx("flex-1 text-sm leading-snug", done && "text-stone-500 line-through decoration-stone-300")}>{dp.text}</span>
        {dp.link && (
          <Link to={`/topic/${topicId}/${dp.link.section}${dp.link.anchor ? `?focus=${dp.link.anchor}` : ""}`} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-bronze-700 hover:underline dark:text-bronze-400">
            Study <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </li>
      {dp.children?.map((c) => <DotPointRow key={c.id} dp={c} topicId={topicId} depth={depth + 1} />)}
    </>
  );
}

function Syllabus({ topic }: { topic: TopicContent }) {
  const { checklist } = useProgress();
  const th = TOPIC_THEME[topic.id];
  const dps = allDotPoints(topic);
  const pct = (dps.filter((d) => checklist[d.id]).length / dps.length) * 100;
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Syllabus progress checklist</p>
            <p className="text-sm text-stone-500">Tick a dot point when you can explain it, apply it and give an example.</p>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{Math.round(pct)}%</p>
        </div>
        <Bar value={pct} color={th.hex} className="mt-3" />
      </Card>
      {topic.syllabus.map((area) => (
        <Card key={area.id} className="p-5">
          <h3 className={cx("font-display text-lg font-semibold", th.textStrong)}>{area.title}</h3>
          <p className="mb-2 text-xs font-semibold tracking-wider text-stone-400 uppercase">Students learn about</p>
          <ul className="space-y-0.5">
            {area.learnAbout.map((dp) => (
              <DotPointRow key={dp.id} dp={dp} topicId={topic.id} />
            ))}
          </ul>
        </Card>
      ))}
      <Card className="p-5">
        <h3 className={cx("font-display text-lg font-semibold", th.textStrong)}>Students learn to</h3>
        <ul className="mt-2 space-y-0.5">
          {topic.learnTo.map((dp) => (
            <DotPointRow key={dp.id} dp={dp} topicId={topic.id} />
          ))}
        </ul>
      </Card>
      <Callout tone="syllabus" title="Syllabus wording">
        Dot points are reproduced in condensed form from the NESA Business Studies Stage 6 Syllabus (2010). The 'learn to' statements are paraphrased; check exact wording against the official syllabus document on the NESA website.
      </Callout>
    </div>
  );
}

function TopicCases({ topic }: { topic: TopicContent }) {
  const list = CASE_STUDIES.filter((c) => c.topics.includes(topic.id));
  return (
    <div className="space-y-4">
      <SectionHeading title="Case studies for this topic" intro="Verified, dated examples connecting strategies to real businesses. Open a case study for implementation, evidence, evaluation, sources and an HSC-ready paragraph." />
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c) => (
          <CaseStudyCard key={c.id} c={c} highlight={topic.id} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/case-studies/compare" className="text-sm font-semibold text-bronze-700 underline dark:text-bronze-400">Compare two businesses →</Link>
        <Link to="/case-studies/apply" className="text-sm font-semibold text-bronze-700 underline dark:text-bronze-400">Apply a case study to an HSC question →</Link>
      </div>
    </div>
  );
}

function Revision({ topic }: { topic: TopicContent }) {
  const th = TOPIC_THEME[topic.id];
  const r = topic.revision;
  return (
    <div className="space-y-6">
      <Card className={cx("border-2 p-6", th.border)}>
        <p className={cx("flex items-center gap-2 text-xs font-semibold tracking-wider uppercase", th.text)}>
          <Zap className="h-4 w-4" /> 30-second summary
        </p>
        <p className="mt-2 font-display text-lg leading-relaxed text-stone-900 dark:text-stone-100">{r.thirtySecond}</p>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="flex items-center gap-2 font-semibold">
            <BookOpenCheck className="h-4 w-4" /> Key takeaways
          </p>
          <ol className="mt-3 space-y-2">
            {r.takeaways.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm">
                <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white", th.bgSolid)}>{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </Card>
        <div className="space-y-6">
          <Card className="p-5">
            <p className="font-semibold">Essential terminology</p>
            <dl className="mt-3 space-y-2">
              {r.terms.map((id) => {
                const g = GLOSSARY.find((x) => x.id === id);
                if (!g) return null;
                return (
                  <div key={id} className="text-sm">
                    <dt className={cx("inline font-semibold", th.textStrong)}>{g.term}: </dt>
                    <dd className="inline text-stone-700 dark:text-stone-300">{g.definition}</dd>
                  </div>
                );
              })}
            </dl>
            <Link to="/flashcards" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-bronze-700 dark:text-bronze-400">
              <Layers className="h-4 w-4" /> Practise with flashcards
            </Link>
          </Card>
          <Card className="p-5">
            <p className="font-semibold">Important formulas</p>
            <div className="mt-2 space-y-1">
              {r.formulas.map((id) => {
                const f = formulaById(id);
                return f ? (
                  <Link key={id} to={`/formulas?focus=${id}`} className="block rounded-lg px-2 hover:bg-stone-50 dark:hover:bg-night-3">
                    <Formula latex={f.latex} />
                  </Link>
                ) : null;
              })}
            </div>
            {topic.id === "finance" && <p className="mt-2 text-xs text-stone-500">HSC questions requiring a ratio provide the formula — focus on applying and interpreting it.</p>}
          </Card>
        </div>
      </div>
      <Card className="p-5">
        <p className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-600" /> Common misconceptions
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {r.misconceptions.map((m) => (
            <div key={m.myth} className="rounded-xl border border-stone-200 p-3 text-sm dark:border-stone-800">
              <p className="text-red-700 line-through decoration-red-300 dark:text-red-400">✗ {m.myth}</p>
              <p className="mt-1 text-emerald-800 dark:text-emerald-300">✓ {m.fact}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5">
        <p className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-4 w-4" /> Examination application
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {r.examApplication.map((e) => (
            <li key={e}>• {e}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/exam?topic=${topic.id}`} className={cx("rounded-xl px-4 py-2 text-sm font-semibold text-white", th.bgSolid)}>
            Practise {topic.name} questions
          </Link>
          <Link to={`/print/${topic.id}`} className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold dark:border-stone-700">
            Print-to-PDF summary
          </Link>
        </div>
      </Card>
    </div>
  );
}
