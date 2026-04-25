import { useEffect, useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  className?: string
  showPageInfo?: boolean
  showItemsInfo?: boolean
}

/**
 * Component hiển thị các controls phân trang với ellipsis
 *
 * @example
 * <PaginationControls
 *   currentPage={page}
 *   totalPages={meta.totalPages}
 *   totalItems={meta.total}
 *   itemsPerPage={limit}
 *   onPageChange={setPage}
 *   showItemsInfo
 * />
 */
export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  className,
  showPageInfo = true,
  showItemsInfo = false,
}: PaginationControlsProps) {
  const [mobilePageInput, setMobilePageInput] = useState(String(currentPage))

  useEffect(() => {
    setMobilePageInput(String(currentPage))
  }, [currentPage])

  const submitMobilePage = () => {
    const parsedPage = Number.parseInt(mobilePageInput, 10)
    const nextPage = Number.isNaN(parsedPage)
      ? currentPage
      : Math.min(Math.max(parsedPage, 1), totalPages)

    setMobilePageInput(String(nextPage))

    if (nextPage !== currentPage) {
      onPageChange(nextPage)
    }
  }

  // Tính toán các số trang cần hiển thị
  const pageNumbers = useMemo(() => {
    const delta = 1 // Số trang hiển thị bên trái và phải trang hiện tại
    const range: Array<number> = []
    const rangeWithDots: Array<number | 'ellipsis'> = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'ellipsis')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('ellipsis', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }, [currentPage, totalPages])

  // Tính toán thông tin items
  const itemsInfo = useMemo(() => {
    if (!totalItems) return null

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return { startItem, endItem, totalItems }
  }, [currentPage, itemsPerPage, totalItems])

  if (totalPages < 1) return null

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 lg:flex-row lg:justify-between',
        className,
      )}>
      {/* Items info */}
      {showItemsInfo && itemsInfo && (
        <div className="hidden text-sm text-gray-600 lg:block">
          Hiển thị <span className="font-medium">{itemsInfo.startItem}</span>-
          <span className="font-medium">{itemsInfo.endItem}</span> trong tổng{' '}
          <span className="font-medium">{itemsInfo.totalItems}</span>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-3 whitespace-nowrap">
        {showPageInfo && (
          <div className="hidden text-sm text-gray-600 lg:block">
            Trang {currentPage} / {totalPages}
          </div>
        )}

        {/* Mobile */}
        <Pagination className="lg:hidden">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1)
                  }
                }}
                className={cn(
                  currentPage <= 1 && 'pointer-events-none opacity-50',
                )}
                size="sm"
              />
            </PaginationItem>

            <PaginationItem>
              <div className="flex items-center gap-1.5">
                <Input
                  name="page"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={totalPages}
                  value={mobilePageInput}
                  onChange={(event) => setMobilePageInput(event.target.value)}
                  onBlur={submitMobilePage}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur()
                  }}
                  aria-label="Current page"
                  className="h-8 p-0 text-center text-sm"
                />
                <span className="text-sm text-gray-600">/ {totalPages}</span>
              </div>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1)
                  }
                }}
                className={cn(
                  currentPage >= totalPages && 'pointer-events-none opacity-50',
                )}
                size="sm"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Desktop */}
        <Pagination className="hidden lg:flex">
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1)
                  }
                }}
                className={cn(
                  currentPage <= 1 && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>

            {/* Page numbers */}
            {pageNumbers.map((pageNum, idx) => (
              <PaginationItem key={idx}>
                {pageNum === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(pageNum)}
                    isActive={currentPage === pageNum}
                    size="icon">
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1)
                  }
                }}
                className={cn(
                  currentPage >= totalPages && 'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
