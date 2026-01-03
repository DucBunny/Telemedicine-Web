import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { FieldError } from './FieldError'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { LucideIcon } from 'lucide-react'

type InputFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children'
> & {
  label?: string
  type?: string
  placeholder?: string
  icon?: LucideIcon
  error?: Array<string>
  field?: AnyFieldApi
  children?: (field: AnyFieldApi) => React.ReactNode
}

export const InputField = ({
  label,
  type,
  placeholder,
  icon: Icon,
  error,
  field,
  children,
  className,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const resolvedErrors = error ?? field?.state.meta.errors
  const hasError = Boolean(resolvedErrors && resolvedErrors.length)

  const { onChange, onBlur, name, value, ...restProps } = props

  const bindToField = field
    ? {
        name: field.name,
        value: field.state.value,
        onBlur: field.handleBlur,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          field.handleChange(e.target.value),
      }
    : { name, value, onBlur, onChange }

  if (children) {
    if (!field) {
      return null
    }

    return (
      <div className="mb-4">
        {children(field)}
        <FieldError field={field} />
      </div>
    )
  }

  return (
    <div className="mb-4">
      {label ? (
        <Label className="text-gray-600" htmlFor={bindToField.name}>
          {label}
        </Label>
      ) : null}
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {Icon ? <Icon className="h-5 w-5 text-gray-400" /> : null}
        </div>
        <Input
          id={bindToField.name}
          type={inputType}
          className={`rounded-xl pl-10 shadow-sm transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 focus-visible:ring-offset-0 ${
            hasError ? 'border-red-500' : 'border-gray-300'
          } ${className ?? ''}`}
          placeholder={placeholder}
          aria-invalid={hasError || undefined}
          {...restProps}
          {...bindToField}
        />
        {isPassword && (
          <Button
            variant="icon"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 h-full text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        )}
      </div>
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
