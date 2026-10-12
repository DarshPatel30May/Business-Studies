import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Layers, RotateCcw, Shuffle, Check, Repeat } from "lucide-react";
import { GLOSSARY } from "../content";
import { FORMULAS } from "../content/formulas";
import type { TopicId } from "../content/types";
import { TOPIC_THEME, cx } from "../lib/theme";
import { Button, Formula, PageHeader, Segmented, TopicBadge } from "../components/ui";
import { useProgress } from "../state/progress";

interface CardData {
  id: string;
  front: string;
  back: string;
  topic: TopicId;
  latex?: string;
}

const ALL: CardData[] = [
  ...GLOSSARY.map((g) => ({ id: g.id, front: g.term, back: g.definition, topic: g.topic })),
  ...FORMULAS.map((f) => ({ id: `f-${f.id}`, front: `Formula: ${f.name}`, back: f.whenUsed, topic: f.topic, latex: f.latex })),
];

function shuffled<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const { flashcards, setFlashcard } = useProgress();
  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [status, setStatus] = useState<"all" | "learning" | "new">("all");
  const [order, setOrder] = useState<CardData[]>(ALL);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(
    () =>
      order.filter((c) => (topic === "all" || c.topic === topic) && (status === "all" || (status === "learning" ? flashcards[c.id] === "learning" : !flashcards[c.id]))),
    [order, topic, status, flashcards],
  );
  useEffect(() => {
    setI(0);
    setFlipped(false);
  }, [topic, status]);
  const card = deck[Math.min(i, deck.length - 1)];
  const known = ALL.filter((c) => (topic === "all" || c.topic === topic) && flashcards[c.id] === "known").length;
  const totalInTopic = ALL.filter((c) => topic === "all" || c.topic === topic).length;

  const next = () => {
    setFlipped(false);
    setI((x) => (deck.length ? (x + 1) % deck.length : 0));
  };
  const mark = (s: "known" | "learning") => {
    if (!card) return;
    setFlashcard(card.id, s);
    if (status === "all") next();
    else setFlipped(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") {
        setFlipped(false);
        setI((x) => (deck.length ? (x - 1 + deck.length) % deck.length : 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="space-y-6">
      <PageHeader icon={<Layers className="h-6 w-6" />} title="Revision flashcards" subtitle={`${ALL.length} cards drawn from every concept, influence, strategy and formula in the guide. Space flips, arrow keys move.`} />
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Topic" size="sm" value={topic} onChange={setTopic} options={[{ value: "all", label: "All" }, ...(["operations", "marketing", "finance", "hr"] as TopicId[]).map((t) => ({ value: t, label: TOPIC_THEME[t].label }))]} />
        <Segmented label="Card status" size="sm" value={status} onChange={setStatus} options={[{ value: "all", label: "All cards" }, { value: "new", label: "Not yet rated" }, { value: "learning", label: "Still learning" }]} />
        <Button size="sm" variant="secondary" onClick={() => { setOrder(shuffled(ALL)); setI(0); setFlipped(false); }}>
          <Shuffle className="h-4 w-4" /> Shuffle
        </Button>
      </div>
      <p className="text-sm text-stone-500">
        Known: {known}/{totalInTopic} · Deck: {deck.length} cards {deck.length > 0 && `· Card ${Math.min(i, deck.length - 1) + 1}`}
      </p>
      {!card ? (
        <div className="rounded-2xl border border-dashed border-stone-300 p-10 text-center dark:border-stone-700">
          <p className="font-semibold">No cards in this filter.</p>
          <p className="text-sm text-stone-500">Change the filters, or reset your ratings.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <button type="button" onClick={() => setFlipped(!flipped)} className="block w-full text-left [perspective:1200px]" aria-label={flipped ? "Show term" : "Show definition"}>
            <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }} className="relative min-h-64 [transform-style:preserve-3d]">
              <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-8 shadow-sm [backface-visibility:hidden] dark:border-stone-800 dark:bg-night-2">
                <TopicBadge topic={card.topic} />
                <p className="font-display text-3xl font-semibold text-stone-900 dark:text-stone-50">{card.front}</p>
                <p className="text-xs text-stone-400">Tap or press space to reveal</p>
              </div>
              <div className={cx("absolute inset-0 flex flex-col justify-center gap-3 overflow-y-auto rounded-3xl border-2 p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]", TOPIC_THEME[card.topic].border, TOPIC_THEME[card.topic].bgSoft)}>
                {card.latex && <Formula latex={card.latex} />}
                <p className="text-lg leading-relaxed text-stone-800 dark:text-stone-100">{card.back}</p>
              </div>
            </motion.div>
          </button>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <Button variant="ghost" onClick={() => { setFlipped(false); setI((x) => (x - 1 + deck.length) % deck.length); }}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => mark("learning")}>
                <Repeat className="h-4 w-4" /> Still learning
              </Button>
              <Button onClick={() => mark("known")}>
                <Check className="h-4 w-4" /> I know this
              </Button>
            </div>
            <Button variant="ghost" onClick={next}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-6 text-center">
            <Button size="sm" variant="ghost" onClick={() => ALL.filter((c) => topic === "all" || c.topic === topic).forEach((c) => setFlashcard(c.id, null))}>
              <RotateCcw className="h-4 w-4" /> Reset ratings{topic !== "all" ? ` for ${TOPIC_THEME[topic].label}` : ""}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
