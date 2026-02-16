'use client'

import { motion } from 'framer-motion'
import { Clock, DollarSign, Star, ExternalLink, Check } from 'lucide-react'
import { Trial } from '@/data/trials'

interface TrialCardProps {
  trial: Trial
  index: number
}

export default function TrialCard({ trial, index }: TrialCardProps) {
  const handleStartTrial = () => {
    window.open(trial.signupUrl, '_blank', 'noopener,noreferrer')
  }

  // Format trial days text
  const getTrialText = () => {
    if (trial.trialDays === 0) return 'No free trial'
    if (trial.trialDays === 365) return '12 months free'
    return `${trial.trialDays} days free`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl overflow-hidden group flex flex-col h-full"
    >
      {/* Header with color */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: trial.color }}
      />
      
      <div className="p-6 flex-1 flex flex-col">
        {/* Header Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: trial.color }}
            >
              {trial.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{trial.name}</h3>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{trial.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-accent-amber/10 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-accent-amber text-accent-amber" />
            <span className="text-sm font-semibold text-accent-amber">{trial.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trial.description}</p>

        {/* Features */}
        <div className="flex-1">
          <ul className="space-y-1.5 mb-4">
            {trial.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                <Check className="w-3 h-3 text-accent-cyan mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{getTrialText()}</span>
          </div>
          {trial.monthlyPrice > 0 && (
            <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-2 py-1 rounded-lg">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${trial.monthlyPrice}/mo</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleStartTrial}
          className="w-full py-3 bg-white/5 hover:bg-gradient-to-r hover:from-accent-cyan/20 hover:to-accent-purple/20 border border-white/10 hover:border-accent-cyan/50 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-accent-cyan/20"
        >
          {trial.trialDays > 0 ? 'Start Free Trial' : 'Learn More'}
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
