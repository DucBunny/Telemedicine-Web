interface CostSummaryProps {
  cost: string
}

export const CostSummary = ({ cost }: CostSummaryProps) => (
  <section>
    <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
      Chi phí dự kiến
    </h2>
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Phí tư vấn
      </span>
      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {cost}
      </span>
    </div>
  </section>
)
