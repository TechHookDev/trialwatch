'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, Crown, Zap, CreditCard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/premium'

export default function UpgradePage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    // TODO: Integrate with Stripe
    // For now, just show a message
    alert(`Upgrade to ${plan} coming soon! We're setting up Stripe payments.`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321] pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-medium mb-6"
          >
            <Crown className="w-4 h-4" />
            Unlock Premium Features
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Never Forget a Trial Again
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Join 2,000+ users saving $200+/year with smart trial tracking
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold mb-2">{PLANS.FREE.name}</h3>
            <div className="text-4xl font-bold mb-4">
              ${PLANS.FREE.price}
              <span className="text-lg text-gray-400">/month</span>
            </div>
            <p className="text-gray-400 mb-6">Perfect for trying out TrialWatch</p>
            
            <ul className="space-y-3 mb-8">
              {PLANS.FREE.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              disabled
              className="w-full py-3 px-6 rounded-xl bg-white/5 text-gray-400 font-semibold cursor-not-allowed"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 border-2 border-accent-cyan/50 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="px-4 py-1 bg-accent-cyan text-black text-sm font-bold rounded-full">
                RECOMMENDED
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {PLANS.PREMIUM.name}
              <Sparkles className="w-5 h-5 text-accent-cyan" />
            </h3>
            <div className="text-4xl font-bold mb-4">
              ${PLANS.PREMIUM.price}
              <span className="text-lg text-gray-400">/month</span>
            </div>
            <p className="text-accent-cyan text-sm mb-6">
              Save ${(PLANS.PREMIUM.price * 12 - PLANS.PREMIUM.yearlyPrice).toFixed(2)} with yearly
            </p>
            
            <ul className="space-y-3 mb-8">
              {PLANS.PREMIUM.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-5 h-5 text-accent-cyan flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="space-y-3">
              <button
                onClick={() => handleUpgrade('monthly')}
                className="w-full py-3 px-6 rounded-xl bg-accent-cyan text-black font-bold hover:bg-accent-cyan/90 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Upgrade Monthly
              </button>
              
              <button
                onClick={() => handleUpgrade('yearly')}
                className="w-full py-3 px-6 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                ${PLANS.PREMIUM.yearlyPrice}/year (Save 33%)
              </button>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ Secure payment via Stripe</span>
            <span>✓ Support indie developers</span>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
