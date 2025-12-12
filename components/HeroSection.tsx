'use client';

import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';

interface HeroSectionProps {
  onGenerate: (profileUrl: string, limit: number) => void;
  isGenerating: boolean;
  hasResults?: boolean;
}

export default function HeroSection({
  onGenerate,
  isGenerating,
  hasResults = false,
}: HeroSectionProps) {
  const [profileUrl, setProfileUrl] = useState('');
  const [limit] = useState(1);

  const handleSubmit = () => {
    if (profileUrl.trim()) {
      onGenerate(profileUrl, limit);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isCompact = isGenerating || hasResults;

  return (
    <div
      className={`relative flex flex-col items-center justify-center px-4 ${
        isCompact ? 'py-12' : 'min-h-screen py-12'
      }`}
    >
      {/* About link */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => window.open('https://www.lineer.ai/', '_blank')}
          className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50"
          aria-label="About"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className={`flex justify-center ${isCompact ? 'mb-8' : 'mb-12'}`}>
          <Image
            src="/lineer.png"
            alt="lineer"
            width={isCompact ? 120 : 180}
            height={isCompact ? 40 : 60}
            className="object-contain"
            priority
          />
        </div>

        {/* Headline */}
        <div className={isCompact ? 'mb-12 space-y-4' : 'mb-16 space-y-6'}>
          <h2
            className={`font-bold text-gray-900 leading-tight ${
              isCompact
                ? 'text-1xl md:text-2xl'
                : 'text-3xl md:text-4xl lg:text-5xl'
            }`}
          >
            Ready-to-Send Sales Email
            <br />
            <span className="text-primary">Instantly</span>
          </h2>
          <p
            className={`text-gray-500 max-w-xl mx-auto ${
              isCompact ? 'text-base' : 'text-xl'
            }`}
          >
            Enter a LinkedIn profile URL to discover engaging topics and
            perspectives
          </p>
        </div>

        {/* Input and Button */}
        <div className={isCompact ? 'mt-8 space-y-5' : 'mt-16 space-y-5'}>
          <input
            type="text"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://www.linkedin.com/in/username"
            className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-60 disabled:cursor-not-allowed bg-white"
            disabled={isGenerating}
          />
          <button
            onClick={handleSubmit}
            disabled={isGenerating || !profileUrl.trim()}
            className="w-full bg-primary text-white py-5 px-8 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? 'Generating...' : 'Generate Topics'}
          </button>
        </div>
      </div>
    </div>
  );
}
