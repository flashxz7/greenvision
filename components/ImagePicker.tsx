'use client'

import { useRef, ChangeEvent } from 'react'

interface ImagePickerProps {
  onImageSelect: (file: File, previewUrl: string) => void
  previewUrl: string | null
  onClear: () => void
}

export default function ImagePicker({ onImageSelect, previewUrl, onClear }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageSelect(file, url)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
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
      />
      
      {previewUrl ? (
        <div className="image-preview-container relative group">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-soft border-2 border-sage-200">
            <img
              src={previewUrl}
              alt="Selected item preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover/focus */}
            <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors duration-200" />
          </div>
          
          {/* Clear button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors duration-200 btn-press"
            aria-label="Remove image"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Change photo button */}
          <button
            onClick={handleClick}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-sage-600 text-white text-[10px] font-medium rounded-full shadow-md hover:bg-sage-700 transition-colors duration-200"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="w-16 h-16 rounded-xl border-2 border-dashed border-sage-300 hover:border-sage-500 bg-sage-50/50 hover:bg-sage-100/70 flex flex-col items-center justify-center gap-1 transition-all duration-200 btn-press group"
          aria-label="Add photo"
        >
          <div className="w-7 h-7 rounded-lg bg-sage-200 group-hover:bg-sage-300 flex items-center justify-center transition-colors duration-200">
            <svg className="w-4 h-4 text-sage-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-[9px] font-medium text-sage-600 group-hover:text-sage-700">Photo</span>
        </button>
      )}
    </div>
  )
}
