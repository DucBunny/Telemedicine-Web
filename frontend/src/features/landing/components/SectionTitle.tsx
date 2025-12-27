import React from 'react'

export const SectionTitle = ({
  title,
  subtitle,
  center = false,
}: {
  title: React.ReactNode
  subtitle: string
  center?: boolean
}) => (
  <div className={`mb-16 ${center ? 'mx-auto max-w-2xl text-center' : ''}`}>
    <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl">
      {title}
    </h2>
    <p className="text-lg text-gray-500">{subtitle}</p>
  </div>
)
