import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const TopicPage = lazy(() => import("./pages/TopicPage"));
const SyllabusPage = lazy(() => import("./pages/SyllabusPage"));
const InterdependencePage = lazy(() => import("./pages/InterdependencePage"));
const FormulaCentre = lazy(() => import("./pages/FormulaCentre"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const FinanceLab = lazy(() => import("./pages/FinanceLab"));
const SimulationCentre = lazy(() => import("./pages/SimulationCentre"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const CaseComparePage = lazy(() => import("./pages/CaseComparePage"));
const CaseApplyPage = lazy(() => import("./pages/CaseApplyPage"));
const ReportBuilder = lazy(() => import("./pages/ReportBuilder"));
const ExtendedPlanner = lazy(() => import("./pages/ExtendedPlanner"));
const ExamCentre = lazy(() => import("./pages/ExamCentre"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const BookmarksPage = lazy(() => import("./pages/MiscPages").then((m) => ({ default: m.BookmarksPage })));
const GlossaryPage = lazy(() => import("./pages/MiscPages").then((m) => ({ default: m.GlossaryPage })));
const SearchPage = lazy(() => import("./pages/MiscPages").then((m) => ({ default: m.SearchPage })));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrintSummary = lazy(() => import("./pages/MiscPages").then((m) => ({ default: m.PrintSummary })));
const NotFound = lazy(() => import("./pages/MiscPages").then((m) => ({ default: m.NotFound })));

function TopicRedirect() {
  const { topicId } = useParams();
  return <Navigate to={`/topic/${topicId}/overview`} replace />;
}

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-bronze-200 border-t-bronze-600" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/topic/:topicId" element={<TopicRedirect />} />
          <Route path="/topic/:topicId/:section" element={<TopicPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/interdependence" element={<InterdependencePage />} />
          <Route path="/formulas" element={<FormulaCentre />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/finance-lab" element={<FinanceLab />} />
          <Route path="/simulation" element={<SimulationCentre />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/compare" element={<CaseComparePage />} />
          <Route path="/case-studies/apply" element={<CaseApplyPage />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/report-builder" element={<ReportBuilder />} />
          <Route path="/extended-response" element={<ExtendedPlanner />} />
          <Route path="/exam" element={<ExamCentre />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/print/:topicId" element={<PrintSummary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
