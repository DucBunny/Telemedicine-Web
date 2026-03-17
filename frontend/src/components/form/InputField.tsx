import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FieldWrapper, IconDisplay } from './FieldWrapper'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  type?: string
  placeholder?: string
  leftIcon?: LucideIcon | string
  rightIcon?: LucideIcon | string
  error?: Array<string>
  field?: AnyFieldApi
}

export const InputField = ({
  label,
  type,
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
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

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

  const rightNode = isPassword ? (
    <Button
      variant="icon"
      type="button"
      size="icon"
      onClick={() => setShowPassword(!showPassword)}
      className="-mr-2.5 h-auto text-gray-400 hover:bg-transparent">
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </Button>
  ) : rightIcon ? (
    <IconDisplay icon={rightIcon} />
  ) : null

  return (
    <FieldWrapper
      label={label}
      name={name}
      field={field}
      error={error}
      leftIcon={leftIcon}
      rightNode={rightNode}>
      {({ hasError, name: fieldName }) => (
        <Input
          id={fieldName}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={cn(
            'rounded-xl transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 focus-visible:ring-offset-0',
            leftIcon && 'pl-10',
            rightNode && 'pr-10',
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
