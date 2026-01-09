'use client'

import { useState, useRef, useEffect } from 'react'

export const US_STATES = [
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

interface StateSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function StateSelect({ value, onChange, disabled }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full h-12 px-4 rounded-xl text-left transition-all duration-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
        style={isOpen ? { 
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(16, 185, 129, 0.05)',
          borderColor: 'rgba(16, 185, 129, 0.4)'
        } : {}}
      >
        <span className={`text-sm font-medium ${value ? 'text-white' : 'text-white/40'}`}>
          {selectedState ? selectedState.name : 'State'}
        </span>
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden z-50 border border-white/10 animate-slide-down"
          style={{ 
            background: 'rgba(15, 23, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.1)',
          }}
        >
          <div className="p-2 border-b border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search states..."
              className="w-full px-3 py-2.5 text-sm bg-white/5 rounded-lg border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/30"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredStates.map((state) => (
              <button
                key={state.code}
                type="button"
                onClick={() => {
                  onChange(state.code)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-all duration-150 hover:bg-emerald-500/10 ${value === state.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/80'}`}
              >
                <span className="font-semibold">{state.code}</span>
                <span className="text-white/40 ml-2 font-normal">{state.name}</span>
              </button>
            ))}
            {filteredStates.length === 0 && (
              <div className="px-4 py-4 text-sm text-white/30 text-center">No states found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
