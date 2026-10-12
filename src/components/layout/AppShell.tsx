import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
  Briefcase,
  Calculator,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FlaskConical,
  GitCompareArrows,
  Gauge,
  Info,
  Layers,
  LayoutDashboard,
  Library,
  ListChecks,
  Menu,
  Moon,
  Network,
  NotebookPen,
  PenLine,
  Search,
  Sigma,
  Sun,
  Eye,
  X,
  Monitor,
  Lightbulb,
} from "lucide-react";
import { TOPICS, allDotPoints, topicById, SECTIONS } from "../../content";
import { TOPIC_THEME, cx } from "../../lib/theme";
import { useSettings } from "../../state/settings";
import { useProgress } from "../../state/progress";
import { ProgressRing, Segmented } from "../ui";
import { SearchDialog } from "./SearchDialog";

const NAV: { group: string; items: { to: string; label: string; icon: ReactNode }[] }[] = [
  {
    group: "Learn",
    items: [
      { to: "/syllabus", label: "Syllabus explorer", icon: <ListChecks className="h-4 w-4" /> },
      { to: "/interdependence", label: "Interdependence", icon: <Network className="h-4 w-4" /> },
      { to: "/glossary", label: "Glossary", icon: <BookOpen className="h-4 w-4" /> },
    ],
  },
  {
    group: "Labs & tools",
    items: [
      { to: "/formulas", label: "Formula centre", icon: <Sigma className="h-4 w-4" /> },
      { to: "/calculator", label: "Ratio calculator", icon: <Calculator className="h-4 w-4" /> },
      { to: "/finance-lab", label: "Finance lab", icon: <FlaskConical className="h-4 w-4" /> },
      { to: "/simulation", label: "Business simulation", icon: <Gauge className="h-4 w-4" /> },
    ],
  },
  {
    group: "Case studies",
    items: [
      { to: "/case-studies", label: "Case study library", icon: <Library className="h-4 w-4" /> },
      { to: "/case-studies/compare", label: "Compare businesses", icon: <GitCompareArrows className="h-4 w-4" /> },
      { to: "/case-studies/apply", label: "Apply to HSC answer", icon: <Briefcase className="h-4 w-4" /> },
    ],
  },
  {
    group: "HSC preparation",
    items: [
      { to: "/exam", label: "Exam practice", icon: <ClipboardCheck className="h-4 w-4" /> },
      { to: "/report-builder", label: "Business report builder", icon: <FileText className="h-4 w-4" /> },
      { to: "/extended-response", label: "Extended response", icon: <PenLine className="h-4 w-4" /> },
      { to: "/flashcards", label: "Flashcards", icon: <Layers className="h-4 w-4" /> },
    ],
  },
  {
    group: "My revision",
    items: [
      { to: "/progress", label: "Progress & weak topics", icon: <NotebookPen className="h-4 w-4" /> },
      { to: "/bookmarks", label: "Bookmarks", icon: <Bookmark className="h-4 w-4" /> },
      { to: "/about", label: "About & sources", icon: <Info className="h-4 w-4" /> },
    ],
  },
];

function navClass({ isActive }: { isActive: boolean }) {
  return cx(
    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
    isActive ? "bg-bronze-100 font-semibold text-bronze-900 dark:bg-bronze-900/40 dark:text-bronze-100" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { checklist } = useProgress();
  return (
    <nav aria-label="Main" className="flex flex-col gap-5 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 rounded-xl px-1 py-1">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-bronze-700 text-white dark:bg-bronze-500 dark:text-night">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <rect x="3" y="13" width="3.5" height="8" rx="1" fill="currentColor" opacity=".7" />
            <rect x="8.5" y="9" width="3.5" height="12" rx="1" fill="currentColor" opacity=".8" />
            <rect x="14" y="6" width="3.5" height="15" rx="1" fill="currentColor" opacity=".9" />
            <rect x="19.5" y="3" width="2.5" height="18" rx="1" fill="currentColor" />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-semibold text-stone-900 dark:text-stone-50">HSC Business Studies</span>
          <span className="block text-[11px] text-stone-500">2026 visual study guide</span>
        </span>
      </Link>

      <div>
        <NavLink to="/" end onClick={onNavigate} className={navClass}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </NavLink>
      </div>

      <div>
        <p className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">HSC topics</p>
        <div className="flex flex-col gap-0.5">
          {TOPICS.map((t) => {
            const th = TOPIC_THEME[t.id];
            const dps = allDotPoints(t);
            const pct = (dps.filter((d) => checklist[d.id]).length / dps.length) * 100;
            const Icon = th.icon;
            return (
              <NavLink key={t.id} to={`/topic/${t.id}/overview`} onClick={onNavigate} className={({ isActive }) => cx(navClass({ isActive }), "justify-between")}>
                <span className="flex items-center gap-2.5">
                  <span className={cx("grid h-6 w-6 place-items-center rounded-md text-white", th.bgSolid)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="text-[11px] text-stone-400">Topic {t.number} · </span>
                    {t.name}
                  </span>
                </span>
                <ProgressRing value={pct} size={26} stroke={3} color={th.hex} label={`${t.name}: ${Math.round(pct)}% of syllabus checklist complete`} />
              </NavLink>
            );
          })}
        </div>
      </div>

      {NAV.map((g) => (
        <div key={g.group}>
          <p className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">{g.group}</p>
          <div className="flex flex-col gap-0.5">
            {g.items.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.to === "/case-studies"} onClick={onNavigate} className={navClass}>
                {i.icon}
                {i.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

const LABELS: Record<string, string> = {
  syllabus: "Syllabus explorer",
  interdependence: "Interdependence",
  formulas: "Formula centre",
  calculator: "Ratio calculator",
  "finance-lab": "Finance lab",
  simulation: "Business simulation",
  "case-studies": "Case studies",
  compare: "Compare",
  apply: "Apply",
  exam: "Exam practice",
  "report-builder": "Business report builder",
  "extended-response": "Extended response",
  flashcards: "Flashcards",
  progress: "Progress",
  bookmarks: "Bookmarks",
  glossary: "Glossary",
  search: "Search",
  about: "About & sources",
  print: "Print summary",
};

function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const crumbs: { label: string; to: string }[] = [{ label: "Dashboard", to: "/" }];
  if (parts[0] === "topic" && parts[1]) {
    const t = topicById(parts[1]);
    if (t) {
      crumbs.push({ label: `Topic ${t.number}: ${t.name}`, to: `/topic/${t.id}/overview` });
      const s = SECTIONS.find((x) => x.id === parts[2]);
      if (s && s.id !== "overview") crumbs.push({ label: s.label, to: `/topic/${t.id}/${s.id}` });
    }
  } else if (parts[0] === "print" && parts[1]) {
    const t = topicById(parts[1]);
    crumbs.push({ label: `Print summary${t ? ` — ${t.name}` : ""}`, to: pathname });
  } else {
    let acc = "";
    for (const p of parts) {
      acc += "/" + p;
      crumbs.push({ label: LABELS[p] ?? decodeURIComponent(p).replace(/-/g, " "), to: acc });
    }
  }
  return (
    <nav aria-label="Breadcrumb" className="no-print min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
        {crumbs.map((c, i) => (
          <li key={c.to + i} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="truncate font-medium text-stone-800 capitalize dark:text-stone-200">
                {c.label}
              </span>
            ) : (
              <Link to={c.to} className="truncate hover:text-stone-900 hover:underline dark:hover:text-stone-100">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme, mode, setMode, visualOnly, setVisualOnly } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setDrawer(false);
    if (!location.search.includes("focus=")) window.scrollTo({ top: 0 });
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only z-50 rounded-lg bg-bronze-700 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
        Skip to content
      </a>
      <aside className="no-print scroll-thin fixed inset-y-0 left-0 z-30 hidden w-72 overflow-y-auto border-r border-stone-200 bg-white/70 backdrop-blur lg:block dark:border-stone-800 dark:bg-night/80">
        <SidebarContent />
      </aside>

      {drawer && (
        <div className="no-print fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="scroll-thin absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl dark:bg-night-2">
            <button type="button" onClick={() => setDrawer(false)} className="absolute top-3 right-3 rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Close navigation">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-stone-200/80 bg-paper/85 backdrop-blur dark:border-stone-800 dark:bg-night/85">
          <div className="flex items-center gap-3 px-4 py-2.5 sm:px-6">
            <button type="button" onClick={() => setDrawer(true)} className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 lg:hidden dark:text-stone-300 dark:hover:bg-stone-800" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden min-w-0 flex-1 md:block">
              <Breadcrumbs />
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-500 hover:border-stone-300 md:max-w-xs md:flex-none dark:border-stone-700 dark:bg-night-3 dark:text-stone-400"
              aria-label="Search the study guide"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search concepts, formulas…</span>
              <kbd className="ml-auto hidden rounded border border-stone-300 px-1.5 text-[10px] sm:inline dark:border-stone-600">Ctrl K</kbd>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="hidden xl:block">
                <Segmented
                  size="sm"
                  label="Learning mode"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: "beginner", label: <span className="flex items-center gap-1"><Lightbulb className="h-3.5 w-3.5" />Beginner</span> },
                    { value: "advanced", label: "Advanced" },
                  ]}
                />
              </div>
              <button
                type="button"
                onClick={() => setVisualOnly(!visualOnly)}
                aria-pressed={visualOnly}
                className={cx("hidden rounded-lg p-2 sm:block", visualOnly ? "bg-bronze-100 text-bronze-800 dark:bg-bronze-900/50 dark:text-bronze-200" : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800")}
                title="Visual-only revision mode"
                aria-label="Toggle visual-only revision mode"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light")}
                className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                aria-label={`Theme: ${theme}. Click to change`}
                title={`Theme: ${theme}`}
              >
                {theme === "light" ? <Sun className="h-4 w-4" /> : theme === "dark" ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-stone-200/60 px-4 py-1.5 xl:hidden dark:border-stone-800">
            <Segmented
              size="sm"
              label="Learning mode"
              value={mode}
              onChange={setMode}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "advanced", label: "Advanced" },
              ]}
            />
            <button
              type="button"
              onClick={() => setVisualOnly(!visualOnly)}
              aria-pressed={visualOnly}
              className={cx("flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium sm:hidden", visualOnly ? "bg-bronze-100 text-bronze-800 dark:bg-bronze-900/50 dark:text-bronze-200" : "text-stone-600 dark:text-stone-300")}
            >
              <Eye className="h-3.5 w-3.5" /> Visual only
            </button>
          </div>
        </header>
        {visualOnly && (
          <div className="no-print border-b border-bronze-200 bg-bronze-50 px-4 py-1.5 text-center text-xs text-bronze-900 sm:px-6 dark:border-bronze-900 dark:bg-bronze-950/60 dark:text-bronze-100">
            Visual-only revision mode: prose explanations are hidden on topic pages.{" "}
            <button type="button" className="font-semibold underline" onClick={() => setVisualOnly(false)}>
              Show full notes
            </button>
          </div>
        )}
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <footer className="no-print mx-auto max-w-6xl px-4 pb-10 text-xs text-stone-500 sm:px-6 dark:text-stone-500">
          <div className="border-t border-stone-200 pt-4 dark:border-stone-800">
            Independent study guide aligned with the NSW Business Studies Stage 6 Syllabus (2010) for the 2026 HSC. Not produced or endorsed by NESA. Simulations use fictional, illustrative data.{" "}
            <button type="button" className="underline" onClick={() => navigate("/about")}>
              Sources & disclaimer
            </button>
          </div>
        </footer>
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
