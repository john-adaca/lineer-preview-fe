'use client'

import { useEffect } from 'react'

interface ErrorDisplayProps {
  message: string
  onDismiss?: () => void
  autoDismiss?: boolean
  dismissDelay?: number
}

export default function ErrorDisplay({
  message,
  onDismiss,
  autoDismiss = true,
  dismissDelay = 10000,
}: ErrorDisplayProps) {
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss()
      }, dismissDelay)
      return () => clearTimeout(timer)
    }
  }, [autoDismiss, onDismiss, dismissDelay])

  return (
    <div className="bg-red-50 text-red-700 p-4 rounded-lg mx-8 my-5 border-l-4 border-red-700 animate-slide-in flex items-center gap-2">
      <span className="text-xl">⚠️</span>
      <span>❌ {message}</span>
    </div>
  )
}

