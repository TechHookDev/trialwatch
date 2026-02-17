'use client'

import { motion } from 'framer-motion'
import { Search, Sparkles, TrendingUp, CreditCard } from 'lucide-react'
import Navbar from './components/Navbar'
import TrialCard from './components/TrialCard'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { featuredTrials, trialCategories, getTrialsByCategory, searchTrials } from '@/data/trials'

const stats = [
  { label: 'Active Users', value: '10,000+', icon: TrendingUp },
  { label: 'Money Saved', value: '$2.4M+', icon: CreditCard },
  { label: 'Trials Tracked', value: '50,000+', icon: Sparkles },
  { label: 'Trial Options', value: '95+', icon: Bell },
]

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  // Get filtered trials
  let displayedTrials = featuredTrials
  
  if (searchQuery) {
    displayedTrials = searchTrials(searchQuery)
  } else if (selectedCategory !== 'All') {
    displayedTrials = getTrialsByCategory(selectedCategory)
  }

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
              Discover 95+ verified premium trials worth $2,000+. Track them all in one place. 
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
                Browse 95+ Verified Trials
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
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

      {/* All Trials Section */}
      <section id="trials" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Discover <span className="gradient-text">95+</span> Verified Free Trials
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hand-picked, verified trials across 16 categories. Start with confidence, cancel on time, save money.
            </p>
          </div>
          
          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-12 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trials (e.g., Netflix, Spotify, design tools, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white placeholder-gray-500"
              />
            </div>

            {/* Category Filters - Always Visible */}
            <div className="flex flex-wrap gap-2">
              {trialCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-accent-cyan text-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Clear Filter Button */}
            {selectedCategory !== 'All' && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Filter:</span>
                <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan rounded-full text-sm font-medium">
                  {selectedCategory}
                </span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-gray-500 hover:text-white text-sm"
                >
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
          
          {/* Results Count */}
          <div className="mb-6 text-gray-400">
            Showing {displayedTrials.length} trial{displayedTrials.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && !searchQuery && ` in ${selectedCategory}`}
          </div>
          
          {/* Trial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedTrials.map((trial, index) => (
              <TrialCard key={trial.id} trial={trial} index={index} />
            ))}
          </div>
          
          {displayedTrials.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No trials found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filters to find more trials.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="mt-4 px-6 py-3 bg-accent-cyan/20 text-accent-cyan rounded-xl font-semibold hover:bg-accent-cyan/30 transition-colors"
              >
                Clear Filters
              </button>
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
