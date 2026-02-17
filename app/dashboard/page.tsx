'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Plus, Search, LogOut, CreditCard, Calendar, TrendingUp, Clock, ExternalLink, Trash2, Crown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/premium'
import NotificationBell from '@/app/components/NotificationBell'

interface Trial {
  id: string
  name: string
  service_url?: string
  monthly_cost?: number
  trial_days: number
  start_date: string
  end_date: string
  status: 'active' | 'cancelled' | 'expired'
  created_at: string
}

interface UserProfile {
  is_premium: boolean
  subscription_plan: string
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [trials, setTrials] = useState<Trial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [newTrial, setNewTrial] = useState({
    name: '',
    service_url: '',
    monthly_cost: '',
    trial_days: '30',
  })

  // Fetch user profile and trials
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchUserProfile()
    fetchTrials()
  }, [user, router])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        await supabase.from('user_profiles').insert({
          id: user?.id,
          is_premium: false,
          subscription_plan: 'free'
        })
        setUserProfile({ is_premium: false, subscription_plan: 'free' })
      } else if (data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Fetch trials from Supabase
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchTrials()
  }, [user, router])

  const fetchTrials = async () => {
    try {
      const { data, error } = await supabase
        .from('trials')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTrials(data || [])
    } catch (error) {
      console.error('Error fetching trials:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTrial = async () => {
    if (!newTrial.name) return

    // Check trial limit for free users
    if (!userProfile?.is_premium && trials.length >= PLANS.FREE.trialLimit) {
      alert(`Free users can only track ${PLANS.FREE.trialLimit} trials. Upgrade to Premium for unlimited tracking!`)
      router.push('/upgrade')
      return
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + parseInt(newTrial.trial_days))

    try {
      const { error } = await supabase.from('trials').insert({
        user_id: user?.id,
        name: newTrial.name,
        service_url: newTrial.service_url || null,
        monthly_cost: newTrial.monthly_cost ? parseFloat(newTrial.monthly_cost) : null,
        trial_days: parseInt(newTrial.trial_days),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
      })

      if (error) throw error

      setNewTrial({ name: '', service_url: '', monthly_cost: '', trial_days: '30' })
      setShowAddModal(false)
      fetchTrials()
    } catch (error) {
      console.error('Error adding trial:', error)
      alert('Failed to add trial. Please try again.')
    }
  }

  const deleteTrial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trial?')) return

    try {
      const { error } = await supabase.from('trials').delete().eq('id', id)
      if (error) throw error
      fetchTrials()
    } catch (error) {
      console.error('Error deleting trial:', error)
    }
  }

  const cancelTrial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trials')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error
      fetchTrials()
    } catch (error) {
      console.error('Error cancelling trial:', error)
    }
  }

  // Calculate stats
  const activeTrials = trials.filter(t => t.status === 'active')
  const moneyAtRisk = activeTrials.reduce((sum, t) => sum + (t.monthly_cost || 0), 0)
  const savedTrials = trials.filter(t => t.status === 'cancelled')
  const moneySaved = savedTrials.reduce((sum, t) => sum + (t.monthly_cost || 0), 0)

  // Calculate days left
  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const filteredTrials = trials.filter(trial =>
    trial.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your trials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
              <Image src="/logo.png" alt="TrialWatch" width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold">TrialWatch</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Upgrade button for free users */}
              {!userProfile?.is_premium && (
                <button 
                  onClick={() => router.push('/upgrade')}
                  className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-lg font-semibold text-sm hover:bg-accent-cyan/30 transition-colors flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade
                </button>
              )}
              
              {/* Premium badge for paid users */}
              {userProfile?.is_premium && (
                <span className="px-3 py-1 bg-accent-cyan/20 text-accent-cyan rounded-lg text-sm font-semibold flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Premium
                </span>
              )}
              
              <NotificationBell />
              <button onClick={() => signOut()} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center font-bold">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Trials</p>
                <p className="text-3xl font-bold text-accent-cyan">{activeTrials.length}</p>
              </div>
              <Clock className="w-8 h-8 text-accent-cyan opacity-50" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Money at Risk</p>
                <p className="text-3xl font-bold text-accent-red">${moneyAtRisk.toFixed(2)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-accent-red opacity-50" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Money Saved</p>
                <p className="text-3xl font-bold text-accent-green">${moneySaved.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-green opacity-50" />
            </div>
          </motion.div>
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
          <div className="flex items-center gap-3">
            {/* Trial limit indicator for free users */}
            {!userProfile?.is_premium && (
              <span className="text-sm text-gray-400">
                {trials.length}/{PLANS.FREE.trialLimit} trials
              </span>
            )}
            
            <button
              onClick={() => {
                if (!userProfile?.is_premium && trials.length >= PLANS.FREE.trialLimit) {
                  alert(`You've reached the limit of ${PLANS.FREE.trialLimit} trials. Upgrade to Premium for unlimited tracking!`)
                  router.push('/upgrade')
                  return
                }
                setShowAddModal(true)
              }}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-opacity ${
                !userProfile?.is_premium && trials.length >= PLANS.FREE.trialLimit
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent-cyan to-accent-purple text-black hover:opacity-90'
              }`}
              disabled={!userProfile?.is_premium && trials.length >= PLANS.FREE.trialLimit}
            >
              <Plus className="w-5 h-5" />
              Add Trial
            </button>
          </div>
        </div>

        {/* Trials List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Your Trials ({filteredTrials.length})</h2>
          
          {filteredTrials.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">No trials yet</h3>
              <p className="text-gray-400 mb-6">Start by adding your first trial or discover new ones</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-semibold text-black"
                >
                  Add Trial
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 glass rounded-xl font-semibold"
                >
                  Discover Trials
                </button>
              </div>
            </div>
          ) : (
            filteredTrials.map((trial, index) => {
              const daysLeft = getDaysLeft(trial.end_date)
              const isExpiring = daysLeft <= 3 && trial.status === 'active'
              
              return (
                <motion.div
                  key={trial.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`glass rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isExpiring ? 'border-accent-red/50 border' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl font-bold">
                      {trial.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{trial.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Ends: {new Date(trial.end_date).toLocaleDateString()}
                        </span>
                        {trial.monthly_cost && (
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            ${trial.monthly_cost}/mo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {trial.status === 'active' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isExpiring 
                          ? 'bg-accent-red/20 text-accent-red' 
                          : daysLeft <= 7 
                            ? 'bg-accent-amber/20 text-accent-amber'
                            : 'bg-accent-green/20 text-accent-green'
                      }`}>
                        {isExpiring ? `${daysLeft} days left!` : `${daysLeft} days left`}
                      </span>
                    )}
                    {trial.status === 'cancelled' && (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-semibold">
                        Cancelled
                      </span>
                    )}
                    
                    <div className="flex gap-2">
                      {trial.service_url && (
                        <a
                          href={trial.service_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {trial.status === 'active' && (
                        <button
                          onClick={() => cancelTrial(trial.id)}
                          className="px-4 py-2 bg-accent-green/20 hover:bg-accent-green/30 text-accent-green rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancelled ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteTrial(trial.id)}
                        className="p-2 bg-white/5 hover:bg-accent-red/20 text-gray-400 hover:text-accent-red rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </main>

      {/* Add Trial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Add New Trial</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix, Spotify"
                  value={newTrial.name}
                  onChange={(e) => setNewTrial({ ...newTrial, name: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Service URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newTrial.service_url}
                  onChange={(e) => setNewTrial({ ...newTrial, service_url: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Cost ($)</label>
                  <input
                    type="number"
                    placeholder="15.99"
                    value={newTrial.monthly_cost}
                    onChange={(e) => setNewTrial({ ...newTrial, monthly_cost: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trial Days</label>
                  <select
                    value={newTrial.trial_days}
                    onChange={(e) => setNewTrial({ ...newTrial, trial_days: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-light/50 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTrial}
                disabled={!newTrial.name}
                className="flex-1 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-semibold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Add Trial
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
