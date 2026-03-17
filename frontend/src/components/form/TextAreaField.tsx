import React from 'react'
import { FieldWrapper, IconDisplay } from './FieldWrapper'
import type { LucideIcon } from 'lucide-react'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  placeholder?: string
  leftIcon?: LucideIcon | string
  rightIcon?: LucideIcon | string
  error?: Array<string>
  field?: AnyFieldApi
}

export const TextAreaField = ({
  label,
  placeholder,
  leftIcon,
  rightIcon,
  error,
  field,
  className,
  onChange,
  onBlur,
  name,
  value,
  ...props
}: TextAreaFieldProps) => {
  const binding = field
    ? {
        name: field.name,
        value: field.state.value,
        onBlur: field.handleBlur,
        onChange: (e: any) => {
          field.handleChange(e.target.value)
          onChange?.(e)
        },
      }
    : { name, value, onBlur, onChange }

  return (
    <FieldWrapper
      label={label}
      name={name}
      field={field}
      error={error}
      leftIcon={leftIcon}
      rightNode={rightIcon ? <IconDisplay icon={rightIcon} /> : null}
      iconAlign="top">
      {({ hasError, name: fieldName }) => (
        <Textarea
          id={fieldName}
          rows={3}
          placeholder={placeholder}
          className={cn(
            'scrollbar-hide rounded-xl transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 focus-visible:ring-offset-0',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            hasError ? 'border-red-500' : 'border-gray-300',
            className,
          )}
          aria-invalid={hasError}
          {...props}
          {...binding}
        />
      )}
    </FieldWrapper>
  )
}
