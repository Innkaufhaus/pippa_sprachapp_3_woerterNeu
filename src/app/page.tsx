"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { logger } from '@/utils/logger'

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
  const [germanVoice, setGermanVoice] = useState<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    fetchSentences()
    fetchSettings()
    initializeSpeechSynthesis()

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const initializeSpeechSynthesis = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      logger.error('Speech synthesis not supported')
      return
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const deVoice = voices.find(voice => 
        voice.lang.startsWith('de') || 
        voice.lang.toLowerCase().includes('german') ||
        voice.lang.toLowerCase().includes('deutsch')
      )
      if (deVoice) {
        setGermanVoice(deVoice)
        logger.info('German voice found:', deVoice.name)
      } else {
        logger.info('No German voice found, using default voice')
      }
    }

    // Load voices immediately if available
    loadVoices()

    // Also handle the voiceschanged event
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const fetchSentences = async () => {
    try {
      logger.info('Fetching sentences')
      const response = await fetch('/api/sentences')
      const data = await response.json()
      setSentences(data)
      logger.info('Successfully fetched sentences:', data)
    } catch (error) {
      logger.error('Failed to fetch sentences:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      logger.info('Fetching settings')
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data)
      logger.info('Successfully fetched settings:', data)
    } catch (error) {
      logger.error('Failed to fetch settings:', error)
    }
  }

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      logger.error('Speech synthesis not supported')
      return
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      setIsPlaying(true)
      logger.info('Speaking text:', text)

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Use German voice if available
      if (germanVoice) {
        utterance.voice = germanVoice
      }
      
      utterance.lang = 'de-DE'
      utterance.rate = settings.speechRate
      utterance.pitch = settings.speechPitch

      utterance.onend = () => {
        setIsPlaying(false)
        logger.info('Speech completed')
      }

      utterance.onerror = (event) => {
        setIsPlaying(false)
        logger.error('Speech error:', event)
      }

      // Ensure synthesis is not paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }

      window.speechSynthesis.speak(utterance)

      // Chrome/Edge bug workaround
      const isChromium = typeof window !== 'undefined' && 
        ((navigator as any).userAgentData?.brands?.some((brand: any) => 
          brand.brand.includes('Chrome') || brand.brand.includes('Edge')
        ) || navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edge'))

      if (isChromium) {
        const timer = setInterval(() => {
          if (!isPlaying) {
            clearInterval(timer)
            return
          }
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume()
          }
        }, 100)
      }
    } catch (error) {
      setIsPlaying(false)
      logger.error('Speech synthesis error:', error)
    }
  }, [germanVoice, settings.speechRate, settings.speechPitch, isPlaying])

  const nextWord = useCallback(() => {
    if (sentences.length > 0) {
      const nextIndex = (currentIndex + 1) % sentences.length
      setCurrentIndex(nextIndex)
      logger.info('Moving to next word, index:', nextIndex)
      // Automatically speak the new word
      setTimeout(() => {
        speak(sentences[nextIndex].keyword)
      }, 300)
    }
  }, [sentences, currentIndex, speak])

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
