'use client'

import type { TopicData } from '@/types'
import PerspectiveItem from './PerspectiveItem'

interface TopicCardProps {
  postId: string
  topicData: TopicData
  postIndex: number
}

export default function TopicCard({ postId, topicData, postIndex }: TopicCardProps) {
  const displayText =
    topicData.postText && topicData.postText.length > 300
      ? `${topicData.postText.substring(0, 300)}...`
      : topicData.postText || 'Loading post content...'
  const authorName = topicData.author?.name || 'Unknown'

  return (
<div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
      <h2 className="text-xl font-bold text-gray-900 pr-2 flex-1">
          {topicData.topic
          ? topicData.topic.charAt(0).toUpperCase() + topicData.topic.slice(1)
          : ""}
          </h2>
        {/* <div className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-semibold flex-shrink-0">
          {postIndex + 1}
        </div> */}
      </div>

      {/* Post Content */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-primary">
        {topicData.author?.name && (
          <div className="text-xs text-primary font-semibold mb-2">
            By {authorName}
          </div>
        )}
        <div className="text-sm text-gray-600 leading-relaxed mb-3 max-h-20 overflow-hidden">
          {displayText}
        </div>
        {topicData.postUrl && (
          <a
            href={topicData.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary text-xs font-semibold hover:underline"
          >
            View on LinkedIn →
          </a>
        )}
      </div>

      {/* Perspectives */}
      <div>
        <div className="font-semibold text-gray-800 mb-6 text-base">
          💭 Perspectives:
        </div>
        {topicData.perspectives.length === 0 ? (
          <div className="bg-gray-50 px-4 py-3 rounded-lg border-l-[3px] border-gray-200 text-gray-500 italic text-sm">
            Generating perspectives...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topicData.perspectives.map((perspective, index) => (
              <PerspectiveItem
                key={`${postId}-${index}`}
                postId={postId}
                perspective={perspective}
                perspectiveIndex={index}
                topicData={topicData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
