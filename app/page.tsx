'use client'

import { useState, useCallback, FormEvent } from 'react'
import Header from '@/components/Header'
import ChatPanel, { Message } from '@/components/ChatPanel'
import ImagePicker from '@/components/ImagePicker'

// US States for validation and autocomplete
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export default function Home() {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      type: 'assistant',
      content: "👋 Hi there! I'm GreenVision, your smart recycling assistant.\n\nTake a photo of any item, enter your location, and I'll identify the best recycling options near you.\n\n♻️ Let's make recycling easier together!",
      timestamp: new Date(),
    },
  ])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if form is valid
  const isFormValid = selectedFile && city.trim() && state.trim()

  // Handle image selection
  const handleImageSelect = useCallback((file: File, url: string) => {
    setSelectedFile(file)
    setPreviewUrl(url)
    setError(null)
  }, [])

  // Handle image clear
  const handleImageClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
  }, [previewUrl])

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !city.trim() || !state.trim()) {
      setError('Please add a photo and enter your city and state.')
      return
    }

    setIsLoading(true)
    setError(null)

    // Add user message
    const userMessageId = generateId()
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: 'Find recycling options for this item',
      imageUrl: previewUrl || undefined,
      city: city.trim(),
      state: state.trim(),
      timestamp: new Date(),
    }

    // Add loading message
    const loadingMessageId = generateId()
    const loadingMessage: Message = {
      id: loadingMessageId,
      type: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])

    // Clear form
    const currentPreviewUrl = previewUrl
    setSelectedFile(null)
    setPreviewUrl(null)
    setCity('')
    setState('')

    try {
      // Build FormData
      const formData = new FormData()
      formData.append('image', selectedFile)

      // Construct URL with query params
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured')
      }

      const url = `${webhookUrl}?city=${encodeURIComponent(city.trim())}&state=${encodeURIComponent(state.trim())}`

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      // Make request
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      // Get plain text response
      const responseText = await response.text()

      // Update loading message with response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                content: responseText || 'No recycling options found. Try a different item or location.',
                isLoading: false,
                timestamp: new Date(),
              }
            : msg
        )
      )
    } catch (err) {
      let errorMessage = 'Something went wrong. Please try again.'
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = '⏱️ Request timed out. The server took too long to respond. Please try again.'
        } else if (err.message.includes('Webhook URL not configured')) {
          errorMessage = '⚠️ The recycling service is not configured. Please contact support.'
        } else if (err.message.includes('fetch')) {
          errorMessage = '📡 Unable to connect to the recycling service. Please check your internet connection.'
        } else {
          errorMessage = `❌ ${err.message}`
        }
      }

      // Update loading message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                content: errorMessage,
                isLoading: false,
                timestamp: new Date(),
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      // Clean up preview URL
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl)
      }
    }
  }

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-gradient-to-b from-cream-50 to-sage-50/30 leaf-pattern">
      {/* Header */}
      <Header />

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 gradient-bg" />
        <ChatPanel messages={messages} />
      </main>

      {/* Composer */}
      <div className="relative z-10 bg-white/95 backdrop-blur-lg border-t border-sage-100 safe-area-bottom">
        <form onSubmit={handleSubmit} className="p-4">
          {/* Error message */}
          {error && (
            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-3">
            {/* Image picker */}
            <ImagePicker
              onImageSelect={handleImageSelect}
              previewUrl={previewUrl}
              onClear={handleImageClear}
            />

            {/* Location inputs */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-2">
                {/* City input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2.5 bg-sage-50/70 border border-sage-200 rounded-xl text-sm text-forest placeholder:text-sage-400 focus:bg-white transition-colors duration-200"
                    disabled={isLoading}
                    aria-label="City"
                  />
                </div>

                {/* State input */}
                <div className="w-20">
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="State"
                    maxLength={2}
                    list="state-list"
                    className="w-full px-3 py-2.5 bg-sage-50/70 border border-sage-200 rounded-xl text-sm text-forest placeholder:text-sage-400 focus:bg-white transition-colors duration-200 text-center uppercase"
                    disabled={isLoading}
                    aria-label="State abbreviation"
                  />
                  <datalist id="state-list">
                    {US_STATES.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-200 btn-press
                ${
                  isFormValid && !isLoading
                    ? 'bg-gradient-to-br from-sage-500 to-sage-700 text-white shadow-soft hover:shadow-soft-lg hover:scale-[1.02]'
                    : 'bg-sage-100 text-sage-400 cursor-not-allowed'
                }
              `}
              aria-label="Find recycling options"
            >
              {isLoading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Helper text */}
          <p className="mt-3 text-center text-[11px] text-sage-400">
            📸 Snap a photo • 📍 Add location • ♻️ Find recycling spots
          </p>
        </form>
      </div>
    </div>
  )
}
