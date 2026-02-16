'use client'

import { motion } from 'framer-motion'
import { Search, Sparkles, Shield, Bell, TrendingUp, CreditCard, ArrowRight } from 'lucide-react'
import TrialCard from './components/TrialCard'
import Navbar from './components/Navbar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const featuredTrials = [
  {
    id: '1',
    name: 'Netflix',
    category: 'Streaming',
    trialDays: 30,
    monthlyPrice: 15.49,
    rating: 4.8,
    description: 'Watch unlimited movies and TV shows',
    color: '#E50914',
    affiliateUrl: 'https://netflix.com/signup',
  },
  {
    id: '2',
    name: 'Spotify Premium',
    category: 'Music',
    trialDays: 30,
    monthlyPrice: 10.99,
    rating: 4.9,
    description: 'Ad-free music streaming',
    color: '#1DB954',
    affiliateUrl: 'https://spotify.com/premium',
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    category: 'Productivity',
    trialDays: 7,
    monthlyPrice: 54.99,
    rating: 4.7,
    description: 'Full suite of creative apps',
    color: '#FF0000',
    affiliateUrl: 'https://adobe.com/creativecloud',
  },
  {
    id: '4',
    name: 'YouTube Premium',
    category: 'Streaming',
    trialDays: 30,
    monthlyPrice: 13.99,
    rating: 4.6,
    description: 'No ads, offline playback',
    color: '#FF0000',
    affiliateUrl: 'https://youtube.com/premium',
  },
  {
    id: '5',
    name: 'ChatGPT Plus',
    category: 'AI Tools',
    trialDays: 0,
    monthlyPrice: 20.00,
    rating: 4.8,
    description: 'GPT-4 access, faster responses',
    color: '#10A37F',
    affiliateUrl: 'https://chat.openai.com',
  },
  {
    id: '6',
    name: 'Canva Pro',
    category: 'Design',
    trialDays: 30,
    monthlyPrice: 12.99,
    rating: 4.7,
    description: 'Professional design tools',
    color: '#00C4CC',
    affiliateUrl: 'https://canva.com/pro',
  },
]

const stats = [
  { label: 'Active Users', value: '10,000+', icon: TrendingUp },
  { label: 'Money Saved', value: '$2.4M+', icon: CreditCard },
  { label: 'Trials Tracked', value: '50,000+', icon: Sparkles },
]

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const filteredTrials = featuredTrials.filter(trial =>
    trial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trial.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px] animate-pulse-slow" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Save an average of $240/year
            </span>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Stop Paying for{' '}
              <span className="gradient-text">Forgotten</span>
              <br />
              Free Trials
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Discover 50+ premium free trials worth $2,000+. Track them all in one place. 
              Get smart alerts before you get charged.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-bold text-lg text-black shadow-lg shadow-accent-cyan/30 hover:shadow-accent-cyan/50 transition-shadow"
              >
                {user ? 'Go to Dashboard' : 'Start Tracking Free'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('trials')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 glass rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                View All Trials
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Trials Section */}
      <section id="trials" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Discover <span className="gradient-text">Premium</span> Free Trials
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hand-picked best free trials. Start with confidence, cancel on time, save money.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trials (e.g., Netflix, Spotify, Adobe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white placeholder-gray-500"
              />
            </div>
          </div>
          
          {/* Trial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrials.map((trial, index) => (
              <TrialCard key={trial.id} trial={trial} index={index} />
            ))}
          </div>
          
          {filteredTrials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No trials found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How TrialWatch <span className="gradient-text">Saves</span> You Money
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'Auto-Import from Email',
                description: 'We scan your inbox and automatically detect new trials. No manual entry needed.',
              },
              {
                icon: Bell,
                title: 'Smart Alerts',
                description: 'Get notified 3 days, 1 day, and 1 hour before your trial expires. Never miss a deadline.',
              },
              {
                icon: Shield,
                title: 'Charge Prevention',
                description: 'Connect your bank and we\'ll alert you before ANY unwanted charge hits your account.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-8 rounded-2xl glass-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-accent-cyan" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass p-12 rounded-3xl glow-cyan"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Save Money?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join 10,000+ users who never pay for forgotten trials again.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-bold text-lg text-black shadow-lg shadow-accent-cyan/30 hover:shadow-accent-cyan/50 transition-all hover:scale-105"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Track 3 trials free forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="mb-2">© 2024 TrialWatch. All rights reserved.</p>
          <p className="text-sm">
            Made with ❤️ to help you save money on subscriptions.
          </p>
        </div>
      </footer>
    </main>
  )
}
