'use client';

import LottieLoader from './LottieLoader';

interface ProcessingCardProps {
  message: string;
  progress: number;
  showLoading: boolean;
  isActive: boolean;
  error?: string | null;
  onDismiss?: () => void;
}

export default function ProcessingCard({
  message,
  progress,
  showLoading,
  isActive,
  error,
  onDismiss,
}: ProcessingCardProps) {
  if (!isActive) return null;

  const displayMessage = error || message;
  const isError = !!error;

  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm ${
      isError ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        {showLoading && !isError && <LottieLoader />}
        {isError && (
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <span className={`text-sm font-medium ${
          isError ? 'text-red-800' : 'text-gray-700'
        }`}>
          {displayMessage}
        </span>
      </div>
      {!isError && (
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {isError && onDismiss && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onDismiss}
            className="px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-colors font-medium text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
