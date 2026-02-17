'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import { useNotifications } from '@/lib/notifications'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationBell() {
  const { permission, isSubscribed, requestPermission, unsubscribe } = useNotifications()
  const [showMenu, setShowMenu] = useState(false)

  const handleEnable = async () => {
    await requestPermission()
    setShowMenu(false)
  }

  const handleDisable = async () => {
    await unsubscribe()
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
      >
        {isSubscribed ? (
          <Bell className="w-5 h-5 text-accent-cyan" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-500" />
        )}
        
        {/* Notification dot */}
        {isSubscribed && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full mt-2 w-64 glass rounded-xl p-4 z-50"
          >
            <h4 className="font-semibold mb-2">Notifications</h4>
            
            <div className="space-y-3">
              {permission === 'default' && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Enable notifications to get trial reminders
                  </p>
                  <button
                    onClick={handleEnable}
                    className="w-full py-2 bg-accent-cyan/20 text-accent-cyan rounded-lg text-sm font-semibold hover:bg-accent-cyan/30 transition-colors"
                  >
                    Enable Notifications
                  </button>
                </div>
              )}

              {permission === 'denied' && (
                <p className="text-sm text-red-400">
                  Notifications blocked. Enable in browser settings.
                </p>
              )}

              {isSubscribed && (
                <div>
                  <div className="flex items-center gap-2 text-accent-cyan mb-2">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Notifications enabled</span>
                  </div>
                  <button
                    onClick={handleDisable}
                    className="w-full py-2 bg-white/5 text-gray-400 rounded-lg text-sm hover:bg-white/10 transition-colors"
                  >
                    Disable Notifications
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
