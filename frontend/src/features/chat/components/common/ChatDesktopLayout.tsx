import type { ReactNode } from 'react'

interface ChatDesktopLayoutProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export const ChatDesktopLayout = ({
  leftPanel,
  rightPanel,
}: ChatDesktopLayoutProps) => {
  return (
    <div className="h-full min-h-0">
      <div className="grid h-full min-h-0 grid-cols-12 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="col-span-5 min-h-0 overflow-y-auto border-r border-gray-200 pt-4 xl:col-span-4">
          {leftPanel}
        </div>

        <div className="col-span-7 min-h-0 overflow-hidden xl:col-span-8">
          {rightPanel}
        </div>
      </div>
    </div>
  )
}
