import { FileText, Sparkles, Zap } from "lucide-react";

export default function SummaryInsights({ summary, originalWordCount, summaryWordCount, reductionPercentage }) {
  if (!summary) return null;

  return (
            <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Original words
                  </span>
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                    <FileText size={19} />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {originalWordCount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Words in your input text
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Summary words
                  </span>
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <Sparkles size={19} />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {summaryWordCount.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Words in your AI summary
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Text reduction
                  </span>
                  <div className="rounded-xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                    <Zap size={19} />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {reductionPercentage}%
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Fewer words than the original
                </p>
              </div>
            </section>
  );
}
