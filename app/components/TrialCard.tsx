'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, Star, ExternalLink } from 'lucide-react'

interface Trial {
  id: string
  name: string
  category: string
  trialDays: number
  monthlyPrice: number
  rating: number
  description: string
  color: string
  affiliateUrl: string
}

interface TrialCardProps {
  trial: Trial
  index: number
}

export default function TrialCard({ trial, index }: TrialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-6 glass-hover cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: trial.color }}
          >
            {trial.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg">{trial.name}</h3>
            <span className="text-sm text-gray-400">{trial.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-accent-amber">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">{trial.rating}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4">{trial.description}</p>

      {/* Details */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-300">
          <Clock className="w-4 h-4" />
          <span>{trial.trialDays} days free</span>
        </div>
        <div className="flex items-center gap-1 text-gray-300">
          <DollarSign className="w-4 h-4" />
          <span>${trial.monthlyPrice}/mo after</span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-cyan/50 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group-hover:bg-gradient-to-r group-hover:from-accent-cyan/20 group-hover:to-accent-purple/20">
        Start Free Trial
        <ExternalLink className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
