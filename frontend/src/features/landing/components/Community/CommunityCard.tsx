import { Link } from '@tanstack/react-router'
import { Check, ExternalLink, Github } from 'lucide-react'
import type { CommunityCard as CommunityCardType } from '../../config'
import { cn } from '@/lib/utils'

const THEME_STYLES = {
  green: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    checkColor: 'text-green-500',
    titleColor: 'text-gray-900',
  },
  teal: {
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    checkColor: 'text-teal-500',
    titleColor: 'text-teal-700',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    checkColor: 'text-green-500',
    titleColor: 'text-gray-900',
  },
}

export const CommunityCard = ({ data }: { data: CommunityCardType }) => {
  const {
    title,
    subtitle,
    icon: Icon,
    features,
    theme,
    isFeatured,
    action,
  } = data
  const styles = THEME_STYLES[theme]

  // Render nút bấm dựa trên loại action
  const renderButton = () => {
    const btnClass = cn(
      'flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition',
      isFeatured
        ? 'bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700'
        : 'border-2 border-gray-100 text-gray-600 hover:border-gray-900 hover:text-gray-900',
    )

    if (action.type === 'link') {
      return (
        <Link to={action.href} className={btnClass}>
          <ExternalLink size={16} /> {action.label}
        </Link>
      )
    }
    if (action.type === 'external') {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noreferrer"
          className={btnClass}>
          <Github size={16} /> {action.label}
        </a>
      )
    }
    return <button className={btnClass}>{action.label}</button>
  }

  return (
    <div
      className={cn(
        'relative rounded-3xl p-8 transition duration-300 hover:-translate-y-1',
        isFeatured
          ? 'transform border-2 border-teal-500 bg-teal-50/50 shadow-xl md:-translate-y-4 md:hover:-translate-y-5'
          : 'border border-gray-100 bg-white hover:shadow-xl',
      )}>
      {/* Badge for Featured Card */}
      {isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500 px-4 py-1 text-xs font-bold tracking-wider text-white uppercase">
          Hợp tác
        </div>
      )}

      {/* Icon Header */}
      <div className="flex w-full justify-center md:justify-start">
        <div
          className={cn(
            'mb-6 flex h-12 w-12 items-center justify-center rounded-xl',
            styles.iconBg,
            styles.iconColor,
          )}>
          <Icon />
        </div>
      </div>

      <h3 className={cn('mb-2 text-xl font-bold', styles.titleColor)}>
        {title}
      </h3>

      <p
        className={cn(
          'mb-6 text-sm',
          isFeatured ? 'text-teal-600/80' : 'text-gray-500',
        )}>
        {subtitle}
      </p>

      {/* Feature List */}
      <ul className="mb-8 space-y-4 text-sm text-gray-600">
        {features.map((feature, idx) => (
          <li key={idx} className="flex gap-2">
            <Check className={cn('w-5', styles.checkColor)} />
            {feature}
          </li>
        ))}
      </ul>

      {/* Action Button */}
      {renderButton()}
    </div>
  )
}
