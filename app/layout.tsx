import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GreenVision',
  description: 'Smart recycling made simple',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GreenVision',
  },
  applicationName: 'GreenVision',
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#080f0c',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#080f0c' }}>
      <head>
        <meta name="theme-color" content="#080f0c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #__next { background: #080f0c !important; }
        `}} />
      </head>
      <body style={{ background: '#080f0c' }}>{children}</body>
    </html>
  )
}
