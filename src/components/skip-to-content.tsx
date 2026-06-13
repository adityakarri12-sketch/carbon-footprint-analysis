'use client'

import React from 'react'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-background focus:p-4 focus:text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
    >
      Skip to main content
    </a>
  )
}
