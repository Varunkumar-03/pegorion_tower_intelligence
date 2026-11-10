import { ReactNode } from 'react'

interface AttractiveCardProps {
  title?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function AttractiveCard({
  title,
  icon,
  children,
  className = '',
  hover = true
}: AttractiveCardProps) {
  return (
    <div className={`bg-white rounded-none shadow-sm border border-slate-200/80
      ${hover ? 'hover:border-slate-300 hover:shadow-md transition-all duration-200' : ''}
      ${className}`}>
      {title && (
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {icon && (
              <div className="w-9 h-9 bg-blue-50 border border-blue-100/80 rounded-none flex items-center justify-center text-blue-600">
                {icon}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={`px-5 pb-5 ${title ? '' : 'pt-5'}`}>
        {children}
      </div>
    </div>
  )
}