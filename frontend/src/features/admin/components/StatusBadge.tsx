interface StatusBadgeProps {
  status: 'active' | 'locked' | 'maintenance' | 'inactive'
  type?: 'user' | 'device' | 'default'
}

export const StatusBadge = ({ status, type = 'default' }: StatusBadgeProps) => {
  const styles = {
    // User Status
    active: 'bg-green-100 text-green-800',
    locked: 'bg-red-100 text-red-800',
    // Device Status
    maintenance: 'bg-orange-100 text-orange-800',
    inactive: 'bg-gray-100 text-gray-600',
  }

  const labels = {
    active: 'Hoạt động',
    locked: 'Đã khóa',
    maintenance: 'Bảo trì',
    inactive: 'Không hoạt động',
  }

  const className = styles[status] || styles.active // Default fallback

  return (
    <span
      className={`rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {labels[status] || status}
    </span>
  )
}
