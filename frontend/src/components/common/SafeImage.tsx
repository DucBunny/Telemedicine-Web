import React, { useState } from 'react'

import defaultPlaceholder from '@/assets/default-avatar.svg'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export const SafeImage = ({
  src,
  alt,
  className,
  fallbackSrc = defaultPlaceholder,
  ...props
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false)

  // Tính toán trực tiếp src cần hiển thị trong lúc render
  const currentSrc = hasError ? fallbackSrc : (src ?? fallbackSrc)

  return (
    <img
      {...props}
      key={src}
      src={currentSrc}
      alt={alt || 'image'}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
