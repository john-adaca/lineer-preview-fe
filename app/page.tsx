'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSSE } from '@/hooks/useSSE';
import HeroSection from '@/components/HeroSection';
import ProcessingCard from '@/components/ProcessingCard';
import TopicCard from '@/components/TopicCard';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function Home() {
  const {
    topics,
    status,
    isGenerating,
    error,
    errorData,
    startGeneration,
    reset,
  } = useSSE();

  // Track if the current error has been dismissed
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  // Logging state changes
  useEffect(() => {
    console.log('[Home] Status updated:', status);
  }, [status]);

  useEffect(() => {
    console.log('[Home] Topics updated:', topics);
  }, [topics]);

  useEffect(() => {
    console.log('[Home] Error updated:', error);
    console.log('[Home] ErrorData updated:', errorData);
    // Reset dismissal whenever a new error occurs
    setIsErrorDismissed(false);
  }, [error, errorData]);

  const handleGenerate = useCallback(
    (profileUrl: string, limit: number) => {
      console.log('[Home] handleGenerate called with:', { profileUrl, limit });
      reset();
      console.log('[Home] Generation reset called');
      startGeneration(profileUrl, limit);
      console.log('[Home] Generation started');
    },
    [reset, startGeneration]
  );

  const handleDismissError = useCallback(() => {
    console.log('[Home] handleDismissError called');
    setIsErrorDismissed(true);
  }, []);

  const topicEntries = useMemo(() => Object.entries(topics), [topics]);
  const hasError = useMemo(
    () => !!error && !isErrorDismissed,
    [error, isErrorDismissed]
  );
  const hasTopics = topicEntries.length > 0;

  console.log('[Home] Computed hasError:', hasError, 'hasTopics:', hasTopics);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection
        onGenerate={handleGenerate}
        isGenerating={isGenerating || hasError}
        hasResults={hasTopics}
      />

      {/* Processing Card - Show when active */}
      {status.isActive && (
        <div className="w-full max-w-4xl mx-auto px-4 -mt-8 pb-8">
          <ProcessingCard
            message={error || status.message || ''}
            progress={status.progress}
            showLoading={status.showLoading && !hasError}
            isActive={true}
            error={hasError ? error : null}
            onDismiss={hasError ? handleDismissError : undefined}
          />
        </div>
      )}

      {/* Results */}
      {hasTopics && (
        <div className="w-full max-w-6xl mx-auto px-4 pb-12">
          {topicEntries.map(([postId, topicData], index) => (
            <TopicCard
              key={postId}
              postId={postId}
              topicData={topicData}
              postIndex={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
