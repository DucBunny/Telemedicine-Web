import React, { useState } from 'react'

interface PasswordInputProps {
  label: string
  icon: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showStrengthMeter?: boolean
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChange,
  showStrengthMeter,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const getStrengthLevel = (pass: string) => {
    if (pass.length === 0) return 0
    if (pass.length < 6) return 1 // Yếu
    if (pass.length < 8) return 2 // Trung bình
    if (pass.length < 12) return 3 // Khá
    return 4 // Mạnh
  }

  const strength = showStrengthMeter ? getStrengthLevel(value) : 0

  return (
    <div className="group">
      <label className="text-text-primary-light dark:text-text-primary-dark mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="text-text-secondary-light dark:text-text-secondary-dark material-symbols-outlined absolute left-4">
          {icon}
        </span>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light/60 dark:placeholder-text-secondary-dark/60 focus:ring-primary/50 focus:border-primary w-full rounded-xl border py-3.5 pr-12 pl-11 transition-all focus:ring-2 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-text-secondary-light dark:text-text-secondary-dark absolute right-3 rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {showStrengthMeter && (
        <>
          <div className="mt-2 flex h-1 gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-full flex-1 rounded-full transition-colors ${
                  strength >= level
                    ? 'bg-primary'
                    : 'bg-border-light dark:bg-border-dark'
                }`}
              />
            ))}
          </div>
          <p
            className={`mt-1 text-xs transition-colors ${strength >= 2 ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
            Mật khẩu phải có ít nhất 8 ký tự.
          </p>
        </>
      )}
    </div>
  )
}
