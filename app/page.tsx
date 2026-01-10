'use client'

import { useState, useCallback, FormEvent, useRef, ChangeEvent, useEffect } from 'react'

// US States data
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington DC' }
]

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  imageUrl?: string
  city?: string
  state?: string
  isLoading?: boolean
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Theme Toggle Component
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-14 h-7 rounded-full transition-all duration-300 flex items-center"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1a2f23, #0f1f17)' 
          : 'linear-gradient(135deg, #e0f2e9, #d1fae5)',
        boxShadow: isDark 
          ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(16, 185, 129, 0.2)' 
          : 'inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div
        className="absolute w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          left: isDark ? '30px' : '4px',
          background: isDark 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: isDark 
            ? '0 0 10px rgba(16, 185, 129, 0.5)' 
            : '0 0 10px rgba(251, 191, 36, 0.5)',
        }}
      >
        {isDark ? (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  )
}

// Loading Dots
function LoadingPulse({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <div 
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: '#10b981',
            boxShadow: isDark ? '0 0 8px #10b981' : '0 0 6px #059669',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}

// State Select Component
function StateSelect({ 
  value, 
  onChange, 
  disabled, 
  isDark 
}: { 
  value: string
  onChange: (v: string) => void
  disabled: boolean
  isDark: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedState = US_STATES.find(s => s.code === value)
  const filteredStates = US_STATES.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const bgStyle = isDark 
    ? { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }
    : { background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.1)' }

  const dropdownBg = isDark 
    ? { background: 'rgba(15, 23, 20, 0.98)', borderColor: 'rgba(255,255,255,0.1)' }
    : { background: 'rgba(255,255,255,0.98)', borderColor: 'rgba(0,0,0,0.1)' }

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full h-12 px-3 rounded-xl text-left transition-all duration-300 border text-sm font-medium disabled:opacity-40"
        style={{
          ...bgStyle,
          color: value ? (isDark ? '#fff' : '#1f2937') : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'),
        }}
      >
        <span className="block truncate pr-6">
          {selectedState ? selectedState.name : 'State'}
        </span>
        <svg 
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden z-50 border shadow-xl animate-slide-down"
          style={{ ...dropdownBg, backdropFilter: 'blur(20px)' }}
        >
          <div className="p-2 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: isDark ? '#fff' : '#1f2937',
              }}
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredStates.map((state) => (
              <button
                key={state.code}
                type="button"
                onClick={() => {
                  onChange(state.code)
                  setIsOpen(false)
                  setSearch('')
                }}
                className="w-full px-3 py-2.5 text-left text-sm transition-colors"
                style={{
                  background: value === state.code 
                    ? (isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)') 
                    : 'transparent',
                  color: value === state.code 
                    ? '#10b981' 
                    : (isDark ? 'rgba(255,255,255,0.8)' : '#374151'),
                }}
              >
                <span className="font-semibold">{state.code}</span>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}> — {state.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Message Component
function MessageBubble({ message, isLast, isDark }: { message: Message; isLast: boolean; isDark: boolean }) {
  const isUser = message.type === 'user'
  
  const userStyle = {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    boxShadow: isDark ? '0 4px 20px rgba(16,185,129,0.3)' : '0 4px 15px rgba(16,185,129,0.25)',
  }

  const assistantStyle = isDark ? {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  } : {
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  }
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isLast ? 'animate-slide-up' : ''}`}
    >
      <div 
        className="max-w-[88%] rounded-2xl"
        style={{
          ...(isUser ? userStyle : assistantStyle),
          borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
        }}
      >
        {isUser && message.imageUrl && (
          <div className="p-3 pb-0">
            <div className="w-24 h-24 rounded-xl overflow-hidden">
              <img src={message.imageUrl} alt="Item" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        
        {isUser && message.city && message.state && (
          <div className="px-4 pt-2 flex items-center gap-1.5 text-white/80">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-xs font-medium">{message.city}, {message.state}</span>
          </div>
        )}
        
        <div className="p-4">
          {message.isLoading ? (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
                Finding options
              </span>
              <LoadingPulse isDark={isDark} />
            </div>
          ) : (
            <div 
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: isUser ? '#fff' : (isDark ? 'rgba(255,255,255,0.85)' : '#374151') }}
            >
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      type: 'assistant',
      content: "Welcome to GreenVision.\n\nCapture any item, share your location, and discover the best recycling options near you.",
    }
  ])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isFormValid = selectedFile && city.trim() && state

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleClearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading || !selectedFile) return

    setIsLoading(true)
    const currentCity = city.trim()
    const currentState = state
    const currentPreview = previewUrl

    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: 'Find recycling options',
      imageUrl: currentPreview || undefined,
      city: currentCity,
      state: currentState,
    }

    const loadingId = generateId()
    setMessages(prev => [...prev, userMessage, {
      id: loadingId,
      type: 'assistant',
      content: '',
      isLoading: true,
    }])
    
    setSelectedFile(null)
    setPreviewUrl(null)
    setCity('')
    setState('')
    if (fileInputRef.current) fileInputRef.current.value = ''

    try {
      const formData = new FormData()
      formData.append('data', selectedFile)

      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://premai.app.n8n.cloud/webhook-test/recyclingimage'

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)

      const response = await fetch(
        `${webhookUrl}?city=${encodeURIComponent(currentCity)}&state=${encodeURIComponent(currentState)}`,
        { 
          method: 'POST', 
          body: formData, 
          signal: controller.signal 
        }
      )

      clearTimeout(timeout)
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const text = await response.text()

      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingId ? { ...msg, content: text || 'No recycling options found.', isLoading: false } : msg
        )
      )
    } catch (error) {
      console.error('Webhook error:', error)
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingId ? { ...msg, content: 'Unable to connect to recycling service. Please try again.', isLoading: false } : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const theme = {
    bg: isDark ? '#080f0c' : '#f8faf9',
    text: isDark ? '#fff' : '#1f2937',
    textMuted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    inputBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    composerBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
  }

  return (
    <div 
      className="h-[100dvh] flex flex-col overflow-hidden relative"
      style={{ background: theme.bg }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-40" style={{
              top: '-15%', left: '-10%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }} />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-30" style={{
              bottom: '10%', right: '-10%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }} />
          </>
        ) : (
          <>
            <div className="absolute w-[600px] h-[600px] rounded-full" style={{
              top: '-20%', left: '-15%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }} />
            <div className="absolute w-[500px] h-[500px] rounded-full" style={{
              bottom: '0%', right: '-20%',
              background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }} />
          </>
        )}
      </div>

      {/* Header */}
      <header className="flex-shrink-0 px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: isDark ? '0 0 25px rgba(16,185,129,0.4)' : '0 4px 15px rgba(16,185,129,0.3)',
            }}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.text }}>GreenVision</h1>
            <p className="text-xs font-medium text-emerald-500">Smart Recycling</p>
          </div>
        </div>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      </header>

      {/* Chat */}
      <main ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 relative z-10">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} isLast={i === messages.length - 1} isDark={isDark} />
        ))}
      </main>

      {/* Composer */}
      <div className="flex-shrink-0 p-3 pb-6 relative z-10">
        <form 
          onSubmit={handleSubmit} 
          className="rounded-2xl p-3"
          style={{
            background: theme.composerBg,
            border: `1px solid ${theme.inputBorder}`,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark ? '0 -4px 30px rgba(0,0,0,0.3)' : '0 -4px 20px rgba(0,0,0,0.05)',
          }}
        >
          {previewUrl && (
            <div className="mb-3 relative inline-block">
              <div className="w-16 h-16 rounded-xl overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-red-500"
                style={{ boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
              id="camera"
            />
            <label
              htmlFor="camera"
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
              style={{
                background: previewUrl ? (isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)') : theme.inputBg,
                border: `1px solid ${previewUrl ? 'rgba(16,185,129,0.4)' : theme.inputBorder}`,
                color: previewUrl ? '#10b981' : theme.textMuted,
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
              className="flex-1 h-12 px-4 rounded-xl text-sm font-medium focus:outline-none disabled:opacity-40"
              style={{
                background: theme.inputBg,
                border: `1px solid ${theme.inputBorder}`,
                color: theme.text,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <StateSelect value={state} onChange={setState} disabled={isLoading} isDark={isDark} />

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
              style={{
                background: isFormValid && !isLoading ? 'linear-gradient(135deg, #10b981, #059669)' : theme.inputBg,
                boxShadow: isFormValid && !isLoading ? (isDark ? '0 0 25px rgba(16,185,129,0.4)' : '0 4px 15px rgba(16,185,129,0.3)') : 'none',
                border: isFormValid && !isLoading ? 'none' : `1px solid ${theme.inputBorder}`,
              }}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke={isFormValid ? 'white' : theme.textMuted} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
          
          <p className="mt-3 text-center text-xs font-medium" style={{ color: theme.textMuted }}>
            Capture · Locate · Recycle
          </p>
        </form>
      </div>
    </div>
  )
}
