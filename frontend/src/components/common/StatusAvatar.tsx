import React from 'react'

import { SafeImage } from '@/components/common/SafeImage'
import { cn } from '@/lib/utils'

interface StatusAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  isUserOnline: boolean
  sizeDot?: string
}

export const StatusAvatar = ({
  isUserOnline,
  src,
  alt,
  className,
  sizeDot = 'md',
  ...props
}: StatusAvatarProps) => {
  const sizeDotClasses: Record<string, string> = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  }

  return (
    <div className="relative shrink-0">
      <SafeImage
        className={cn(
          'rounded-full border-2 border-white/40 ring-2',
          isUserOnline ? 'ring-green-500' : 'ring-gray-300',
          className,
        )}
        src={src}
        alt={alt || 'avatar'}
        {...props}
      />
      {isUserOnline && (
        <div
          className={cn(
            'absolute right-0 bottom-0 rounded-full border-2 border-white bg-green-500',
            sizeDotClasses[sizeDot],
          )}
        />
      )}
    </div>
  )
}
