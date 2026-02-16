'use client'

import { motion } from 'framer-motion'
import { Crown, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
            <span className="text-xl font-bold">TrialWatch</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Discover</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Track</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-semibold text-black text-sm hover:opacity-90 transition-opacity">
              Get Started
            </button>
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
              <a href="#" className="text-gray-300 hover:text-white py-2">Discover</a>
              <a href="#" className="text-gray-300 hover:text-white py-2">Track</a>
              <a href="#" className="text-gray-300 hover:text-white py-2">Pricing</a>
              <hr className="border-white/10" />
              <button className="text-gray-300 hover:text-white py-2 text-left">Sign In</button>
              <button className="px-4 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg font-semibold text-black">
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
