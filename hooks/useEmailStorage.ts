'use client'

import { useState, useCallback, useMemo } from 'react'

interface EmailState {
  content: string | null
  error: string | null
  isGenerating: boolean
}

const STORAGE_KEY_PREFIX = 'lineer_email_'

const getStorageKey = (postId: string, perspectiveIndex: number): string => {
  return `${STORAGE_KEY_PREFIX}${postId}_${perspectiveIndex}`
}

export function useEmailStorage(postId: string, perspectiveIndex: number) {
  const storageKey = useMemo(
    () => getStorageKey(postId, perspectiveIndex),
    [postId, perspectiveIndex]
  )

  const [emailState, setEmailState] = useState<EmailState>(() => {
    if (typeof window === 'undefined') {
      return { content: null, error: null, isGenerating: false }
    }

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          content: parsed.content || null,
          error: parsed.error || null,
          isGenerating: false,
        }
      }
    } catch (err) {
      console.error('[useEmailStorage] Error loading from localStorage:', err)
    }

    return { content: null, error: null, isGenerating: false }
  })

  const setEmailContent = useCallback(
    (content: string | null | ((prev: string | null) => string | null)) => {
      setEmailState((prev) => {
        const newContent =
          typeof content === 'function' ? content(prev.content) : content
        
        // Only update if content actually changed
        if (newContent === prev.content) {
          return prev
        }

        const newState = { ...prev, content: newContent }
        
        // Debounce localStorage writes
        try {
          if (newContent) {
            localStorage.setItem(storageKey, JSON.stringify(newState))
          } else {
            localStorage.removeItem(storageKey)
          }
        } catch (err) {
          console.error('[useEmailStorage] Error saving to localStorage:', err)
        }
        
        return newState
      })
    },
    [storageKey]
  )

  const setEmailError = useCallback(
    (error: string | null) => {
      setEmailState((prev) => {
        if (error === prev.error) {
          return prev
        }

        const newState = { ...prev, error }
        try {
          if (error) {
            localStorage.setItem(storageKey, JSON.stringify(newState))
          } else {
            const updated = { ...newState, error: null }
            localStorage.setItem(storageKey, JSON.stringify(updated))
          }
        } catch (err) {
          console.error('[useEmailStorage] Error saving to localStorage:', err)
        }
        return newState
      })
    },
    [storageKey]
  )

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setEmailState((prev) => {
      if (isGenerating === prev.isGenerating) {
        return prev
      }
      return { ...prev, isGenerating }
    })
  }, [])

  const clearEmail = useCallback(() => {
    setEmailState({ content: null, error: null, isGenerating: false })
    try {
      localStorage.removeItem(storageKey)
    } catch (err) {
      console.error('[useEmailStorage] Error clearing localStorage:', err)
    }
  }, [storageKey])

  return {
    emailContent: emailState.content,
    emailError: emailState.error,
    isGeneratingEmail: emailState.isGenerating,
    setEmailContent,
    setEmailError,
    setIsGenerating,
    clearEmail,
  }
}
