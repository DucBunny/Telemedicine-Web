import { useEffect } from 'react'

import { useDoctorLayoutContext } from '@/components/layouts/doctor/DoctorLayoutContext'

export const useDoctorHeaderTitle = (title: string) => {
  const { setHeaderTitle } = useDoctorLayoutContext()

  useEffect(() => {
    setHeaderTitle(title)
    return () => setHeaderTitle('')
  }, [setHeaderTitle, title])
}
