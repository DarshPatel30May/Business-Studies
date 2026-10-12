import { useId, useMemo, type ReactNode, type ButtonHTMLAttributes } from "react";
import katex from "katex";
import { Bookmark, BookmarkCheck, Info, AlertTriangle, GraduationCap, ScrollText } from "lucide-react";
import { TOPIC_THEME, cx } from "../../lib/theme";
import type { TopicId } from "../../content/types";
import { useProgress } from "../../state/progress";

export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className={cx(
        "print-card min-w-0 rounded-2xl border border-stone-200/80 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:border-stone-800 dark:bg-night-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, intro, id, actions }: { eyebrow?: string; title: string; intro?: string; id?: string; actions?: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && <p className="mb-1 text-xs font-semibold tracking-wider text-bronze-600 uppercase dark:text-bronze-400">{eyebrow}</p>}
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
        </div>
        {actions}
      </div>
      {intro && <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">{intro}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, icon, children, topic }: { title: string; subtitle?: string; icon?: ReactNode; children?: ReactNode; topic?: TopicId }) {
  const t = topic ? TOPIC_THEME[topic] : null;
  return (
    <header className={cx("relative mb-8 overflow-hidden rounded-3xl border p-6 sm:p-8", t ? t.border : "border-stone-200 dark:border-stone-800", "bg-white dark:bg-night-2")}>
      <div className={cx("pointer-events-none absolute inset-0 bg-gradient-to-br", t ? t.gradient : "from-bronze-500/10 via-bronze-500/5 to-transparent")} />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && <div className={cx("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", t ? `${t.bgSolid} text-white` : "bg-bronze-600 text-white")}>{icon}</div>}
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">{title}</h1>
            {subtitle && <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", className ?? "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300")}>{children}</span>;
}

export function TopicBadge({ topic, short }: { topic: TopicId; short?: boolean }) {
  const t = TOPIC_THEME[topic];
  return <Badge className={t.chip}>{short ? t.label.split(" ")[0] : t.label}</Badge>;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm",
        variant === "primary" && "bg-bronze-700 text-white hover:bg-bronze-800 dark:bg-bronze-500 dark:text-night dark:hover:bg-bronze-400",
        variant === "secondary" && "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-night-3 dark:text-stone-200 dark:hover:bg-stone-800",
        variant === "ghost" && "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
    />
  );
}

export function Segmented<T extends string>({ value, onChange, options, label, size = "md" }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; label?: string; size?: "sm" | "md" }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-xl border border-stone-200 bg-stone-100/70 p-1 dark:border-stone-800 dark:bg-night-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "rounded-lg font-medium transition-colors",
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
            value === o.value ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-white" : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Select<T extends string>({ label, value, onChange, options, className }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; className?: string }) {
  const id = useId();
  return (
    <div className={cx("block", className)}>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-400">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-stone-700 dark:bg-night-3 dark:text-stone-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NumberField({ label, value, onChange, prefix, suffix, step = 1, min, max, hint, error }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; step?: number; min?: number; max?: number; hint?: string; error?: string }) {
  const id = useId();
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-400">{label}</label>
      <div className={cx("flex items-center rounded-xl border bg-white dark:bg-night-3", error ? "border-red-500" : "border-stone-300 dark:border-stone-700")}>
        {prefix && <span className="pl-3 text-sm text-stone-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full min-w-0 rounded-xl bg-transparent px-3 py-2 text-sm text-stone-900 tabular-nums outline-none dark:text-stone-100"
        />
        {suffix && <span className="pr-3 text-sm text-stone-500">{suffix}</span>}
      </div>
      {error ? <span id={`${id}-msg`} className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span> : hint ? <span id={`${id}-msg`} className="mt-1 block text-xs text-stone-500">{hint}</span> : null}
    </div>
  );
}

export function Slider({ label, value, onChange, min, max, step = 1, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string }) {
  const id = useId();
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
        <span>{label}</span>
        <span className="tabular-nums text-stone-900 dark:text-stone-100">{format ? format(value) : value}</span>
      </span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-bronze-600" />
    </label>
  );
}

export function Callout({ tone = "info", title, children }: { tone?: "info" | "exam" | "warning" | "syllabus"; title?: string; children: ReactNode }) {
  const styles = {
    info: { box: "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40", icon: <Info className="h-4 w-4 text-sky-700 dark:text-sky-300" /> },
    exam: { box: "border-bronze-200 bg-bronze-50 dark:border-bronze-800 dark:bg-bronze-950/50", icon: <GraduationCap className="h-4 w-4 text-bronze-700 dark:text-bronze-300" /> },
    warning: { box: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40", icon: <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300" /> },
    syllabus: { box: "border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-night-3", icon: <ScrollText className="h-4 w-4 text-stone-600 dark:text-stone-300" /> },
  }[tone];
  return (
    <div className={cx("rounded-2xl border p-4 text-sm leading-relaxed", styles.box)}>
      {title && (
        <p className="mb-1 flex items-center gap-2 font-semibold text-stone-900 dark:text-stone-100">
          {styles.icon}
          {title}
        </p>
      )}
      <div className="text-stone-700 dark:text-stone-300">{children}</div>
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function Formula({ latex, display = true, className }: { latex: string; display?: boolean; className?: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, { displayMode: display, throwOnError: false, output: "html" });
    } catch {
      return latex;
    }
  }, [latex, display]);
  if (display) return <div className={cx("max-w-full overflow-x-auto text-stone-900 dark:text-stone-100", className)} dangerouslySetInnerHTML={{ __html: html }} />;
  return <span className={cx("text-stone-900 dark:text-stone-100", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ProgressRing({ value, size = 44, stroke = 5, color = "#b07a43", label }: { value: number; size?: number; stroke?: number; color?: string; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={label ?? `${Math.round(pct)}% complete`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-stone-200 dark:stroke-stone-700" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={color} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} style={{ transition: "stroke-dashoffset .5s" }} />
      </svg>
      <span className="absolute text-[11px] font-semibold tabular-nums text-stone-700 dark:text-stone-200">{Math.round(pct)}%</span>
    </div>
  );
}

export function Bar({ value, color = "#b07a43", className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800", className)}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "good" | "bad" | "neutral" }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-night-2">
      <p className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</p>
      <p className={cx("mt-1 text-2xl font-semibold tabular-nums", tone === "good" ? "text-emerald-700 dark:text-emerald-400" : tone === "bad" ? "text-red-600 dark:text-red-400" : "text-stone-900 dark:text-stone-50")}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{sub}</p>}
    </div>
  );
}

export function BookmarkButton({ id, title, to, kind, topic }: { id: string; title: string; to: string; kind: string; topic?: TopicId }) {
  const { isBookmarked, toggleBookmark } = useProgress();
  const on = isBookmarked(id);
  return (
    <button
      type="button"
      onClick={() => toggleBookmark({ id, title, to, kind, topic })}
      className={cx("no-print rounded-lg p-1.5 transition-colors", on ? "text-bronze-600 dark:text-bronze-400" : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-200")}
      aria-pressed={on}
      aria-label={on ? `Remove bookmark: ${title}` : `Bookmark: ${title}`}
      title={on ? "Remove bookmark" : "Bookmark for revision"}
    >
      {on ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "bad" | "warn" }) {
  const c = {
    neutral: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    good: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    bad: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    warn: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  }[tone];
  return <span className={cx("inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold", c)}>{children}</span>;
}

export function EmptyState({ title, children, icon }: { title: string; children?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center dark:border-stone-700">
      {icon && <div className="mx-auto mb-3 grid h-10 w-10 place-items-center text-stone-400">{icon}</div>}
      <p className="font-semibold text-stone-800 dark:text-stone-200">{title}</p>
      {children && <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">{children}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, tabs, ariaLabel }: { value: T; onChange: (v: T) => void; tabs: { id: T; label: ReactNode }[]; ariaLabel: string }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="scroll-thin flex gap-1 overflow-x-auto border-b border-stone-200 dark:border-stone-800">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            "-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            value === t.id ? "border-bronze-600 text-stone-900 dark:border-bronze-400 dark:text-white" : "border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 6, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  const id = useId();
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-400">{label}</label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm leading-relaxed text-stone-900 dark:border-stone-700 dark:bg-night-3 dark:text-stone-100"
      />
    </div>
  );
}

export function Checkbox({ checked, onChange, label, className }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; className?: string }) {
  return (
    <label className={cx("flex cursor-pointer items-start gap-2.5 text-sm", className)}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded accent-bronze-600" />
      <span className="leading-snug">{label}</span>
    </label>
  );
}
