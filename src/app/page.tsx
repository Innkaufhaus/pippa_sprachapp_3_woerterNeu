"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type SentencePair = {
  keyword: string;
  sentence: string;
}

export default function LearningPage() {
  const [sentences, setSentences] = useState<SentencePair[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPair, setCurrentPair] = useState<SentencePair | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Load sentences from localStorage
    const storedSentences = localStorage.getItem('sentences')
    if (storedSentences) {
      const parsed = JSON.parse(storedSentences)
      setSentences(parsed)
      if (parsed.length > 0) {
        setCurrentPair(parsed[0])
      }
    }
    
    speechSynthesisRef.current = window.speechSynthesis
    return () => {
      speechSynthesisRef.current?.cancel()
    }
  }, [])

  const speak = (text: string) => {
    if (!speechSynthesisRef.current) {
      alert("Sprachsynthese wird von Ihrem Browser nicht unterstützt.")
      return
    }

    // Cancel any ongoing speech
    speechSynthesisRef.current.cancel()
    setIsPlaying(true)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE' // Set German language
    
    // Get settings from localStorage
    const storedSettings = localStorage.getItem('settings')
    if (storedSettings) {
      const settings = JSON.parse(storedSettings)
      utterance.rate = settings.speechRate || 0.8
      utterance.pitch = settings.speechPitch || 1.2
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    speechSynthesisRef.current.speak(utterance)
  }

  const speakWord = () => {
    if (currentPair) {
      speak(currentPair.keyword)
    }
  }

  const speakSentence = () => {
    if (currentPair) {
      speak(currentPair.sentence)
    }
  }

  const showNextPair = () => {
    if (sentences.length === 0) return
    
    const nextIndex = (currentIndex + 1) % sentences.length
    setCurrentIndex(nextIndex)
    setCurrentPair(sentences[nextIndex])
    // Automatically speak the new word
    setTimeout(() => {
      speak(sentences[nextIndex].keyword)
    }, 300)
  }

  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
        <h1 className="text-white text-6xl md:text-8xl text-center mb-12 font-bold">
          Keine Sätze verfügbar.
        </h1>
        <Link href="/admin">
          <Button className="text-2xl px-8 py-6 rounded-xl bg-white text-black hover:bg-gray-200">
            Zum Admin-Bereich
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      {/* Admin Link - Smaller since it's for parents */}
      <Link 
        href="/admin"
        className="absolute top-4 right-4 text-white hover:underline text-lg"
      >
        Admin
      </Link>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl space-y-12">
        {/* Keyword Display */}
        <div 
          onClick={speakWord}
          className="w-full bg-white text-black p-12 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors text-center min-h-[200px] flex items-center justify-center"
        >
          <span className="text-7xl md:text-8xl font-bold">
            {currentPair?.keyword || "Start"}
          </span>
        </div>

        {/* Complete Sentence Button */}
        <button
          onClick={speakSentence}
          disabled={isPlaying}
          className="w-full bg-white text-black p-8 rounded-2xl text-4xl md:text-5xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kompletter Satz
        </button>

        {/* Next Button */}
        <button
          onClick={showNextPair}
          disabled={isPlaying}
          className="w-full bg-white text-black p-8 rounded-2xl text-4xl md:text-5xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Nächstes Wort
        </button>
      </div>
    </div>
  )
}
