import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DOCTOR_NAVIGATION_ITEMS } from '@/types/navigation'

interface MobileNavProps {
  activeTab: string
}

export const MobileNav = ({ activeTab }: MobileNavProps) => {
  return (
    <div className="right-0 bottom-0 left-0 z-50 flex h-14 items-center bg-white outline outline-gray-100 md:hidden">
      {DOCTOR_NAVIGATION_ITEMS.filter((item) => item.mobileLabel).map(
        (item) => {
          const isActive = activeTab === item.id

          return (
            <Link
              to={item.href}
              key={item.id}
              className="h-full flex-1 active:bg-gray-100">
              <Button
                key={item.id}
                variant="icon"
                className={cn(
                  'relative h-full w-full flex-col gap-0.5 p-0! duration-200',
                  isActive
                    ? 'text-teal-primary hover:text-teal-primary'
                    : 'text-gray-400 hover:text-gray-600',
                )}>
                {isActive && (
                  <div className="bg-teal-primary absolute top-0 h-0.75 w-[calc(100%-8px)] rounded-b-full" />
                )}

                <item.icon className="size-6" strokeWidth={isActive ? 3 : 2} />

                <p
                  className={cn(
                    'text-center text-[10px] text-gray-400',
                    isActive && 'text-teal-primary',
                  )}>
                  {item.mobileLabel ?? item.label}
                </p>
              </Button>
            </Link>
          )
        },
      )}
    </div>
  )
}
