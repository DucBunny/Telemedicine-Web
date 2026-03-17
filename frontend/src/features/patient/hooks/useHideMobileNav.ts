import { useEffect } from 'react'
import { useMobileNav } from '@/features/patient/layouts/PatientLayout'

export const useHideMobileNav = () => {
  const { setShowMobileNav } = useMobileNav()

  useEffect(() => {
    // Ẩn MobileNav ngay khi component (sử dụng hook này) được mount
    setShowMobileNav(false)

    // Hiện lại MobileNav khi component đó unmount
    return () => {
      setShowMobileNav(true)
    }
  }, [setShowMobileNav])
}
