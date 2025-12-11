'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type {
  TopicData,
  SSEStatusData,
  SSEPostsData,
  SSESelectedData,
  SSEProgressData,
  SSETopicData,
  SSEPerspectivesData,
  SSECompleteData,
  SSEErrorData,
} from '@/types'
import { API_BASE_URL } from '@/utils/config'

interface UseSSEReturn {
  topics: Record<string, TopicData>
  status: {
    message: string
    progress: number
    showLoading: boolean
    isActive: boolean
  }
  isGenerating: boolean
  error: string | null
  startGeneration: (profileUrl: string, limit: number) => void
  reset: () => void
}

const MAX_RECONNECT_ATTEMPTS = 3
const RECONNECT_DELAY = 2000

export function useSSE(): UseSSEReturn {
  const [topics, setTopics] = useState<Record<string, TopicData>>({})
  const [status, setStatus] = useState({
    message: '',
    progress: 0,
    showLoading: true,
    isActive: false,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isManuallyClosedRef = useRef(false)

  const updateStatus = useCallback(
    (message: string, step: number, progress: number | null = null, showLoading = true) => {
      const progressValue =
        progress !== null ? progress : step > 0 ? ((step - 1) / 4) * 100 : 0
      setStatus({
        message,
        progress: Math.min(100, Math.max(0, progressValue)),
        showLoading,
        isActive: true,
      })
    },
    []
  )

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    setTopics({})
    setStatus({
      message: '',
      progress: 0,
      showLoading: true,
      isActive: false,
    })
    setIsGenerating(false)
    setError(null)
    reconnectAttemptsRef.current = 0
    isManuallyClosedRef.current = false
  }, [])

  const connectSSE = useCallback(
    (profileUrl: string, limit: number) => {
      const url = `${API_BASE_URL}/api/linkedin/topics/stream?profileUrl=${encodeURIComponent(
        profileUrl
      )}&limit=${limit}`

      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log('[Frontend] SSE connection opened')
        reconnectAttemptsRef.current = 0
        updateStatus('Connected! Starting...', 0)
      }

      eventSource.addEventListener('status', (e) => {
        try {
          const parsed = JSON.parse(e.data)
          const data: SSEStatusData = parsed.content || parsed
          console.log('[Frontend] Status update:', data.message, 'Step:', data.step)
          updateStatus(data.message, data.step || 0)
        } catch (err) {
          console.error('[Frontend] Error parsing status event:', err)
        }
      })

      eventSource.addEventListener('posts', (e) => {
        try {
          const parsed = JSON.parse(e.data)
          const data: SSEPostsData = parsed.content || parsed
          updateStatus(`Found ${data.count} posts`, 1)
        } catch (err) {
          console.error('[Frontend] Error parsing posts event:', err)
        }
      })

      eventSource.addEventListener('selected', (e) => {
        try {
          const parsed = JSON.parse(e.data)
          const data: SSESelectedData = parsed.content || parsed
          updateStatus(`Selected ${data.count} diverse posts for analysis`, 2)
        } catch (err) {
          console.error('[Frontend] Error parsing selected event:', err)
        }
      })

      eventSource.addEventListener('progress', (e) => {
        try {
          const parsed = JSON.parse(e.data)
          const data: SSEProgressData = parsed.content || parsed
          const progress = (data.current / data.total) * 100
          updateStatus(data.message, 3, progress)
        } catch (err) {
          console.error('[Frontend] Error parsing progress event:', err)
        }
      })

      eventSource.addEventListener('topic', (e) => {
        try {
          console.log('[Frontend] Received topic event:', e.type, e.data)
          const parsed = JSON.parse(e.data)
          const data: SSETopicData = parsed.content || parsed
          console.log('[Frontend] Parsed topic data:', {
            postId: data.postId,
            topic: data.topic,
            postIndex: data.postIndex,
            hasPostText: !!data.postText,
            postTextLength: data.postText?.length || 0,
            hasPostUrl: !!data.postUrl,
            hasAuthor: !!data.author,
          })

          setTopics((prev) => {
            if (prev[data.postId]) {
              return {
                ...prev,
                [data.postId]: {
                  ...prev[data.postId],
                  postText: data.postText || prev[data.postId].postText,
                  postUrl: data.postUrl || prev[data.postId].postUrl,
                  author: data.author || prev[data.postId].author,
                },
              }
            }
            return {
              ...prev,
              [data.postId]: {
                topic: data.topic,
                perspectives: [],
                postText: data.postText,
                postUrl: data.postUrl,
                author: data.author,
              },
            }
          })

          updateStatus(`Topic extracted: ${data.topic}`, 3)
        } catch (err) {
          console.error('[Frontend] Error parsing topic event:', err, 'Raw data:', e.data)
        }
      })

      eventSource.addEventListener('perspectives', (e) => {
        try {
          console.log('[Frontend] Received perspectives event:', e.type, e.data)
          const parsed = JSON.parse(e.data)
          const data: SSEPerspectivesData = parsed.content || parsed
          console.log('[Frontend] Parsed perspectives data:', {
            postId: data.postId,
            topic: data.topic,
            perspectivesCount: data.perspectives?.length || 0,
            perspectives: data.perspectives,
            isArray: Array.isArray(data.perspectives),
          })

          setTopics((prev) => {
            if (prev[data.postId]) {
              return {
                ...prev,
                [data.postId]: {
                  ...prev[data.postId],
                  topic: data.topic,
                  perspectives: data.perspectives || [],
                },
              }
            }
            return {
              ...prev,
              [data.postId]: {
                topic: data.topic,
                perspectives: data.perspectives || [],
                postText: undefined,
                postUrl: undefined,
                author: undefined,
              },
            }
          })

          updateStatus(
            `Generated ${data.perspectives?.length || 0} perspectives for: ${data.topic}`,
            3
          )
        } catch (err) {
          console.error('[Frontend] Error parsing perspectives event:', err, 'Raw data:', e.data)
        }
      })

      eventSource.addEventListener('complete', (e) => {
        try {
          const parsed = JSON.parse(e.data)
          const data: SSECompleteData = parsed.content || parsed
          setTopics((prev) => {
            if (prev[data.postId]) {
              return { ...prev }
            }
            return prev
          })
        } catch (err) {
          console.error('[Frontend] Error parsing complete event:', err)
        }
      })

      eventSource.addEventListener('keepalive', () => {
        // Silently handle keepalive events to maintain connection
      })

      eventSource.addEventListener('done', () => {
        try {
          updateStatus('✅ All done!', 4, 100, false)
          setIsGenerating(false)
          isManuallyClosedRef.current = true
          if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
          }
        } catch (err) {
          console.error('[Frontend] Error parsing done event:', err)
        }
      })

      eventSource.addEventListener('error', (e) => {
        try {
          if (e.data) {
            const parsed = JSON.parse(e.data)
            const data: SSEErrorData = parsed.content || parsed
            const errorMessage = data.message || data.error || 'An error occurred'
            setError(errorMessage)

            if (data.postId) {
              // Post-specific error, continue processing
              return
            }

            // General error, close connection
            setIsGenerating(false)
            isManuallyClosedRef.current = true
            if (eventSourceRef.current) {
              eventSourceRef.current.close()
              eventSourceRef.current = null
            }
          }
        } catch (err) {
          console.error('[Frontend] Error parsing error event:', err)
        }
      })

      eventSource.onerror = () => {
        console.error('SSE connection error')

        if (isManuallyClosedRef.current) {
          return
        }

        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++
          updateStatus(
            `Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`,
            0
          )

          reconnectTimerRef.current = setTimeout(() => {
            connectSSE(profileUrl, limit)
          }, RECONNECT_DELAY * reconnectAttemptsRef.current)
        } else {
          setError('Connection failed after multiple attempts. Please try again.')
          setIsGenerating(false)
        }
      }
    },
    [updateStatus]
  )

  const startGeneration = useCallback(
    (profileUrl: string, limit: number) => {
      if (!profileUrl.trim()) {
        setError('Please enter a LinkedIn profile URL')
        return
      }

      reset()
      setIsGenerating(true)
      setError(null)
      updateStatus('Connecting to server...', 0)

      connectSSE(profileUrl, limit)
    },
    [connectSSE, reset, updateStatus]
  )

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
    }
  }, [])

  return {
    topics,
    status,
    isGenerating,
    error,
    startGeneration,
    reset,
  }
}

