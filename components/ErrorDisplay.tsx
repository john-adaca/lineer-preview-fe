'use client';

import { useEffect } from 'react';

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
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
        onDismiss();
      }, dismissDelay);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss, dismissDelay]);

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl shadow-sm animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">Error</h3>
          <p className="text-red-700 leading-relaxed">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
