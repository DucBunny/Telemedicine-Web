import { create } from 'zustand'

interface HeaderStore {
  title: string
  setTitle: (title: string) => void
}

// Zustand store để quản lý tiêu đề header động
export const useHeaderTitleStore = create<HeaderStore>((set) => ({
  // Initial state
  title: '',

  // Action
  setTitle: (title: string) => set({ title }),
}))
