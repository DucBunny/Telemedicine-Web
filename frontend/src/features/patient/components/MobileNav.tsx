import { Link } from '@tanstack/react-router'
import { NAVIGATION_ITEMS } from '@/features/patient/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  activeTab: string
}

export const MobileNav = ({ activeTab }: MobileNavProps) => {
  return (
    <div className="right-0 bottom-0 left-0 z-50 flex items-center justify-between gap-1 border-t border-gray-200 bg-white shadow-lg md:hidden">
      {NAVIGATION_ITEMS.filter((item) => item.mobileLabel).map((item) => (
        <Button
          key={item.id}
          asChild
          variant="ghost"
          className={cn(
            'flex h-16 flex-1 flex-col gap-0 rounded-none duration-200',
            activeTab === item.id
              ? 'text-teal-primary hover:text-teal-primary border-t-teal-primary fill-teal-primary border-t-3 hover:bg-transparent'
              : 'text-gray-400 hover:text-gray-600',
          )}>
          <Link to={item.href}>
            <item.icon
              className="size-6"
              strokeWidth={activeTab === item.id ? 3 : 2}
            />
            {/* <span className="mt-1 text-[10px] font-medium">
              {item.mobileLabel}
            </span> */}
          </Link>
        </Button>
      ))}
    </div>
  )
}
