'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface NotificationContextType {
  permission: NotificationPermission | null
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  isSubscribed: boolean
  requestPermission: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
    
    // Check if already subscribed
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    }
  }

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === 'granted') {
      await subscribe()
    }
  }

  const subscribe = async () => {
    try {
      if (!('serviceWorker' in navigator)) return

      const registration = await navigator.serviceWorker.ready
      
      // Get VAPID public key from your server (you need to generate this)
      // For now, we'll use a demo key - replace with your actual key
      const vapidPublicKey = 'BEl62iTMgUfBQ0v3L-7H5z6tH6xL_JXj3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3J3'
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // Send subscription to your server
      // await fetch('/api/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(subscription)
      // })

      setIsSubscribed(true)
      console.log('Push notification subscribed:', subscription)
    } catch (error) {
      console.error('Failed to subscribe:', error)
    }
  }

  const unsubscribe = async () => {
    try {
      if (!('serviceWorker' in navigator)) return

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
        
        // Notify server to remove subscription
        // await fetch('/api/unsubscribe', {
        //   method: 'POST',
        //   body: JSON.stringify({ endpoint: subscription.endpoint })
        // })
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
  }

  return (
    <NotificationContext.Provider value={{ permission, subscribe, unsubscribe, isSubscribed, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Send local notification (immediate)
export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    })
  }
}

// Schedule a notification
export function scheduleNotification(title: string, body: string, delayMs: number) {
  setTimeout(() => {
    sendLocalNotification(title, { body })
  }, delayMs)
}
