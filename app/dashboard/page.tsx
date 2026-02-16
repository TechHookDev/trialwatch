'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Bell, Settings, CreditCard, Calendar, TrendingUp, Clock } from 'lucide-react'

interface Trial {
  id: string
  name: string
  startDate: string
  endDate: string
  monthlyCost: number
  status: 'active' | 'expiring' | 'cancelled'
  daysLeft: number
}

const mockTrials: Trial[] = [
  {
    id: '1',
    name: 'Netflix Premium',
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    monthlyCost: 15.49,
    status: 'expiring',
    daysLeft: 2,
  },
  {
    id: '2',
    name: 'Spotify Premium',
    startDate: '2024-01-20',
    endDate: '2024-02-19',
    monthlyCost: 10.99,
    status: 'active',
    daysLeft: 7,
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    monthlyCost: 54.99,
    status: 'cancelled',
    daysLeft: 0,
  },
]

const stats = [
  { label: 'Active Trials', value: '2', icon: Clock, color: 'text-accent-cyan' },
  { label: 'Money at Risk', value: '$26.48', icon: CreditCard, color: 'text-accent-red' },
  { label: 'Saved This Month', value: '$54.99', icon: TrendingUp, color: 'text-accent-green' },
]

export default function Dashboard() {
  const [trials] = useState<Trial[]>(mockTrials)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTrials = trials.filter(trial =>
    trial.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <span className="text-xl font-bold">TrialWatch</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center font-bold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white placeholder-gray-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-semibold text-black hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Add Trial
          </button>
        </div>

        {/* Trials List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Your Trials</h2>
          
          {filteredTrials.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">No trials yet</h3>
              <p className="text-gray-400 mb-6">Start by adding your first trial or discovering new ones</p>
              <button className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-semibold text-black">
                Discover Trials
              </button>
            </div>
          ) : (
            filteredTrials.map((trial, index) => (
              <motion.div
                key={trial.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`glass rounded-2xl p-6 flex items-center justify-between ${
                  trial.status === 'expiring' ? 'border-accent-red/50 border' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl font-bold">
                    {trial.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{trial.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Ends: {trial.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        ${trial.monthlyCost}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {trial.status === 'expiring' && (
                    <span className="px-3 py-1 bg-accent-red/20 text-accent-red rounded-full text-sm font-semibold">
                      {trial.daysLeft} days left!
                    </span>
                  )}
                  {trial.status === 'active' && (
                    <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-sm font-semibold">
                      {trial.daysLeft} days left
                    </span>
                  )}
                  {trial.status === 'cancelled' && (
                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-semibold">
                      Cancelled
                    </span>
                  )}
                  
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                    {trial.status === 'expiring' ? 'Cancel Now' : 'Manage'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
