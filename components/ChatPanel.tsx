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

function LoadingDots() {
  return (
    <div className="loading-dots flex gap-1.5 items-center py-1">
      <span className="w-2 h-2 bg-sage-500 rounded-full" />
      <span className="w-2 h-2 bg-sage-500 rounded-full" />
      <span className="w-2 h-2 bg-sage-500 rounded-full" />
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.type === 'user'
  
  return (
    <div
      className={`chat-bubble flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] ${
          isUser
            ? 'bg-gradient-to-br from-sage-600 to-sage-700 text-white rounded-2xl rounded-br-md'
            : 'bg-white/90 backdrop-blur-sm text-forest border border-sage-100 rounded-2xl rounded-bl-md shadow-soft'
        } px-4 py-3`}
      >
        {/* User image preview */}
        {isUser && message.imageUrl && (
          <div className="mb-2">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white/30">
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
          <div className="flex items-center gap-1.5 mb-2 text-sage-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">
              {message.city}, {message.state}
            </span>
          </div>
        )}
        
        {/* Message content or loading state */}
        {message.isLoading ? (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center animate-pulse-soft">
                <svg className="w-4 h-4 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-sage-700 font-medium">Analyzing your item...</p>
              <p className="text-xs text-sage-500 mt-0.5">Finding recycling options nearby</p>
              <LoadingDots />
            </div>
          </div>
        ) : (
          <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-forest'}`}>
            {message.content}
          </div>
        )}
        
        {/* Timestamp */}
        <div className={`mt-2 text-[10px] ${isUser ? 'text-sage-200' : 'text-sage-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-sage-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm">Start by taking a photo</p>
          </div>
        </div>
      )}
    </div>
  )
}
