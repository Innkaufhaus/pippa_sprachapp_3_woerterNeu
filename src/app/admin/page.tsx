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

  // Fetch sentences and settings on component mount
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

  const addSentence = async () => {
    if (!keyword.trim() || !sentence.trim()) return

    try {
      await fetch('/api/sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, sentence }),
      })
      
      // Refresh sentences list
      fetchSentences()
      
      // Clear inputs
      setKeyword('')
      setSentence('')
    } catch (error) {
      console.error('Failed to add sentence:', error)
    }
  }

  const deleteSentence = async (id: number) => {
    try {
      await fetch('/api/sentences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      
      // Refresh sentences list
      fetchSentences()
    } catch (error) {
      console.error('Failed to delete sentence:', error)
    }
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      })
      
      setSettings(updatedSettings)
    } catch (error) {
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
              />
            </div>
            <div>
              <label className="block text-lg mb-2">Vollständiger Satz:</label>
              <Input
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="text-xl p-4 h-auto"
                placeholder="z.B. Die Katze schläft"
              />
            </div>
            <Button 
              onClick={addSentence}
              className="w-full text-xl p-6 bg-black text-white hover:bg-gray-800"
            >
              Satz hinzufügen
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
                >
                  Löschen
                </Button>
              </div>
            ))}
            {sentences.length === 0 && (
              <p className="text-lg text-gray-500 text-center">
                Noch keine Sätze hinzugefügt
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
