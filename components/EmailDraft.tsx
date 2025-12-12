'use client';

interface EmailDraftProps {
  content: string;
  isGenerating: boolean;
  error: string | null;
  onClose: () => void;
  onCopy: () => void;
}

export default function EmailDraft({
  content,
  isGenerating,
  error,
  onClose,
  onCopy,
}: EmailDraftProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 mt-4 border-2 border-primary animate-slide-in">
      <div className="flex justify-between items-center mb-3 pb-3 border-b-2 border-gray-200">
        <div className="font-bold text-primary text-lg">
          {isGenerating ? '📧 Generating Email Draft...' : '📧 Email Draft'}
        </div>
      </div>
      <div
        className={`text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-sm ${
          isGenerating ? 'opacity-70' : ''
        } ${error ? 'text-red-700' : ''}`}
      >
        {error || content || 'Generating...'}
      </div>
      {!isGenerating && content && !error && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onCopy}
            className="px-4 py-2 text-sm bg-primary text-white border-none rounded-md cursor-pointer transition-colors hover:bg-primary-dark"
          >
            📋 Copy Email
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-800 border-none rounded-md cursor-pointer transition-colors hover:bg-gray-300"
          >
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
}
