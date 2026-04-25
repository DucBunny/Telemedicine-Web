interface StatCardProps {
  label: string
  value: string
  icon: string
  iconBgClass: string
}

export const StatCard = ({
  label,
  value,
  icon,
  iconBgClass,
}: StatCardProps) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center gap-2">
      <div
        className={`flex size-8 items-center justify-center rounded-full ${iconBgClass}`}>
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: '"FILL" 1', fontSize: '18px' }}>
          {icon}
        </span>
      </div>
      <span className="text-xs font-medium text-slate-500 md:text-sm">
        {label}
      </span>
    </div>
    <p
      className={`font-bold text-slate-900 ${value.length > 5 ? 'pt-1 text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}>
      {value}
    </p>
  </div>
)
