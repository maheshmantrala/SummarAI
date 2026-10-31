
import { useMemo, useState } from "react";
import {
  Newspaper,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CalendarDays,
  Cpu,
  Code2,
  ShieldCheck,
  Laptop,
  Clock3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
const NEWS_API_URL = "https://d2l163kqlg2jao.cloudfront.net/api/news/technology";
const SUMMARIZE_API_URL = "https://d2l163kqlg2jao.cloudfront.net/api/summarize";

const CATEGORY_CONFIG = {
  AI: {
    icon: Sparkles,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    keywords: [
      "artificial intelligence",
      "generative ai",
      "machine learning",
      "llm",
      "openai",
      "chatgpt",
      "claude",
      "gemini",
      "neural network",
      " ai ",
    ],
  },
  "Software Engineering": {
    icon: Code2,
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    keywords: [
      "software",
      "developer",
      "programming",
      "coding",
      "github",
      "javascript",
      "typescript",
      "java",
      "react",
      "spring boot",
      "api",
      "open source",
      "framework",
      "database",
    ],
  },
  Cybersecurity: {
    icon: ShieldCheck,
    color:
      "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    keywords: [
      "cybersecurity",
      "cyber attack",
      "security breach",
      "ransomware",
      "malware",
      "vulnerability",
      "hacker",
      "phishing",
      "data breach",
      "zero-day",
    ],
  },
  Technology: {
    icon: Cpu,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    keywords: [
      "technology",
      "tech",
      "cloud",
      "computer",
      "chip",
      "semiconductor",
      "robotics",
      "smartphone",
      "microsoft",
      "google",
      "apple",
      "amazon",
      "startup",
      "innovation",
    ],
  },
};

const CATEGORY_PRIORITY = [
  "AI",
  "Software Engineering",
  "Cybersecurity",
  "Technology",
];

function getArticleCategory(article) {
  const text = [
    article.title,
    article.description,
    article.content,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const category of CATEGORY_PRIORITY) {
    const keywords = CATEGORY_CONFIG[category].keywords;

    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return "Technology";
}

function getCategoryPriority(article) {
  const category = getArticleCategory(article);
  return CATEGORY_PRIORITY.indexOf(category);
}

function formatPublishedDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRelativeDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return null;

  const difference = Date.now() - date.getTime();
  const hours = Math.floor(difference / (1000 * 60 * 60));

  if (hours >= 0 && hours < 1) return "Less than an hour ago";
  if (hours >= 1 && hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;

  return null;
}

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const [summaries, setSummaries] = useState({});
  const [summarizingUrl, setSummarizingUrl] = useState("");
  const [summaryErrors, setSummaryErrors] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("All");

  async function fetchNews() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(NEWS_API_URL);

      if (!response.ok) {
        throw new Error(
          `Unable to fetch news. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data.articles)) {
        throw new Error("The server returned an unexpected news response.");
      }

      setArticles(data.articles);
      setHasFetched(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to fetch technology news. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function summarizeArticle(article) {
    const articleUrl = article.url;

    if (!articleUrl) {
      setSummaryErrors((current) => ({
        ...current,
        [article.title]: "This article does not have a valid URL.",
      }));
      return;
    }

    const articleText = [
      article.title,
      article.description,
      article.content,
    ]
      .filter(Boolean)
      .join("\n\n")
      .trim();

    if (!articleText) {
      setSummaryErrors((current) => ({
        ...current,
        [articleUrl]: "No article text is available to summarize.",
      }));
      return;
    }

    setSummarizingUrl(articleUrl);

    setSummaryErrors((current) => ({
      ...current,
      [articleUrl]: "",
    }));

    try {
      const response = await fetch(SUMMARIZE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: articleText }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Summarization failed (${response.status}).`
        );
      }

      if (!data?.summary || typeof data.summary !== "string") {
        throw new Error("The server returned no summary.");
      }

      setSummaries((current) => ({
        ...current,
        [articleUrl]: data.summary,
      }));
    } catch (err) {
      setSummaryErrors((current) => ({
        ...current,
        [articleUrl]:
          err.message || "Unable to summarize this article.",
      }));
    } finally {
      setSummarizingUrl("");
    }
  }

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const categoryDifference =
        getCategoryPriority(a) - getCategoryPriority(b);

      if (categoryDifference !== 0) {
        return categoryDifference;
      }

      const dateA = new Date(a.publishedAt || 0).getTime();
      const dateB = new Date(b.publishedAt || 0).getTime();

      return (
        (Number.isNaN(dateB) ? 0 : dateB) -
        (Number.isNaN(dateA) ? 0 : dateA)
      );
    });
  }, [articles]);

  const visibleArticles =
    selectedCategory === "All"
      ? sortedArticles
      : sortedArticles.filter(
          (article) => getArticleCategory(article) === selectedCategory
        );

  const categoryCounts = useMemo(() => {
    const counts = { All: articles.length };

    CATEGORY_PRIORITY.forEach((category) => {
      counts[category] = articles.filter(
        (article) => getArticleCategory(article) === category
      ).length;
    });

    return counts;
  }, [articles]);

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 dark:border-slate-700 dark:from-violet-950/30 dark:via-slate-900 dark:to-indigo-950/20 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-bold tracking-wider text-violet-700 dark:border-violet-500/30 dark:bg-slate-800 dark:text-violet-300">
              <Sparkles size={14} />
              NEWS INTELLIGENCE
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Technology News
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Stay informed on AI, software engineering, cybersecurity,
              and emerging technology. Turn stories into quick insights
              with AI.
            </p>

            {articles.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Newspaper size={14} />
                  {articles.length} articles loaded
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-400" />

                <span className="inline-flex items-center gap-1.5">
                  <Sparkles size={14} />
                  AI-powered summaries
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={fetchNews}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            {loading
              ? "Fetching news..."
              : hasFetched
                ? "Refresh news"
                : "Fetch news"}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div className="flex-1">
              <p className="font-semibold">Unable to load news</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={fetchNews}
                disabled={loading}
                className="mt-2 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Category filters */}
        {articles.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Explore topics
              </h3>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                {visibleArticles.length} shown
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", ...CATEGORY_PRIORITY].map((category) => {
                const active = selectedCategory === category;
                const Icon =
                  category === "All"
                    ? Newspaper
                    : CATEGORY_CONFIG[category].icon;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                      active
                        ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-300"
                    }`}
                  >
                    <Icon size={14} />
                    {category}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {categoryCounts[category]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && articles.length === 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800" />
                <div className="mt-5 h-3 w-1/4 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="mt-3 h-5 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
                <div className="mt-2 h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="mt-5 h-9 w-36 rounded-xl bg-slate-100 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        )}

        {/* Article cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {visibleArticles.map((article) => {
            const category = getArticleCategory(article);
            const categoryConfig = CATEGORY_CONFIG[category];
            const CategoryIcon = categoryConfig.icon;
            const publishedDate = formatPublishedDate(article.publishedAt);
            const relativeDate = formatRelativeDate(article.publishedAt);
            const isSummarizing = summarizingUrl === article.url;
            const summary = summaries[article.url];
            const summaryError = summaryErrors[article.url];

            return (
              <article
                key={article.url || article.title}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500"
              >
                {/* Article image */}
                {article.image && (
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.image}
                      alt=""
                      loading="lazy"
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${categoryConfig.color}`}
                    >
                      <CategoryIcon size={13} />
                      {category}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  {/* Source and date */}
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-violet-700 dark:text-violet-300">
                      <Newspaper size={14} className="shrink-0" />
                      <span className="truncate">
                        {article.source?.name || "Technology News"}
                      </span>
                    </span>

                    {publishedDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {publishedDate}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-7 text-slate-900 transition group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
                    {article.title || "Untitled article"}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {article.description || article.content || "No article description is available."}
                  </p>

                  {/* Date context */}
                  {relativeDate && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Clock3 size={13} />
                      {relativeDate}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => summarizeArticle(article)}
                      disabled={Boolean(summarizingUrl)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
                    >
                      {isSummarizing ? (
                        <RefreshCw className="animate-spin" size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}

                      {isSummarizing
                        ? "Summarizing..."
                        : summary
                          ? "Summarize again"
                          : "Summarize with AI"}
                    </button>

                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700 dark:text-slate-300 dark:hover:text-violet-300"
                      >
                        Read article
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  {/* Summary error */}
                  {summaryError && (
                    <div
                      role="alert"
                      className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                    >
                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0"
                      />
                      <p>{summaryError}</p>
                    </div>
                  )}

                  {/* AI summary */}
                  {summary && (
                    <div className="mt-5 overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50/70 dark:border-violet-500/30 dark:from-violet-500/10 dark:to-indigo-500/5">
                      <div className="flex items-center justify-between gap-3 border-b border-violet-200/70 px-4 py-3 dark:border-violet-500/20">
                        <div className="flex items-center gap-2 text-sm font-bold text-violet-800 dark:text-violet-300">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
                            <Sparkles size={15} />
                          </span>
                          AI Summary
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 size={13} />
                          Generated
                        </span>
                      </div>

                      <div className="p-4">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
                          {summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty states */}
        {!loading && articles.length > 0 && visibleArticles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <Laptop
              className="mx-auto mb-3 text-violet-500"
              size={30}
            />
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              No articles in this category
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try another topic to explore more stories.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              Show all articles
            </button>
          </div>
        )}

        {!loading && articles.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/30">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
              <Newspaper size={27} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your news feed is waiting
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Fetch the latest technology stories and turn useful
              information into quick AI-powered summaries.
            </p>

            <button
              type="button"
              onClick={fetchNews}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <RefreshCw size={16} />
              Discover news
            </button>
          </div>
        )}

        {/* Footer note */}
        {articles.length > 0 && (
          <div className="mt-7 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Categories are estimated from article text. Check the
              original source for full coverage.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-violet-500" />
              Powered by your SummarAI backend
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
