'use client'

import LottieLoader from './LottieLoader'

interface ProcessingCardProps {
  message: string
  progress: number
  showLoading: boolean
  isActive: boolean
}

export default function ProcessingCard({
  message,
  progress,
  showLoading,
  isActive,
}: ProcessingCardProps) {
  if (!isActive) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        {showLoading && <LottieLoader />}
        <span className="text-sm font-medium text-gray-700">{message}</span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
