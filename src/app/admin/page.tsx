"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

type SentencePair = {
  keyword: string;
  sentence: string;
}

export default function AdminPage() {
  const [keyword, setKeyword] = useState('')
  const [sentence, setSentence] = useState('')
  const [sentences, setSentences] = useState<SentencePair[]>([])
  const [settings, setSettings] = useState({
    speechRate: 0.8,
    speechPitch: 1.2
  })

  useEffect(() => {
    // Load sentences from localStorage
    const storedSentences = localStorage.getItem('sentences')
    if (storedSentences) {
      setSentences(JSON.parse(storedSentences))
    }

    // Load settings from localStorage
    const storedSettings = localStorage.getItem('settings')
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  }, [])

  const addSentence = () => {
    if (!keyword.trim() || !sentence.trim()) return

    const newSentences = [...sentences, { keyword, sentence }]
    setSentences(newSentences)
    localStorage.setItem('sentences', JSON.stringify(newSentences))
    
    // Clear inputs
    setKeyword('')
    setSentence('')
  }

  const deleteSentence = (index: number) => {
    const newSentences = sentences.filter((_, i) => i !== index)
    setSentences(newSentences)
    localStorage.setItem('sentences', JSON.stringify(newSentences))
  }

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    localStorage.setItem('settings', JSON.stringify(newSettings))
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
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({
                  ...settings,
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
                  ...settings,
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
            {sentences.map((pair, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="text-xl font-bold">{pair.keyword}</p>
                  <p className="text-lg">{pair.sentence}</p>
                </div>
                <Button
                  onClick={() => deleteSentence(index)}
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
