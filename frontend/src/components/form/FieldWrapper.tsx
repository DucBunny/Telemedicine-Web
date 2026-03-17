import React from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { LucideIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/form/FieldError'
import { cn } from '@/lib/utils'

// Hàm hiển thị Icon dùng chung
export const IconDisplay = ({
  icon: Icon,
  className,
}: {
  icon: LucideIcon | string
  className?: string
}) => {
  if (!Icon) return null
  return typeof Icon === 'string' ? (
    <span
      className={cn(
        'material-symbols-outlined text-xl! text-slate-400',
        className,
      )}>
      {Icon}
    </span>
  ) : (
    <Icon className={cn('size-5 text-slate-400', className)} />
  )
}

interface FieldWrapperProps {
  label?: string
  name?: string
  field?: AnyFieldApi
  error?: Array<string>
  leftIcon?: LucideIcon | string
  rightNode?: React.ReactNode // Dùng Node để linh hoạt truyền Icon hoặc Button (như nút ẩn/hiện mật khẩu)
  iconAlign?: 'center' | 'top' // Top dành riêng cho Textarea
  children: (props: { hasError: boolean; name?: string }) => React.ReactNode
}

// Component wrapper chung cho các field (Input, Textarea...), xử lý label, icon, lỗi...
export const FieldWrapper = ({
  label,
  name,
  field,
  error,
  leftIcon,
  rightNode,
  iconAlign = 'center',
  children,
}: FieldWrapperProps) => {
  const resolvedErrors = error ?? field?.state.meta.errors
  const hasError = Boolean(resolvedErrors?.length)
  const fieldName = field?.name ?? name

  return (
    <div className="w-full">
      {label && (
        <Label className="text-slate-700" htmlFor={fieldName}>
          {label}
        </Label>
      )}

      <div className="relative mt-1">
        {/* Left Icon */}
        {leftIcon && (
          <div
            className={cn(
              'pointer-events-none absolute left-0 z-10 flex pl-3',
              iconAlign === 'top' ? 'top-3.5' : 'inset-y-0 items-center',
            )}>
            <IconDisplay icon={leftIcon} />
          </div>
        )}

        {/* Lõi Input được render tại đây, tự động nhận prop hasError */}
        {children({ hasError, name: fieldName })}

        {/* Right Icon / Action Button */}
        {rightNode && (
          <div
            className={cn(
              'absolute right-0 z-10 flex pr-3',
              iconAlign === 'top' ? 'top-3.5' : 'inset-y-0 items-center',
            )}>
            {rightNode}
          </div>
        )}
      </div>

      {/* Error Message */}
      {field ? (
        <FieldError field={field} />
      ) : hasError ? (
        <p className="mt-1 text-sm text-red-600">
          {resolvedErrors?.join(', ')}
        </p>
      ) : null}
    </div>
  )
}
