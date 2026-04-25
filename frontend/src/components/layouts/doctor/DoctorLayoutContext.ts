import { createContext, useContext } from 'react'

export interface DoctorLayoutOutletContext {
  setHeaderTitle: (title: string) => void
}

const noop = () => undefined

export const DoctorLayoutContext =
  createContext<DoctorLayoutOutletContext>({
    setHeaderTitle: noop,
  })

export const useDoctorLayoutContext = () => useContext(DoctorLayoutContext)
