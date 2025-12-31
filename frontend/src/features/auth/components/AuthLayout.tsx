import React from 'react'
import { Link } from '@tanstack/react-router'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 p-4">
      <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 opacity-20 blur-[80px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-125 w-125 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400 opacity-20 blur-[80px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-teal-700">
            <img src="/logo.png" alt="MedCare Logo" className="h-8 w-8" />
            MedCare
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Form Content */}
        {children}
      </div>
    </div>
  )
}
