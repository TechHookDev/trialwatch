'use client'

import { useEffect } from 'react'
import { NotificationProvider } from '@/lib/notifications'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}
