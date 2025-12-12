'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'

interface LottieLoaderProps {
  className?: string
}

export default function LottieLoader({ className = '' }: LottieLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Load the animation
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: '/loader.json',
    })

    animationRef.current = anim

    // Wait for animation to be ready
    anim.addEventListener('DOMLoaded', () => {
      const fps = anim.frameRate || 60
      const endFrame = Math.floor(1.2 * fps)
      
      // Set the segment to play from 0 to 1.2 seconds
      anim.setSegment(0, endFrame)
      anim.play()
    })

    // Fallback if DOMLoaded doesn't fire
    const checkReady = setInterval(() => {
      if (anim.isLoaded) {
        clearInterval(checkReady)
        const fps = anim.frameRate || 60
        const endFrame = Math.floor(1.2 * fps)
        anim.setSegment(0, endFrame)
        anim.play()
      }
    }, 100)

    return () => {
      clearInterval(checkReady)
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: '48px', height: '48px' }}
    />
  )
}

