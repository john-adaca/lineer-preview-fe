'use client'

import { useState, KeyboardEvent } from 'react'

interface FormSectionProps {
  onGenerate: (profileUrl: string, limit: number) => void
  isGenerating: boolean
}

export default function FormSection({ onGenerate, isGenerating }: FormSectionProps) {
  const [profileUrl, setProfileUrl] = useState('https://www.linkedin.com/in/lambrosphotios')
  const [limit] = useState(1)

  const handleSubmit = () => {
    onGenerate(profileUrl, limit)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="p-8 border-b border-gray-200">
      <div className="mb-5">
        <label htmlFor="profileUrl" className="block mb-2 font-semibold text-gray-800">
          LinkedIn Profile URL
        </label>
        <input
          type="text"
          id="profileUrl"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://www.linkedin.com/in/username"
          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-primary"
          disabled={isGenerating}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isGenerating}
        className="bg-gradient-to-r from-primary to-secondary text-white border-none py-3.5 px-7 rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isGenerating ? 'Generating...' : 'Generate Topics'}
      </button>
    </div>
  )
}

