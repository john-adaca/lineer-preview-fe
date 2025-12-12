'use client';

interface StatusSectionProps {
  message: string;
  progress: number;
  showLoading: boolean;
  isActive: boolean;
}

export default function StatusSection({
  message,
  progress,
  showLoading,
  isActive,
}: StatusSectionProps) {
  if (!isActive) return null;

  return (
    <div className="py-5 px-8 bg-gray-100 border-b border-gray-200">
      <div className="font-semibold text-primary mb-2 flex items-center gap-2">
        {showLoading && (
          <span className="inline-block w-5 h-5 border-[3px] border-primary/30 rounded-full border-t-primary animate-spin flex-shrink-0" />
        )}
        <span>{message}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-2.5">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
