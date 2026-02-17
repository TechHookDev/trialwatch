// Service Worker for Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  
  const options = {
    body: data.body || 'Trial reminder',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: data.trialId || 'trial-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'View Trial'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      trialId: data.trialId,
      url: data.url || '/dashboard'
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TrialWatch Reminder', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/dashboard'
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})
