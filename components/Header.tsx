'use client'

export default function Header() {
  return (
    <header className="flex-shrink-0 px-6 py-5 flex items-center justify-between relative z-10">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        {/* Glowing Logo Icon */}
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(255,255,255,0.1)',
          }}
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            GreenVision
          </h1>
          <p className="text-xs text-emerald-400/70 font-medium -mt-0.5">
            Smart Recycling
          </p>
        </div>
      </div>

      {/* Status indicator with glow */}
      <div 
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)',
        }}
      >
        <div 
          className="w-2 h-2 rounded-full"
          style={{
            background: '#10b981',
            boxShadow: '0 0 10px #10b981, 0 0 20px #10b981',
          }}
        />
        <span className="text-xs font-medium text-emerald-400">Ready</span>
      </div>
    </header>
  )
}
