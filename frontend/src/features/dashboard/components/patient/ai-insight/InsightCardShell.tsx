import { Info } from 'lucide-react'

import type { ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface InsightCardShellProps {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export const InsightCardShell = ({
  title,
  description,
  children,
  className,
}: InsightCardShellProps) => (
  <div
    className={cn(
      'flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm',
      className,
    )}>
    <div className="mb-2 flex items-center gap-1.5">
      <h4 className="text-xs font-semibold tracking-wide text-slate-700 uppercase">
        {title}
      </h4>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="size-3.5 text-slate-400" />
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </div>
    {children}
  </div>
)
