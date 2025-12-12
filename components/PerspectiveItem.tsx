'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Mail } from 'lucide-react'
import type { TopicData, EmailChunkData, EmailCompleteData } from '@/types'
import { API_BASE_URL } from '@/utils/config'
import { useEmailStorage } from '@/hooks/useEmailStorage'
import EmailModal from './EmailModal'

interface PerspectiveItemProps {
  postId: string
  perspective: string
  perspectiveIndex: number
  topicData: TopicData
}

// Orange variants for top borders
const orangeVariants = [
  '#FF6A00', // Bright orange
  '#FF8C42', // Lighter orange
  '#FFA366', // Soft orange
]

export default function PerspectiveItem({
  postId,
  perspective,
  perspectiveIndex,
  topicData,
}: PerspectiveItemProps) {
  const {
    emailContent,
    emailError,
    isGeneratingEmail,
    setEmailContent,
    setEmailError,
    setIsGenerating,
  } = useEmailStorage(postId, perspectiveIndex)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const emailEventSourceRef = useRef<EventSource | null>(null)
  const hasStartedRef = useRef(false)

  const borderColor = orangeVariants[perspectiveIndex % orangeVariants.length]

  const startEmailGeneration = useCallback(() => {
    if (hasStartedRef.current || isGeneratingEmail) return
    hasStartedRef.current = true

    setIsGenerating(true)
    setEmailError(null)
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
        setEmailContent(data.email || '')
        setIsGenerating(false)
        hasStartedRef.current = false
      } catch (err) {
        console.error('[Frontend] Error parsing email complete:', err)
        setIsGenerating(false)
        hasStartedRef.current = false
      }
    })

    emailEventSource.addEventListener('done', () => {
      if (emailEventSourceRef.current) {
        emailEventSourceRef.current.close()
        emailEventSourceRef.current = null
      }
      hasStartedRef.current = false
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
        setIsGenerating(false)
        hasStartedRef.current = false
        if (emailEventSourceRef.current) {
          emailEventSourceRef.current.close()
          emailEventSourceRef.current = null
        }
      } catch (err) {
        console.error('[Frontend] Error parsing email error:', err)
        setEmailError('Failed to generate email. Please try again.')
        setIsGenerating(false)
        hasStartedRef.current = false
      }
    })

    emailEventSource.onerror = () => {
      console.error('[Frontend] Email SSE connection error')
      setEmailError('Connection failed. Please try again.')
      setIsGenerating(false)
      hasStartedRef.current = false
      if (emailEventSourceRef.current) {
        emailEventSourceRef.current.close()
        emailEventSourceRef.current = null
      }
    }
  }, [postId, perspective, topicData, setEmailContent, setEmailError, setIsGenerating, isGeneratingEmail])

  const handleClick = useCallback(() => {
    setIsModalOpen(true)

    if (emailContent !== null) {
      return
    }

    if (isGeneratingEmail) return

    startEmailGeneration()
  }, [emailContent, isGeneratingEmail, startEmailGeneration])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleCopy = useCallback(() => {
    if (emailContent) {
      navigator.clipboard.writeText(emailContent).catch((err) => {
        console.error('Failed to copy:', err)
        alert('Failed to copy email. Please select and copy manually.')
      })
    }
  }, [emailContent])

  useEffect(() => {
    return () => {
      if (emailEventSourceRef.current) {
        emailEventSourceRef.current.close()
        emailEventSourceRef.current = null
      }
      hasStartedRef.current = false
    }
  }, [])

  const isComplete = emailContent !== null && !isGeneratingEmail

  return (
    <>
      <div
        className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full"
        style={{
          borderTop: `3px solid ${borderColor}`,
        }}
        onClick={handleClick}
      >
        {/* Hover glow effect */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
          style={{
            backgroundColor: borderColor,
            boxShadow: `0 0 12px ${borderColor}`,
          }}
        />

        {/* Card content - lifts on hover */}
        <div className="relative transform group-hover:-translate-y-1 transition-transform duration-300 flex flex-col flex-1">
          {/* Title row with icon */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${borderColor}15` }}
            >
              <Sparkles className="w-5 h-5" style={{ color: borderColor }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              Perspective {perspectiveIndex + 1}
            </h3>
          </div>

          {/* Body text */}
          <p className="text-[15px] text-gray-700 leading-relaxed mb-6 text-left flex-1">
            {perspective}
          </p>

          {/* CTA Button - Sticky at bottom */}
          <div className="mt-auto">
            <button
              className="w-full bg-[#FF6A00] text-white py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6A00]/30 hover:bg-gradient-to-r hover:from-[#FF6A00] hover:to-[#FF8C42] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isGeneratingEmail}
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              {isGeneratingEmail ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 rounded-full border-t-white animate-spin" />
                  Generating...
                </>
              ) : isComplete ? (
                <>
                  <Mail className="w-4 h-4" />
                  View Email →
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Generate Email →
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced shadow on hover */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <EmailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content={emailContent || ''}
        isGenerating={isGeneratingEmail}
        error={emailError}
        perspective={perspective}
        onCopy={handleCopy}
      />
    </>
  )
}
