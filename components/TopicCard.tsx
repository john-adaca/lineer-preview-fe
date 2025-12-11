'use client'

import { useState } from 'react'
import type { TopicData } from '@/types'
import PerspectiveItem from './PerspectiveItem'

interface TopicCardProps {
  postId: string
  topicData: TopicData
  postIndex: number
  isComplete?: boolean
}

export default function TopicCard({ postId, topicData, postIndex, isComplete }: TopicCardProps) {
  const displayText =
    topicData.postText && topicData.postText.length > 300
      ? `${topicData.postText.substring(0, 300)}...`
      : topicData.postText || 'Loading post content...'
  const authorName = topicData.author?.name || 'Unknown'

  return (
    <div
      className={`bg-gray-50 rounded-xl p-6 mb-5 border-2 transition-all hover:border-primary hover:-translate-y-0.5 hover:shadow-lg ${
        isComplete ? 'border-green-500' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold text-gray-800">{topicData.topic}</div>
        <div className="bg-primary text-white px-3 py-1 rounded-xl text-sm font-semibold">
          Post {postIndex + 1}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg mb-4 border-l-4 border-primary">
        {topicData.author?.name && (
          <div className="text-sm text-primary font-semibold mb-2">By {authorName}</div>
        )}
        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words mb-3">
          {displayText}
        </div>
        {topicData.postUrl && (
          <a
            href={topicData.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary no-underline text-sm font-semibold mt-2 transition-colors hover:text-secondary hover:underline"
          >
            View on LinkedIn →
          </a>
        )}
      </div>
      <div className="mt-4">
        <div className="font-semibold text-gray-800 mb-3 text-lg">💭 Perspectives:</div>
        <div id={`perspectives-${postId}`} data-post-id={postId}>
          {topicData.perspectives.length === 0 ? (
            <div className="bg-white px-4 py-3 rounded-lg mb-2 border-l-[3px] border-gray-200 text-gray-500 italic cursor-default pointer-events-none">
              Generating perspectives...
            </div>
          ) : (
            topicData.perspectives.map((perspective, index) => (
              <PerspectiveItem
                key={`${postId}-${index}`}
                postId={postId}
                perspective={perspective}
                perspectiveIndex={index}
                topicData={topicData}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

