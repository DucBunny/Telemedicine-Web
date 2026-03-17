import { useState } from 'react'
import { FieldWrapper, IconDisplay } from './FieldWrapper'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  label?: string
  className?: string
  placeholder?: string
  error?: Array<string>
  field?: AnyFieldApi
  leftIcon?: LucideIcon | string
  rightIcon?: LucideIcon | string
  name?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  onBlur?: () => void
}

export const DatePicker = ({
  label,
  className,
  placeholder = 'Chọn ngày',
  error,
  field,
  leftIcon,
  rightIcon,
  value,
  onChange,
  onBlur,
  name,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)

  const binding = field
    ? {
        name: field.name,
        value: field.state.value,
        onBlur: field.handleBlur,
        onChange: (date: Date | undefined) => {
          field.handleChange(date)
          onChange?.(date)
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={fieldName}
              variant="outline"
              onBlur={binding.onBlur}
              aria-invalid={hasError}
              className={cn(
                'w-full justify-start rounded-xl px-3 text-sm font-normal',
                !binding.value && 'text-muted-foreground',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                hasError ? 'border-red-500' : 'border-gray-300',
                className,
              )}>
              {binding.value
                ? new Date(binding.value).toLocaleDateString('vi-VN')
                : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={binding.value}
              defaultMonth={binding.value}
              captionLayout="dropdown"
              onSelect={(d) => {
                binding.onChange?.(d)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </FieldWrapper>
  )
}
