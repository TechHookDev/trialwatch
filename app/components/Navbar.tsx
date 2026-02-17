'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image
              src="/logo.png"
              alt="Trials Watch"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-bold">Trials Watch</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/#trials"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('trials')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Discover
            </a>
            {user && (
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-semibold text-black text-sm hover:opacity-90 transition-opacity"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-semibold text-black text-sm hover:opacity-90 transition-opacity"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass rounded-2xl p-6"
          >
            <div className="flex flex-col gap-4">
              <a
                href="/#trials"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('trials')?.scrollIntoView({ behavior: 'smooth' })
                  setIsOpen(false)
                }}
                className="text-gray-300 hover:text-white py-2"
              >
                Discover
              </a>
              {user && (
                <button
                  onClick={() => {
                    router.push('/dashboard')
                    setIsOpen(false)
                  }}
                  className="text-gray-300 hover:text-white py-2 text-left"
                >
                  Dashboard
                </button>
              )}
              <hr className="border-white/10" />
              {user ? (
                <button
                  onClick={() => {
                    router.push('/dashboard')
                    setIsOpen(false)
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-semibold text-black"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      router.push('/login')
                      setIsOpen(false)
                    }}
                    className="text-gray-300 hover:text-white py-2 text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push('/login')
                      setIsOpen(false)
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-semibold text-black"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
