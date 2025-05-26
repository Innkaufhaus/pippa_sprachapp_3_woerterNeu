"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export default function AdminPage() {
  const [keyword, setKeyword] = useState('')
  const [sentence, setSentence] = useState('')
  const [sentences, setSentences] = useState<SentencePair[]>([])
  const [settings, setSettings] = useState<Settings>({
    id: 0,
    speechRate: 0.5,
    speechPitch: 1.2
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSentences()
    fetchSettings()
  }, [])

  const fetchSentences = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/sentences')
      if (!response.ok) {
        throw new Error('Failed to fetch sentences')
      }
      const data = await response.json()
      setSentences(data)
    } catch (error) {
      setError('Failed to fetch sentences. Please try again.')
      console.error('Failed to fetch sentences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setError(null)
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      setError('Failed to fetch settings. Please try again.')
      console.error('Failed to fetch settings:', error)
    }
  }

  const addSentence = async () => {
    if (!keyword.trim() || !sentence.trim()) {
      setError('Bitte füllen Sie beide Felder aus.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, sentence }),
      })

      if (!response.ok) {
        throw new Error('Failed to add sentence')
      }
      
      // Refresh sentences list
      await fetchSentences()
      
      // Clear inputs
      setKeyword('')
      setSentence('')
    } catch (error) {
      setError('Failed to add sentence. Please try again.')
      console.error('Failed to add sentence:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSentence = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/sentences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete sentence')
      }
      
      // Refresh sentences list
      await fetchSentences()
    } catch (error) {
      setError('Failed to delete sentence. Please try again.')
      console.error('Failed to delete sentence:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setError(null)
      const updatedSettings = { ...settings, ...newSettings }
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      const data = await response.json()
      setSettings(data)
    } catch (error) {
      setError('Failed to update settings. Please try again.')
      console.error('Failed to update settings:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Admin-Bereich</h1>
          <Link href="/">
            <Button variant="outline" className="text-xl px-6 py-4">
              Zurück zur App
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200 text-red-700">
            {error}
          </Card>
        )}

        {/* Add New Sentence */}
        <Card className="p-6 bg-white text-black rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Neuen Satz hinzufügen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg mb-2">Schlüsselwort:</label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="text-xl p-4 h-auto"
                placeholder="z.B. Katze"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Vollständiger Satz:</label>
              <Input
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="text-xl p-4 h-auto"
                placeholder="z.B. Die Katze schläft"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={addSentence}
              className="w-full text-xl p-6 bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Wird hinzugefügt...' : 'Satz hinzufügen'}
            </Button>
          </div>
        </Card>

        {/* Speech Settings */}
        <Card className="p-6 bg-white text-black rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Spracheinstellungen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg mb-2">
                Sprechgeschwindigkeit ({settings.speechRate}):
              </label>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({
                  speechRate: parseFloat(e.target.value)
                })}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-lg mb-2">
                Tonhöhe ({settings.speechPitch}):
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speechPitch}
                onChange={(e) => updateSettings({
                  speechPitch: parseFloat(e.target.value)
                })}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>

        {/* Sentence List */}
        <Card className="p-6 bg-white text-black rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Gespeicherte Sätze</h2>
          <div className="space-y-4">
            {sentences.map((pair) => (
              <div 
                key={pair.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="text-xl font-bold">{pair.keyword}</p>
                  <p className="text-lg">{pair.sentence}</p>
                </div>
                <Button
                  onClick={() => deleteSentence(pair.id)}
                  variant="destructive"
                  className="ml-4"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Löschen'}
                </Button>
              </div>
            ))}
            {sentences.length === 0 && !isLoading && (
              <p className="text-lg text-gray-500 text-center">
                Noch keine Sätze hinzugefügt
              </p>
            )}
            {isLoading && (
              <p className="text-lg text-gray-500 text-center">
                Lädt...
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
