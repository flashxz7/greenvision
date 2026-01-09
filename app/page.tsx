'use client'

import { useState, useCallback, FormEvent, useRef, ChangeEvent, useEffect } from 'react'
import Header from '@/components/Header'
import ChatPanel, { Message } from '@/components/ChatPanel'
import StateSelect, { US_STATES } from '@/components/StateSelect'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      type: 'assistant',
      content: "Welcome to GreenVision.\n\nCapture any item, share your location, and discover the best recycling options near you.",
      timestamp: new Date(),
    },
  ])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isFormValid = selectedFile && city.trim() && state

  const handleImageSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }, [previewUrl])

  const handleImageClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [previewUrl])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !city.trim() || !state) {
      setError('Please add a photo and enter your location.')
      return
    }

    setIsLoading(true)
    setError(null)

    const currentCity = city.trim()
    const currentState = state
    const currentPreviewUrl = previewUrl

    const userMessageId = generateId()
    const userMessage: Message = {
      id: userMessageId,
      type: 'user',
      content: 'Identify recycling options',
      imageUrl: currentPreviewUrl || undefined,
      city: currentCity,
      state: currentState,
      timestamp: new Date(),
    }

    const loadingMessageId = generateId()
    const loadingMessage: Message = {
      id: loadingMessageId,
      type: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])

    setSelectedFile(null)
    setPreviewUrl(null)
    setCity('')
    setState('')
    if (fileInputRef.current) fileInputRef.current.value = ''

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured')
      }

      const url = `${webhookUrl}?city=${encodeURIComponent(currentCity)}&state=${encodeURIComponent(currentState)}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }

      const responseText = await response.text()

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                content: responseText || 'No recycling options found.',
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
          errorMessage = 'Request timed out. Please try again.'
        } else if (err.message.includes('Webhook URL not configured')) {
          errorMessage = 'Service not configured. Please contact support.'
        } else if (err.message.includes('fetch')) {
          errorMessage = 'Unable to connect. Please check your connection.'
        } else {
          errorMessage = err.message
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, content: errorMessage, isLoading: false, timestamp: new Date() }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      if (currentPreviewUrl) URL.revokeObjectURL(currentPreviewUrl)
    }
  }

  return (
    <div className="h-screen h-[100dvh] flex flex-col overflow-hidden relative">
      {/* Dark Haze Gradient Background */}
      <div className="fixed inset-0 -z-10" style={{ background: '#080f0c' }}>
        {/* Animated gradient orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            top: '-20%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            bottom: '10%',
            right: '-15%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: '40%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'glow 8s ease-in-out infinite',
          }}
        />
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <Header />

      <main className="flex-1 overflow-hidden relative z-10">
        <ChatPanel messages={messages} />
      </main>

      <div className="flex-shrink-0 p-4 pb-8 safe-bottom relative z-10">
        <form 
          onSubmit={handleSubmit} 
          className="rounded-2xl p-4 glass-dark"
          style={{
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          {previewUrl && (
            <div className="mb-4 relative inline-block">
              <div 
                className="w-24 h-24 rounded-xl overflow-hidden"
                style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}
              >
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleImageClear}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                }}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {error && (
            <div 
              className="mb-3 px-4 py-3 rounded-xl text-sm text-red-400 animate-slide-up"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
              id="camera-input"
              disabled={isLoading}
            />
            <label
              htmlFor="camera-input"
              className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer
                transition-all duration-300 hover:scale-105
                ${isLoading ? 'opacity-40 cursor-not-allowed' : ''}
              `}
              style={previewUrl ? {
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
                color: '#34d399',
              } : {
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              disabled={isLoading}
              className="
                flex-1 h-12 px-4 rounded-xl text-sm font-medium
                bg-white/5 border border-white/10 text-white placeholder:text-white/30
                focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/30 focus:bg-white/10
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-300
              "
            />

            <div className="w-40">
              <StateSelect value={state} onChange={setState} disabled={isLoading} />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300
                ${isFormValid && !isLoading 
                  ? 'hover:scale-105 active:scale-95' 
                  : 'cursor-not-allowed'
                }
              `}
              style={isFormValid && !isLoading ? {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2)',
              } : {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-white/30 font-medium">
            Capture · Locate · Recycle
          </p>
        </form>
      </div>
    </div>
  )
}
