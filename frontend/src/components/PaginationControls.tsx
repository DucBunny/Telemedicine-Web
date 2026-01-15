import { useMemo } from 'react'
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

  if (totalPages <= 1) return null

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 sm:flex-row sm:justify-between',
        className,
      )}>
      {/* Items info */}
      {showItemsInfo && itemsInfo && (
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-medium">{itemsInfo.startItem}</span>-
          <span className="font-medium">{itemsInfo.endItem}</span> trong tổng{' '}
          <span className="font-medium">{itemsInfo.totalItems}</span>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center gap-3 whitespace-nowrap">
        {showPageInfo && (
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </div>
        )}

        <Pagination>
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
                    isActive={currentPage === pageNum}>
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
