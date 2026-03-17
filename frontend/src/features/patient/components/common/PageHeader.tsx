import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  onBack?: () => void
  rightAction?: React.ReactNode
}

// Used for sub-pages that require a back button
export const ChildPageHeader = ({
  title,
  onBack,
  rightAction,
}: PageHeaderProps) => (
  <header className="flex items-center justify-between pt-6 pb-4 md:pt-0">
    {/* Back Button */}
    {onBack ? (
      <Button onClick={onBack} variant="ghost" size="icon-lg">
        <ArrowLeft className="size-5" />
      </Button>
    ) : (
      <div className="w-10" />
    )}

    <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-slate-900">
      {title}
    </h1>

    {rightAction ?? <div className="w-10" />}
  </header>
)

// Used for main pages that don't require a back button
export const MainPageHeader = ({ title, rightAction }: PageHeaderProps) => (
  <header className="flex items-center justify-between pt-6 pb-4 md:pt-0">
    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

    {rightAction ?? <div className="size-10" />}
  </header>
)
