import { create } from 'zustand'

interface PresenceStore {
  // Dùng Record để tra cứu trạng thái nhanh, ví dụ: { 101: true, 105: true }
  onlineUsers: Record<number, boolean>

  // Actions
  setInitialStatuses: (statuses: Record<number, boolean>) => void
  setOnline: (userId: number) => void
  setOffline: (userId: number) => void
  clearPresence: () => void
}

/**
 * Zustand store để quản lý trạng thái online/offline của user liên quan đến user hiện tại
 * - onlineUsers: Record để tra cứu trạng thái nhanh
 */
export const usePresenceStore = create<PresenceStore>((set) => ({
  onlineUsers: {},

  // Set trạng thái ban đầu
  setInitialStatuses: (statuses: Record<number, boolean>) =>
    set({ onlineUsers: statuses }),

  // Set online
  setOnline: (userId: number) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: true },
    })),

  // Cập nhật khi có event Socket OFFLINE
  setOffline: (userId: number) =>
    set((state) => {
      const newOnlineUsers = { ...state.onlineUsers }
      delete newOnlineUsers[userId]
      return { onlineUsers: newOnlineUsers }
    }),

  // Xóa sạch data khi user logout
  clearPresence: () => set({ onlineUsers: {} }),
}))
