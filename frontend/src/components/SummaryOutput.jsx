
import {
  Check,
  CircleAlert,
  Copy,
  FileText,
  RotateCcw,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";

export default function SummaryOutput({
  summary,
  loading,
  error,
  copied,
  summaryWordCount,
  onCopySummary,
  onClearError,
  onResetSummary,
}) {
  return (
    <div
      id="summary-panel"
      className="flex min-h-[400px] flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
            <WandSparkles size={21} />
          </div>

          <div>
            <h2 className="text-sm font-bold">Your summary</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {summary
                ? "Your results are ready."
                : "The important bits, made clear."}
            </p>
          </div>
        </div>

        {summary && (
          <button
            type="button"
            onClick={onCopySummary}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <CircleAlert size={19} className="mt-0.5 shrink-0" />

          <div className="flex-1 leading-6">{error}</div>

          <button
            type="button"
            onClick={onClearError}
            aria-label="Dismiss error"
            className="rounded-md p-1 hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div
        className={`mt-5 flex flex-1 flex-col rounded-xl border ${
          summary
            ? "border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/60"
            : "items-center justify-center border-slate-100 bg-gradient-to-br from-slate-50 via-white to-violet-50/50 px-6 py-10 text-center dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950/50"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              <Sparkles size={27} className="animate-pulse" />
              <span className="absolute inset-0 animate-ping rounded-2xl border border-violet-300 opacity-40" />
            </div>

            <h3 className="mt-5 text-sm font-bold">
              Finding the key takeaways
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-6 text-slate-500 dark:text-slate-400">
              Your text is being processed. This usually takes a few moments.
            </p>

            <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-violet-100 dark:bg-slate-700">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
            </div>
          </div>
        ) : summary ? (
          <div className="w-full">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Check size={13} />
              Summary generated
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
              {summary}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-[11px] text-slate-400 dark:border-slate-700 dark:text-slate-500">
              <span>{summaryWordCount} words</span>
              <span>·</span>
              <span>{summary.length} characters</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-violet-100 bg-white text-violet-300 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-violet-300">
              <FileText size={32} strokeWidth={1.4} />
            </div>

            <h3 className="mt-5 text-sm font-bold text-slate-800 dark:text-white">
              Your clarity starts here
            </h3>

            <p className="mt-2 max-w-xs text-xs leading-6 text-slate-500 dark:text-slate-400">
              Add your text and click Generate summary. Your AI-generated
              result will appear here.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <Sparkles size={13} className="text-violet-500" />
              Ready when you are
            </div>
          </>
        )}
      </div>

      {summary && (
        <button
          type="button"
          onClick={() => {
            onResetSummary();
            onClearError();
          }}
          className="mt-3 inline-flex items-center gap-2 self-start rounded-lg px-2 py-2 text-xs font-semibold text-slate-500 transition hover:text-violet-700 dark:text-slate-400 dark:hover:text-violet-300"
        >
          <RotateCcw size={14} />
          Generate another summary
        </button>
      )}
    </div>
  );
}
