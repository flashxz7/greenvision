'use client'

import { useEffect, useRef } from 'react'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  imageUrl?: string
  city?: string
  state?: string
  isLoading?: boolean
  timestamp: Date
}

interface ChatPanelProps {
  messages: Message[]
}

function LoadingPulse() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <div 
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            boxShadow: '0 0 10px #10b981, 0 0 20px rgba(16, 185, 129, 0.5)',
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}

function MessageBubble({ message, isLast }: { message: Message; isLast: boolean }) {
  const isUser = message.type === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isLast ? 'animate-slide-up' : ''}`}
    >
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
        style={isUser ? {
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
          boxShadow: '0 4px 30px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
        } : {
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* User image preview */}
        {isUser && message.imageUrl && (
          <div className="p-4 pb-0">
            <div 
              className="w-32 h-32 rounded-xl overflow-hidden"
              style={{ boxShadow: '0 0 20px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)' }}
            >
              <img
                src={message.imageUrl}
                alt="Uploaded item"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Location badge for user messages */}
        {isUser && message.city && message.state && (
          <div className="px-4 pt-3 flex items-center gap-2 text-emerald-100/80">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-xs font-medium">
              {message.city}, {message.state}
            </span>
          </div>
        )}

        {/* Message content or loading state */}
        <div className="p-4">
          {message.isLoading ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60 font-medium">Finding recycling options</span>
              <LoadingPulse />
            </div>
          ) : (
            <div className={`text-sm leading-relaxed whitespace-pre-wrap font-medium ${isUser ? 'text-white' : 'text-white/80'}`}>
              {message.content}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChatPanel({ messages }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
    >
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          isLast={index === messages.length - 1}
        />
      ))}
    </div>
  )
}
