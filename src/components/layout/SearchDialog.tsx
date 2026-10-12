import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Search, X } from "lucide-react";
import { search } from "../../content";
import { TOPIC_THEME, cx } from "../../lib/theme";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = useMemo(() => search(q, 12), [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-night-2">
        <div className="flex items-center gap-2 border-b border-stone-200 px-4 dark:border-stone-700">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              }
              if (e.key === "Enter") {
                if (results[active]) go(results[active].to);
                else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
              }
            }}
            placeholder="Search keywords, concepts, formulas, case studies…"
            className="w-full bg-transparent py-3.5 text-base text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-100"
            aria-label="Search query"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
          />
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Close search">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul id="search-results" role="listbox" className="scroll-thin max-h-[60vh] overflow-y-auto p-2">
          {q && results.length === 0 && <li className="p-6 text-center text-sm text-stone-500">No results for “{q}”. Try a broader term such as “ratio”, “JIT” or “leadership”.</li>}
          {!q && (
            <li className="p-4 text-sm text-stone-500">
              Try: <span className="font-medium">critical path</span>, <span className="font-medium">factoring</span>, <span className="font-medium">sugging</span>, <span className="font-medium">enterprise agreement</span>, <span className="font-medium">Toyota</span>
            </li>
          )}
          {results.map((r, i) => (
            <li key={r.id + r.kind} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.to)}
                className={cx("flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left", i === active ? "bg-bronze-50 dark:bg-bronze-900/30" : "")}
              >
                <span className={cx("mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold", r.topic ? TOPIC_THEME[r.topic].chip : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300")}>{r.kind}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-stone-900 dark:text-stone-100">{r.title}</span>
                  <span className="block truncate text-xs text-stone-500">{r.text}</span>
                </span>
                {i === active && <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-stone-400" />}
              </button>
            </li>
          ))}
        </ul>
        {q && (
          <div className="border-t border-stone-200 px-4 py-2 text-xs text-stone-500 dark:border-stone-700">
            <button type="button" className="underline" onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}>
              See all results for “{q}”
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
