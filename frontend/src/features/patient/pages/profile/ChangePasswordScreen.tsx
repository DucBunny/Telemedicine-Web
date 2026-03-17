import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChildPageHeader } from '../../components/common/PageHeader'
import { PasswordInput } from '../../components/profile/PasswordInput'

// ==========================================
// MAIN COMPONENT
// ==========================================

const ChangePasswordScreen: React.FC = () => {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleBack = () => {
    navigate({ to: '/patient/profile' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    console.log('Submit thay đổi mật khẩu:', { currentPassword, newPassword })
    // Sau khi đổi mật khẩu thành công, quay lại profile
    navigate({ to: '/patient/profile' })
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display selection:bg-primary/30 flex min-h-screen flex-col antialiased">
      <ChildPageHeader title="Bảo mật" onBack={handleBack} />

      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-4 py-6">
        <div className="flex justify-center py-2">
          <div className="bg-primary/10 dark:bg-primary/20 flex h-16 w-16 items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-primary text-4xl">
              lock
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <PasswordInput
            label="Mật khẩu hiện tại"
            icon="lock"
            placeholder="Nhập mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <PasswordInput
            label="Mật khẩu mới"
            icon="lock_open"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showStrengthMeter
          />

          <PasswordInput
            label="Xác nhận mật khẩu"
            icon="check_circle"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 mt-4 rounded-xl py-4 font-bold text-white shadow-lg transition-all active:scale-[0.98]">
            Đổi mật khẩu
          </button>
        </form>
      </main>
    </div>
  )
}

export default ChangePasswordScreen
