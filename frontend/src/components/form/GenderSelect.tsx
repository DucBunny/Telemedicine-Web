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

type GenderOption = 'male' | 'female' | 'other'

interface GenderComboboxProps {
  label?: string
  placeholder?: string
  className?: string
  error?: Array<string>
  field?: AnyFieldApi
  value?: GenderOption
  onChange?: (value: GenderOption) => void
  onBlur?: () => void
  name?: string
  leftIcon?: LucideIcon | string
  rightIcon?: LucideIcon | string
}

export const genderOptions = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const

export const GenderSelect = ({
  label,
  placeholder = 'Chọn giới tính',
  className,
  error,
  field,
  value,
  onChange,
  onBlur,
  name,
  leftIcon,
  rightIcon,
}: GenderComboboxProps) => {
  const binding = field
    ? {
        name: field.name,
        value: field.state.value,
        onBlur: field.handleBlur,
        onChange: (val: any) => {
          field.handleChange(val)
          onChange?.(val)
        },
      }
    : { name, value, onBlur, onChange }

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
              'w-full rounded-xl transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 focus-visible:ring-offset-0',
              leftIcon && 'pl-10',
              hasError ? 'border-red-500' : 'border-gray-300',
              className,
            )}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position="popper">
            {genderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldWrapper>
  )
}
