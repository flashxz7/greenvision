'use client'

import { useRef, ChangeEvent } from 'react'

interface ImagePickerProps {
  onImageSelect: (file: File, previewUrl: string) => void
  previewUrl: string | null
  onClear: () => void
  disabled?: boolean
}

export default function ImagePicker({ onImageSelect, previewUrl, onClear, disabled }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageSelect(file, url)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Select or capture image"
        disabled={disabled}
      />

      {previewUrl ? (
        <div className="relative">
          <div className="w-20 h-20 rounded-xl overflow-hidden ring-1 ring-black/5">
            <img
              src={previewUrl}
              alt="Selected item preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Clear button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
            aria-label="Remove image"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            transition-all duration-300
            bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 
            border border-gray-200/60 hover:border-gray-300/60
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label="Add photo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  )
}
