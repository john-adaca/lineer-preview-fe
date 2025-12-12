'use client'

import { useState } from 'react'
import { useSSE } from '@/hooks/useSSE'
import Header from '@/components/Header'
import FormSection from '@/components/FormSection'
import StatusSection from '@/components/StatusSection'
import TopicCard from '@/components/TopicCard'
import ErrorDisplay from '@/components/ErrorDisplay'
import EmptyState from '@/components/EmptyState'

export default function Home() {
  const { topics, status, isGenerating, error, startGeneration, reset } = useSSE()
  const [dismissedErrors, setDismissedErrors] = useState<Set<string>>(new Set())

  const handleGenerate = (profileUrl: string, limit: number) => {
    reset()
    startGeneration(profileUrl, limit)
  }

  const handleDismissError = () => {
    setDismissedErrors(new Set())
  }

  const topicEntries = Object.entries(topics)
  const hasError = error && !dismissedErrors.has(error)

  return (
    <div className="min-h-full bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <FormSection onGenerate={handleGenerate} isGenerating={isGenerating} />
        <StatusSection
          message={status.message}
          progress={status.progress}
          showLoading={status.showLoading}
          isActive={status.isActive}
        />
        <div className="mt-8">
          {hasError && (
            <ErrorDisplay
              message={error}
              onDismiss={handleDismissError}
              autoDismiss={true}
            />
          )}
          {topicEntries.length === 0 ? (
            <EmptyState />
          ) : (
            topicEntries.map(([postId, topicData], index) => (
              <TopicCard
                key={postId}
                postId={postId}
                topicData={topicData}
                postIndex={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

