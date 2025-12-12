'use client'

import { useState, useCallback, useMemo } from 'react'
import { useSSE } from '@/hooks/useSSE'
import HeroSection from '@/components/HeroSection'
import ProcessingCard from '@/components/ProcessingCard'
import TopicCard from '@/components/TopicCard'
import ErrorDisplay from '@/components/ErrorDisplay'

export default function Home() {
  const { topics, status, isGenerating, error, startGeneration, reset } = useSSE()
  const [dismissedErrors, setDismissedErrors] = useState<Set<string>>(new Set())

  const handleGenerate = useCallback((profileUrl: string, limit: number) => {
    reset()
    startGeneration(profileUrl, limit)
  }, [reset, startGeneration])

  const handleDismissError = useCallback(() => {
    setDismissedErrors(new Set())
  }, [])

  const topicEntries = useMemo(() => Object.entries(topics), [topics])
  const hasError = useMemo(
    () => error && !dismissedErrors.has(error),
    [error, dismissedErrors]
  )
  const hasTopics = topicEntries.length > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating}
        hasResults={hasTopics}
      />

      {/* Processing Card */}
      {status.isActive && status.progress < 100 && (
        <div className="w-full max-w-4xl mx-auto px-4 -mt-8 pb-8">
          <ProcessingCard
            message={status.message}
            progress={status.progress}
            showLoading={status.showLoading}
            isActive={status.isActive}
          />
        </div>
      )}

      {/* Results */}
      {hasTopics && (
    <div className="w-full max-w-6xl mx-auto px-4 pb-12">

          {hasError && (
            <div className="mb-8">
              <ErrorDisplay
                message={error}
                onDismiss={handleDismissError}
                autoDismiss={true}
              />
            </div>
          )}
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
  )
}
