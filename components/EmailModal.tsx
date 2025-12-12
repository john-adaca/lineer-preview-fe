'use client'

import { X, Copy, Download, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  isGenerating: boolean
  error: string | null
  onCopy: () => void
  perspective: string
}

export default function EmailModal({
  isOpen,
  onClose,
  content,
  isGenerating,
  error,
  onCopy,
  perspective,
}: EmailModalProps) {
  const [subject, setSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setShowSparkles(true)
      // Extract subject from email if it exists
      if (content && content.includes('Subject:')) {
        const subjectMatch = content.match(/Subject:\s*(.+)/i)
        if (subjectMatch) {
          setSubject(subjectMatch[1].trim())
          setEmailBody(content.replace(/Subject:.*/i, '').trim())
        } else {
          setEmailBody(content)
        }
      } else {
        setEmailBody(content)
      }
    } else {
      document.body.style.overflow = 'unset'
      setShowSparkles(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, content])

  const handleDownload = () => {
    const fullEmail = subject ? `Subject: ${subject}\n\n${emailBody}` : emailBody
    const blob = new Blob([fullEmail], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  const fullEmail = subject ? `Subject: ${subject}\n\n${emailBody}` : emailBody

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[25px] transition-opacity duration-300"
        style={{ backdropFilter: 'blur(25px)' }}
      />

      {/* Sparkle Particles */}
      {showSparkles && !isGenerating && content && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#FF6A00] rounded-full opacity-60 animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div
        className="relative bg-white rounded-[20px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)] transform transition-all duration-300 scale-[0.96] opacity-0 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,106,0,0.1), 0 0 40px rgba(255,106,0,0.15)',
        }}
      >
        {/* Orange Glow Border Effect */}
        <div
          className="absolute -inset-[2px] rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,106,0,0.3), rgba(255,140,66,0.2))',
            filter: 'blur(8px)',
          }}
        />

        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FF6A00]/10">
                <Sparkles className="w-5 h-5 text-[#FF6A00]" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {perspective}
              </h2>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-6">
          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/10 bg-white"
            />
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Body
            </label>
            <div className="relative">
              <div className="w-full min-h-[300px] px-6 py-5 border border-gray-200 rounded-xl text-[15px] text-gray-800 leading-relaxed bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-y-auto">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full min-h-[250px]">
                    <div className="flex items-center gap-3 text-[#FF6A00]">
                      <span className="inline-block w-5 h-5 border-2 border-[#FF6A00]/30 rounded-full border-t-[#FF6A00] animate-spin" />
                      <span className="text-sm font-medium">Generating your email...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full min-h-[250px]">
                    <div className="text-red-600 text-sm font-medium">{error}</div>
                  </div>
                ) : emailBody ? (
                  <div className="prose prose-sm max-w-none" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    <ReactMarkdown>{emailBody}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Your email content will appear here...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        {!isGenerating && (content || emailBody) && !error && (
          <div className="px-8 pb-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-end gap-3">
              {/* Copy Button - Primary */}
              <button
                onClick={() => {
                  const textToCopy = fullEmail
                  navigator.clipboard.writeText(textToCopy).then(() => {
                    onCopy()
                  }).catch((err) => {
                    console.error('Failed to copy:', err)
                    alert('Failed to copy email. Please select and copy manually.')
                  })
                }}
                className="px-6 py-3 bg-[#FF6A00] text-white rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6A00]/30 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#FF6A00] hover:to-[#FF8C42] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              {/* Download Button - Secondary */}
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium text-sm transition-all duration-300 hover:bg-gray-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download .txt
                </span>
              </button>

              {/* Close Button - Secondary */}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-medium text-sm transition-all duration-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
