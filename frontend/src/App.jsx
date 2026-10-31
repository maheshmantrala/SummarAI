
import { useState, useEffect } from "react";
import NewsSection from "./components/NewsSection";
import TextInputPanel from "./components/TextInputPanel";
import SummaryOutput from "./components/SummaryOutput";
import SummaryInsights from "./components/SummaryInsights";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  FileText,
  Clock3,
  Settings,
  House,
  ArrowRight,
  BookOpen,
  Users,
  Newspaper,
  Sun,
  Moon,
  Menu,
  X,
  WandSparkles,
} from "lucide-react";

const API_URL = "http://localhost:8080/api/summarize";

const examples = [
  {
    title: "Technical Incident",
    category: "Engineering",
    icon: FileText,
    color: "blue",
    text: "On Monday morning, customers reported that they could not access the production environment. The issue started after a configuration change was deployed. Engineers investigated the application logs and identified an authentication configuration problem. The team corrected the settings, restarted the affected service, and verified that access was restored. Additional automated checks will be introduced to prevent similar incidents.",
  },
  {
    title: "Meeting Notes",
    category: "Productivity",
    icon: Users,
    color: "emerald",
    text: "The product team met to review the Q3 roadmap and current delivery progress. The team agreed to prioritize the customer dashboard, improve API response times, and resolve outstanding accessibility issues. Development will begin next Monday. The design team will share updated mockups by Friday, and engineering will provide a progress update during the next weekly review.",
  },
  {
    title: "News Article",
    category: "Technology",
    icon: Newspaper,
    color: "violet",
    text: "A technology company announced a new artificial intelligence platform designed to automate repetitive business tasks. The platform can analyze documents, generate reports, and integrate with enterprise applications. The company plans to launch a limited pilot before making the service available globally. Industry analysts expect competition in enterprise AI to increase as more organizations adopt automation.",
  },
  {
    title: "Short Story",
    category: "Stories",
    icon: BookOpen,
    color: "orange",
    text: "A small village suffered a severe drought that threatened its crops and water supply. Instead of giving up, the villagers worked together to repair an old well, collect rainwater, and share their remaining resources. After several weeks, the first rains arrived. Their cooperation helped the village survive and taught everyone that shared effort can overcome difficult challenges.",
  },
];

const colorStyles = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  orange: "bg-orange-50 text-orange-600 ring-orange-100",
};

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("summarai-theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "summarai-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const originalWordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const summaryWordCount = summary.trim()
    ? summary.trim().split(/\s+/).length
    : 0;

  const reductionPercentage =
    originalWordCount > 0 && summary
      ? Math.max(
          0,
          Math.round(
            (1 - summaryWordCount / originalWordCount) * 100
          )
        )
      : 0;

  const MAX_LENGTH = 5000;

  function chooseExample(example) {
    setText(example.text);
    setSummary("");
    setError("");
  }

  function clearText() {
    setText("");
    setSummary("");
    setError("");
    setCopied(false);
  }

async function generateSummary() {
  if (!text.trim()) {
    setError("Add some text first, and we'll summarize it for you.");
    return;
  }

  setLoading(true);
  setError("");
  setSummary("");
  setCopied(false);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Request failed (${response.status}). Please try again.`
      );
    }

    if (!data?.summary || typeof data.summary !== "string") {
      throw new Error(
        "The server returned no summary. Please try again."
      );
    }

    setSummary(data.summary);
  } catch (err) {
    setError(
      err instanceof TypeError
        ? "Couldn't connect to the backend. Make sure Spring Boot is running and CORS is configured."
        : err.message || "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

async function copySummary() {
  if (!summary) return;

  try {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  } catch {
    setError(
      "Clipboard access failed. You can select and copy the summary manually."
    );
  }
}

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "dark bg-slate-950 text-slate-100"
          : "bg-[#f8f9ff] text-[#11152d]"
      }`}
    >
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r px-5 py-6 backdrop-blur-xl transition-all duration-300
          ${
            darkMode
              ? "border-slate-800 bg-slate-900 text-slate-100"
              : "border-indigo-100/80 bg-white/95 text-slate-900"
          }
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-1">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/20">
              <Sparkles size={25} strokeWidth={2.2} />
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight">
                Summar<span className="text-violet-500">AI</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                AI Text Summarizer
              </div>
            </div>
          </a>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-12 space-y-2">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </div>

          <button
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition ${
              darkMode
                ? "bg-violet-500/15 text-violet-300 ring-violet-500/20"
                : "bg-violet-50 text-violet-700 ring-violet-100"
            }`}
          >
            <House size={18} />
            Summarizer
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>

          <button
            onClick={() =>
              document.getElementById("examples")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-300"
          >
            <BookOpen size={18} />
            Example library
          </button>

          <button
            onClick={() =>
              document.getElementById("summary-panel")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-300"
          >
            <Clock3 size={18} />
            Current result
          </button>

          <button
            onClick={() =>
              document.getElementById("text-input")?.focus()
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-violet-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-violet-300"
          >
            <Settings size={18} />
            Input settings
          </button>
        </div>

        <div
          className={`mt-auto rounded-2xl border p-4 ${
            darkMode
              ? "border-slate-700 bg-slate-800"
              : "border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
            <WandSparkles size={20} />
          </div>

          <p className="mt-4 text-sm font-bold">
            A little less reading.
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Turn information overload into useful takeaways.
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-violet-600 dark:text-violet-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Your workspace is ready
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
            AI
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">
              Personal workspace
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Spring Boot connected app
            </p>
          </div>

          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8 lg:px-10 border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-sm font-bold">Your workspace</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn complexity into clarity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:flex">
              <Sparkles size={14} className="text-violet-500" />
              AI-powered
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-md">
              <span className="text-sm font-bold">S</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-5 pb-12 pt-8 sm:px-8 lg:px-10 lg:pt-10">
          {/* Hero */}
          <section
            className={`relative mb-9 overflow-hidden rounded-[28px] border px-6 py-8 shadow-xl sm:px-9 sm:py-10 ${
              darkMode
                ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 shadow-black/20"
                : "border-white bg-gradient-to-br from-white via-[#f5f3ff] to-[#edf5ff] shadow-indigo-500/10"
            }`}
          >
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="pointer-events-none absolute right-44 top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm dark:border-violet-400/20 dark:bg-slate-800 dark:text-violet-300">
                <Sparkles size={14} />
                Your ideas, distilled
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-[-0.045em] text-slate-900 dark:text-white sm:text-5xl lg:text-[58px]">
                Less text.
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  More meaning.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Bring your long stories, meeting notes and technical reports.
                Get a clear, concise summary in seconds.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Zap size={15} className="text-amber-500" />
                  Quick results
                </span>
                <span className="inline-flex items-center gap-2">
                  <FileText size={15} className="text-violet-500" />
                  Simple workflow
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-500" />
                  API key stays server-side
                </span>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="pointer-events-none absolute -bottom-8 right-8 hidden h-52 w-64 items-center justify-center sm:flex lg:right-14 lg:h-64 lg:w-80">
              <div className="absolute right-10 top-6 h-36 w-28 rotate-[-9deg] rounded-2xl border border-white bg-white/85 p-4 shadow-xl shadow-indigo-500/10">
                <div className="h-2 w-14 rounded-full bg-indigo-200" />
                <div className="mt-4 h-1.5 rounded-full bg-slate-100" />
                <div className="mt-2 h-1.5 w-4/5 rounded-full bg-slate-100" />
                <div className="mt-2 h-1.5 rounded-full bg-slate-100" />
                <div className="mt-2 h-1.5 w-3/5 rounded-full bg-slate-100" />
                <div className="mt-2 h-1.5 w-4/5 rounded-full bg-slate-100" />
              </div>

              <div className="absolute bottom-9 left-5 h-28 w-32 rotate-[7deg] rounded-2xl border border-white bg-white p-4 shadow-xl shadow-violet-500/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                  <Sparkles size={17} />
                </div>
                <div className="mt-3 h-2 w-20 rounded-full bg-violet-200" />
                <div className="mt-2 h-1.5 w-16 rounded-full bg-slate-100" />
                <div className="mt-2 h-1.5 w-20 rounded-full bg-slate-100" />
              </div>

              <div className="absolute right-2 top-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/30">
                <Sparkles size={23} />
              </div>
            </div>
          </section>

          {/* Text summarizer panels */}
          <section className="grid gap-5 xl:grid-cols-2">
            <TextInputPanel
              text={text}
              summary={summary}
              error={error}
              loading={loading}
              maxLength={MAX_LENGTH}
              onTextChange={setText}
              onClearError={() => setError("")}
              onClearText={clearText}
              onGenerateSummary={generateSummary}
            />
            <SummaryOutput
              summary={summary}
              loading={loading}
              error={error}
              copied={copied}
              summaryWordCount={summaryWordCount}
              onCopySummary={copySummary}
              onClearError={() => setError("")}
              onResetSummary={() => { setSummary(""); setError(""); }}
            />
          </section>

          {/* Summary Insights */}
          <SummaryInsights
            summary={summary}
            originalWordCount={originalWordCount}
            summaryWordCount={summaryWordCount}
            reductionPercentage={reductionPercentage}
          />
<NewsSection />
          {/* Example Library */}
          <section id="examples" className="mt-10 scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    <BookOpen size={17} />
                  </div>
                  <h2 className="text-lg font-extrabold tracking-tight">
                    Try a sample
                  </h2>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Choose a story to populate the editor instantly.
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                {examples.length} examples
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {examples.map((example) => {
                const Icon = example.icon;

                return (
                  <button
                    key={example.title}
                    onClick={() => chooseExample(example)}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${colorStyles[example.color]}`}>
                        <Icon size={19} />
                      </div>
                      <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600 dark:text-slate-600" />
                    </div>

                    <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {example.category}
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                      {example.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      {example.text.slice(0, 105)}...
                    </p>
                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-violet-600 dark:border-slate-700 dark:text-violet-300">
                      Use this example
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
  
          {/* Footer */}
          <footer className="mt-12 flex flex-col gap-3 border-t border-slate-200/80 pt-6 text-xs text-slate-400 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-500" />
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                SummarAI
              </span>
              <span>· Built with React &amp; Spring Boot</span>
            </p>
            <p>Made for clearer thinking.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;

         
