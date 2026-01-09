'use client'

export default function Header() {
  return (
    <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-sage-100 safe-area-top">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center shadow-soft">
              {/* Stylized recycling leaf icon */}
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3C9 7 5 8.5 3 12c3-1.5 6-0.5 9 3c3-3.5 6-4.5 9-3c-2-3.5-6-5-9-9z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <circle cx="12" cy="14" r="2.5" fill="currentColor" />
              </svg>
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-xl border-2 border-sage-300/50 -m-0.5" />
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-lg font-semibold text-forest tracking-tight">
              GreenVision
            </h1>
            <p className="text-[10px] text-sage-500 font-medium -mt-0.5">
              Smart Recycling Helper
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage-50 border border-sage-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-sage-600">Ready</span>
          </div>
        </div>
      </div>
    </header>
  )
}
