import { Link } from '@tanstack/react-router'
import { NAVIGATION_ITEMS } from '../config'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  activeTab: string
}

export const MobileNav = ({ activeTab }: MobileNavProps) => {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t border-gray-200 bg-white p-2 shadow-lg md:hidden">
      {NAVIGATION_ITEMS.map((item) => (
        <Button
          key={item.id}
          asChild
          variant="ghost"
          className={cn(
            'flex h-12 flex-1 flex-col gap-0 duration-200',
            activeTab === item.id
              ? 'text-teal-600 hover:text-teal-600'
              : 'text-gray-400 hover:text-gray-600',
          )}>
          <Link to={item.href}>
            <item.icon
              className="size-5"
              strokeWidth={activeTab === item.id ? 2.5 : 2}
            />
            <span className="mt-1 text-[10px] font-medium">
              {item.mobileLabel ?? item.label}
            </span>
          </Link>
        </Button>
      ))}
    </div>
  )
}
