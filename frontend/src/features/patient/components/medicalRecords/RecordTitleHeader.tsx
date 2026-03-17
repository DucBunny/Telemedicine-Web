import type { RecordInfo } from '../../data/recordsMockData'

interface RecordTitleHeaderProps {
  record: RecordInfo
}

export const RecordTitleHeader = ({ record }: RecordTitleHeaderProps) => {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">
          {record.code}
        </span>
        {/* <span className="text-text-secondary-light dark:text-text-secondary-dark">
          •
        </span>
        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {record.status}
        </span> */}
      </div>

      <h2 className="text-3xl leading-tight font-bold">{record.title}</h2>
    </div>
  )
}
