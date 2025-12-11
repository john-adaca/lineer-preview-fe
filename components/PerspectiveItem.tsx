'use client'

import { useState, useRef, useEffect } from 'react'
import type { TopicData, EmailChunkData, EmailCompleteData } from '@/types'
import { API_BASE_URL } from '@/utils/config'
import EmailDraft from './EmailDraft'

interface PerspectiveItemProps {
  postId: string
  perspective: string
  perspectiveIndex: number
  topicData: TopicData
}

export default function PerspectiveItem({
  postId,
  perspective,
  perspectiveIndex,
  topicData,
}: PerspectiveItemProps) {
  const [emailContent, setEmailContent] = useState<string | null>(null)
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showEmail, setShowEmail] = useState(false)
  const emailEventSourceRef = useRef<EventSource | null>(null)

  const handleClick = () => {
    if (emailContent !== null) {
      setShowEmail(!showEmail)
      return
    }

    if (isGeneratingEmail) return

    setIsGeneratingEmail(true)
    setEmailError(null)
    setShowEmail(true)
    setEmailContent('')

    const params = new URLSearchParams({
      postId: postId,
      postText: topicData.postText || '',
      topic: topicData.topic || '',
      perspective: perspective,
    })

    if (topicData.postUrl) {
      params.append('postUrl', topicData.postUrl)
    }

    if (topicData.author?.name) {
      params.append('authorName', topicData.author.name)
    }

    if (topicData.author?.url) {
      params.append('authorUrl', topicData.author.url)
    }

    const url = `${API_BASE_URL}/api/email/draft/linkedin/stream?${params.toString()}`

    const emailEventSource = new EventSource(url)
    emailEventSourceRef.current = emailEventSource

    emailEventSource.addEventListener('status', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        const data = parsed.content || parsed
        setEmailContent(data.message || 'Generating...')
      } catch (err) {
        console.error('[Frontend] Error parsing email status:', err)
      }
    })

    emailEventSource.addEventListener('email_chunk', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        const data: EmailChunkData = parsed.content || parsed
        setEmailContent((prev) => (prev || '') + (data.chunk || ''))
      } catch (err) {
        console.error('[Frontend] Error parsing email chunk:', err)
      }
    })

    emailEventSource.addEventListener('email_complete', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        const data: EmailCompleteData = parsed.content || parsed
        setEmailContent(data.email || emailContent || '')
        setIsGeneratingEmail(false)
      } catch (err) {
        console.error('[Frontend] Error parsing email complete:', err)
        setIsGeneratingEmail(false)
      }
    })

    emailEventSource.addEventListener('done', () => {
      emailEventSource.close()
      emailEventSourceRef.current = null
    })

    emailEventSource.addEventListener('error', (e) => {
      try {
        if (e.data) {
          const parsed = JSON.parse(e.data)
          const data = parsed.content || parsed
          setEmailError(data.message || data.error || 'Failed to generate email')
        } else {
          setEmailError('Failed to connect to email service. Please check if the server is running.')
        }
        setIsGeneratingEmail(false)
        emailEventSource.close()
        emailEventSourceRef.current = null
      } catch (err) {
        console.error('[Frontend] Error parsing email error:', err)
        setEmailError('Failed to generate email. Please try again.')
        setIsGeneratingEmail(false)
      }
    })

    emailEventSource.onerror = () => {
      console.error('[Frontend] Email SSE connection error')
      setEmailError('Connection failed. Please try again.')
      setIsGeneratingEmail(false)
      if (emailEventSourceRef.current) {
        emailEventSourceRef.current.close()
        emailEventSourceRef.current = null
      }
    }
  }

  useEffect(() => {
    return () => {
      if (emailEventSourceRef.current) {
        emailEventSourceRef.current.close()
      }
    }
  }, [])

  const itemClasses = [
    'bg-white px-4 py-3 rounded-lg mb-2 border-l-[3px] transition-all relative select-none pointer-events-auto cursor-pointer animate-slide-in',
    'hover:bg-gray-50 hover:border-l-4 hover:translate-x-1',
    isGeneratingEmail
      ? 'border-l-primary bg-blue-50'
      : emailContent !== null
        ? 'border-l-green-500'
        : 'border-l-secondary',
  ].join(' ')

  return (
    <div
      className={itemClasses}
      style={{ animationDelay: `${perspectiveIndex * 0.1}s` }}
      onClick={handleClick}
      title="Click to generate email draft"
    >
      <div className="leading-relaxed">
        <strong className="text-secondary mr-1">{perspectiveIndex + 1}.</strong>
        {perspective}
      </div>
      {showEmail && (
        <EmailDraft
          content={emailContent || ''}
          isGenerating={isGeneratingEmail}
          error={emailError}
          onClose={() => setShowEmail(false)}
          onCopy={() => {
            if (emailContent) {
              navigator.clipboard.writeText(emailContent).catch((err) => {
                console.error('Failed to copy:', err)
                alert('Failed to copy email. Please select and copy manually.')
              })
            }
          }}
        />
      )}
    </div>
  )
}

