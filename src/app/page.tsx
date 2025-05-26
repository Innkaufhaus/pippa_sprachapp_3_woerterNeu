"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

type SentencePair = {
  id: number;
  keyword: string;
  sentence: string;
}

type Settings = {
  id: number;
  speechRate: number;
  speechPitch: number;
}

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sentences, setSentences] = useState<SentencePair[]>([])
  const [settings, setSettings] = useState<Settings>({
    id: 0,
    speechRate: 0.5,
    speechPitch: 1.2
  })
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchSentences()
    fetchSettings()
  }, [])

  const fetchSentences = async () => {
    try {
      const response = await fetch('/api/sentences')
      const data = await response.json()
      setSentences(data)
    } catch (error) {
      console.error('Failed to fetch sentences:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      setIsPlaying(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'de-DE'
      utterance.rate = settings.speechRate
      utterance.pitch = settings.speechPitch

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const nextWord = () => {
    if (sentences.length > 0) {
      const nextIndex = (currentIndex + 1) % sentences.length
      setCurrentIndex(nextIndex)
      // Automatically speak the new word
      setTimeout(() => {
        speak(sentences[nextIndex].keyword)
      }, 300)
    }
  }

  const currentSentence = sentences[currentIndex]

  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 bg-white text-black text-center rounded-xl">
          <h1 className="text-3xl font-bold mb-6">Keine Sätze verfügbar</h1>
          <Link href="/admin">
            <Button className="text-xl px-6 py-4">
              Zum Admin-Bereich
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* Admin Link */}
      <div className="absolute top-4 right-4">
        <Link href="/admin">
          <Button variant="outline" className="text-xl">
            Admin
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl space-y-12">
        {/* Keyword Display */}
        <Card 
          onClick={() => !isPlaying && speak(currentSentence.keyword)}
          className="w-full p-12 bg-white text-black text-center rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <h1 className="text-7xl md:text-8xl font-bold">
            {currentSentence.keyword}
          </h1>
        </Card>

        {/* Complete Sentence Button */}
        <Button
          onClick={() => !isPlaying && speak(currentSentence.sentence)}
          disabled={isPlaying}
          className="w-full p-8 text-4xl md:text-5xl font-bold"
        >
          Kompletter Satz
        </Button>

        {/* Next Word Button */}
        <Button
          onClick={nextWord}
          disabled={isPlaying}
          className="w-full p-8 text-4xl md:text-5xl font-bold"
        >
          Nächstes Wort
        </Button>
      </div>
    </div>
  )
}
