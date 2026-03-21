import { FieldWrapper, IconDisplay } from './FieldWrapper'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { LucideIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption<TValue extends string> {
  value: TValue
  label?: string
}

interface SelectFieldProps<TValue extends string> {
  options: ReadonlyArray<SelectOption<TValue>> | Array<SelectOption<TValue>> // Nhận mảng options từ ngoài vào
  label?: string
  placeholder?: string
  className?: string
  error?: Array<string>
  field?: AnyFieldApi
  value?: TValue
  onChange?: (value: TValue) => void
  onBlur?: () => void
  name?: string
  leftIcon?: LucideIcon | string
  rightIcon?: LucideIcon | string
}

export const SelectField = <TValue extends string>({
  options,
  label,
  placeholder,
  className,
  error,
  field,
  value,
  onChange,
  onBlur,
  name,
  leftIcon,
  rightIcon,
}: SelectFieldProps<TValue>) => {
  const binding = field
    ? {
        name: field.name,
        value: field.state.value as TValue,
        onBlur: field.handleBlur,
        onChange: (val: string) => {
          field.handleChange(val)
          onChange?.(val as TValue)
        },
      }
    : {
        name,
        value,
        onBlur,
        onChange: (val: string) => onChange?.(val as TValue),
      }

  return (
    <FieldWrapper
      label={label}
      field={field}
      error={error}
      name={name}
      leftIcon={leftIcon}
      rightNode={rightIcon ? <IconDisplay icon={rightIcon} /> : null}>
      {({ hasError, name: fieldName }) => (
        <Select
          name={fieldName}
          value={binding.value}
          onValueChange={binding.onChange}>
          <SelectTrigger
            id={fieldName}
            showIcon={false}
            onBlur={binding.onBlur}
            aria-invalid={hasError}
            className={cn(
              'w-full rounded-xl',
              leftIcon && 'pl-10',
              hasError ? 'border-red-500' : 'border-gray-300',
              className,
            )}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position="popper">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label ?? option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldWrapper>
  )
}
