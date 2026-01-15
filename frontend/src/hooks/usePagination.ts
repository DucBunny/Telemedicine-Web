import { useCallback, useMemo, useState } from 'react'

export interface UsePaginationProps {
  initialPage?: number
  initialLimit?: number
  totalItems?: number
}

export interface UsePaginationReturn {
  page: number
  limit: number
  totalPages: number
  canGoNext: boolean
  canGoPrevious: boolean
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  reset: () => void
  getPageNumbers: () => Array<number>
}

/**
 * Hook để quản lý state và logic phân trang
 *
 * @example
 * const pagination = usePagination({
 *   initialPage: 1,
 *   initialLimit: 10,
 *   totalItems: 100
 * })
 */
export function usePagination({
  initialPage = 1,
  initialLimit = 10,
  totalItems = 0,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  // Tính tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / limit) || 1
  }, [totalItems, limit])

  // Kiểm tra có thể đi trang tiếp theo không
  const canGoNext = useMemo(() => {
    return page < totalPages
  }, [page, totalPages])

  // Kiểm tra có thể đi trang trước không
  const canGoPrevious = useMemo(() => {
    return page > 1
  }, [page])

  // Đi tới trang tiếp theo
  const nextPage = useCallback(() => {
    if (canGoNext) {
      setPage((prev) => prev + 1)
    }
  }, [canGoNext])

  // Đi tới trang trước
  const previousPage = useCallback(() => {
    if (canGoPrevious) {
      setPage((prev) => prev - 1)
    }
  }, [canGoPrevious])

  // Đi tới trang cụ thể
  const goToPage = useCallback(
    (pageNumber: number) => {
      const validPage = Math.max(1, Math.min(pageNumber, totalPages))
      setPage(validPage)
    },
    [totalPages],
  )

  // Reset về trang đầu tiên
  const reset = useCallback(() => {
    setPage(initialPage)
    setLimit(initialLimit)
  }, [initialPage, initialLimit])

  // Lấy danh sách số trang để hiển thị (với ellipsis)
  const getPageNumbers = useCallback(() => {
    const delta = 1 // Số trang hiển thị bên trái và phải trang hiện tại
    const range: Array<number> = []
    const rangeWithDots: Array<number> = []

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, -1) // -1 đại diện cho ellipsis
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }, [page, totalPages])

  return {
    page,
    limit,
    totalPages,
    canGoNext,
    canGoPrevious,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    goToPage,
    reset,
    getPageNumbers,
  }
}
