import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../constants'

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? 'border-gray-100 bg-white/95 shadow-sm backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a
          className="flex cursor-pointer items-center gap-2 text-2xl font-bold text-teal-700"
          href="#app">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          MedCare
        </a>

        {/* Desktop Nav */}
        <nav className="hidden gap-8 text-sm font-semibold text-gray-600 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="py-2 transition hover:text-teal-600">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden gap-4 md:flex">
          <Link
            to="/"
            className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
            Đăng nhập
          </Link>
          <a
            href="#community"
            className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800">
            Đăng ký <ArrowRight size={16} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="p-2 text-gray-600 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-100 bg-white px-6 py-4 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-medium text-gray-600"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-gray-100" />
            <Link to="/" className="font-bold text-gray-700">
              Đăng nhập
            </Link>
            <a href="#community" className="font-bold text-teal-600">
              Đăng ký tham gia
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
