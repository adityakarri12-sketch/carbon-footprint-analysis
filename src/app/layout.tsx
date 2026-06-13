import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Outfit, Roboto_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

import { SkipToContent } from '@/components/skip-to-content'
import { Navbar } from '@/components/navbar'
import { VoiceCommander } from '@/components/voice-commander'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'CarbonWise – Intelligent Carbon Footprint Awareness Platform',
  description: 'Track, understand, and reduce your environmental footprint with AI-driven insights and interactive goal setting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={`${outfit.variable} ${robotoMono.variable} font-sans`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SkipToContent />
            <div className="relative flex min-h-screen flex-col bg-background">
              <Navbar />
              <main id="main-content" className="flex-1 flex flex-col">
                {children}
              </main>
              <VoiceCommander />
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
