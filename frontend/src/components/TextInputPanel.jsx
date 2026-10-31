
import { ArrowRight, FileText, Sparkles, Trash2 } from "lucide-react";

export default function TextInputPanel({
  text,
  summary,
  error,
  loading,
  maxLength,
  onTextChange,
  onClearError,
  onClearText,
  onGenerateSummary,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-violet-200 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20">
            <FileText size={21} />
          </div>

          <div>
            <h2 className="text-sm font-bold">Your text</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Paste the content you want to simplify.
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 pt-1 text-xs font-medium ${
            text.length >= maxLength
              ? "text-rose-600"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {text.length.toLocaleString()}/{maxLength.toLocaleString()}
        </span>
      </div>

      <div className="mt-5">
        <textarea
          id="text-input"
          value={text}
          maxLength={maxLength}
          onChange={(event) => {
            onTextChange(event.target.value);
            onClearError();
          }}
          placeholder={
            "Paste your text here...\n\nTry a meeting summary, an incident report, an article, or a story."
          }
          className="min-h-[245px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100/70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:bg-slate-800 dark:focus:ring-violet-500/10"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onClearText}
          disabled={!text && !summary && !error}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Trash2 size={15} />
          Clear
        </button>

        <button
          onClick={onGenerateSummary}
          disabled={loading || !text.trim()}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Summarizing...
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Generate summary
              <ArrowRight
                size={15}
                className="transition group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-400 dark:text-slate-500">
        Your text is sent to your Spring Boot backend for processing.
      </p>
    </div>
  );
}
