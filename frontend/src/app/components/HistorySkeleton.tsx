export function HistorySkeleton() {
  return (
    <div className="p-6 space-y-6 w-full animate-pulse">
      {/* Header */}
      <div>
        <div className="h-7 w-40 bg-slate-200 rounded-lg" />
        <div className="h-4 w-64 bg-slate-100 rounded mt-2" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-slate-100 rounded-lg" />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-40 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
            <div className="h-6 w-28 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* P&L / Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 space-y-4">
            <div className="h-5 w-40 bg-slate-200 rounded" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex justify-between">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-5 py-4 border-b border-border/40 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-3 w-32 bg-slate-50 rounded" />
            </div>
            <div className="h-5 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
