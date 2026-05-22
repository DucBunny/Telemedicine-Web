import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useMatches } from '@tanstack/react-router'
import { useMediaQuery } from 'usehooks-ts'

import type { DoctorStats } from '@/features/dashboard/types'

import { useRealtimeAlerts } from '@/features/alerts/hooks/useAlertQueries'
import { useGetDashboardStats } from '@/features/dashboard/hooks/useGetStats'
import {
  useGetUnreadNotificationCount,
  useRealtimeNotifications,
} from '@/features/notifications/hooks/useNotificationQueries'
import {
  DoctorHeader,
  DoctorSidebar,
  MobileNav,
} from '@/components/layouts/doctor'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { routeToActiveTab } from '@/lib/route-active-tab'
import { DOCTOR_NAVIGATION_ITEMS } from '@/types/navigation'

import './styles.css'

const FLASH_DURATION_MS = 1200
const FLASH_COOLDOWN_MS = 3000

export const DoctorLayout = () => {
  const [alertFlash, setAlertFlash] = useState(false)

  /** Chỉ chặn nháy sau khi handling hoặc resolved — không chặn khi ECG normal */
  const suppressedAlertIdsRef = useRef(new Set<number>()) // Set chứa các alertId đã bị chặn
  const flashCooldownRef = useRef(new Map<number, number>()) // Map chứa các alertId và timestamp nháy gần nhất
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null) // Timer để chặn nháy

  /** Dừng nháy hẳn khi alert được claim hoặc resolved */
  const stopAlertFlash = useCallback((alertId: number) => {
    suppressedAlertIdsRef.current.add(alertId)
    flashCooldownRef.current.delete(alertId)
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current)
      flashTimerRef.current = null
    }
    setAlertFlash(false)
  }, [])

  /** Reset cooldown khi alert được claim hoặc resolved */
  const resetFlashCooldown = useCallback((alertId: number) => {
    flashCooldownRef.current.delete(alertId)
  }, [])

  /** Trigger nháy khi alert được tạo */
  const triggerAlertFlash = useCallback((payload: { alertId: number }) => {
    const { alertId } = payload
    if (suppressedAlertIdsRef.current.has(alertId)) return

    const lastAt = flashCooldownRef.current.get(alertId) ?? 0
    if (Date.now() - lastAt < FLASH_COOLDOWN_MS) return
    flashCooldownRef.current.set(alertId, Date.now())

    if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    setAlertFlash(true)
    flashTimerRef.current = setTimeout(() => {
      setAlertFlash(false)
      flashTimerRef.current = null
    }, FLASH_DURATION_MS)
  }, [])

  // Clear timer khi component unmount
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
    }
  }, [])

  const { pathname } = useLocation()
  const activeTab = routeToActiveTab(pathname)

  const matches = useMatches()

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Lấy thông tin từ staticData của route hiện tại
  // reverse để ưu tiên lấy thông tin từ route con trước, sau đó mới đến route cha
  const {
    hideMobileNav: isHiddenMobileNav,
    hideHeader: isHiddenHeader,
    title,
  } = matches
    .reverse()
    .find(
      (match) =>
        match.staticData.title ||
        match.staticData.hideMobileNav ||
        match.staticData.hideHeader,
    )?.staticData || {}

  const pageTitle =
    title ||
    DOCTOR_NAVIGATION_ITEMS.find((item) => item.id === activeTab)?.label ||
    ''

  useRealtimeNotifications()
  useRealtimeAlerts({
    onAlertFlash: triggerAlertFlash,
    onAlertCalm: resetFlashCooldown,
    onStopAlertFlash: stopAlertFlash,
  })

  // Lấy số lượng thông báo chưa đọc từ API
  const { data: unreadNotificationCount = 0 } = useGetUnreadNotificationCount()
  const { data: statsData = { totalAlertsPending: 0 } } =
    useGetDashboardStats<DoctorStats>()

  return (
    <SidebarProvider className="fixed h-dvh max-h-dvh overflow-hidden font-sans">
      {alertFlash ? (
        <div
          className="pointer-events-none fixed inset-0 z-100 animate-pulse bg-red-500/25"
          aria-hidden
        />
      ) : null}
      <DoctorSidebar
        activeTab={activeTab}
        unreadNotificationCount={unreadNotificationCount}
        pendingAlertCount={statsData.totalAlertsPending}
      />

      {/* Main Content */}
      <SidebarInset className="min-h-0 overflow-hidden">
        {(isDesktop || !isHiddenHeader) && (
          <DoctorHeader
            unreadNotificationCount={unreadNotificationCount}
            pendingAlertCount={statsData.totalAlertsPending}
            title={pageTitle}
          />
        )}

        <div
          data-route-scroll-container="true"
          className="min-h-0 w-full flex-1 overflow-y-auto scroll-smooth bg-gray-50 md:p-6 lg:p-8">
          <Outlet />
        </div>

        {/* Mobile Navigation */}
        {!isHiddenMobileNav && <MobileNav activeTab={activeTab} />}
      </SidebarInset>
    </SidebarProvider>
  )
}
