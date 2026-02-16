// Premium subscription configuration
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    trialLimit: 3,
    features: [
      'Track up to 3 trials',
      'Basic email reminders (24h before expiry)',
      'Manual trial tracking',
      'Community support'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: 4.99,
    yearlyPrice: 39.99,
    trialLimit: Infinity,
    features: [
      'Unlimited trial tracking',
      'Advanced reminders (7d, 3d, 1d, 1h before expiry)',
      'Email + Push notifications',
      'Calendar integration (Google/Apple)',
      'Expense tracking dashboard',
      'Priority support',
      'Early access to new features'
    ]
  }
}

// Affiliate tracking configuration
export const AFFILIATE_LINKS = {
  // Add your affiliate IDs here
  'spotify': 'https://www.spotify.com/premium/?ref=trialwatch',
  'nordvpn': 'https://nordvpn.com/?ref=trialwatch',
  'expressvpn': 'https://www.expressvpn.com/order?ref=trialwatch',
  'skillshare': 'https://www.skillshare.com/?ref=trialwatch',
  // ... add more as you get affiliate partnerships
}

// Revenue tracking
export interface RevenueEvent {
  id: string
  userId: string
  trialId: string
  serviceName: string
  type: 'affiliate_click' | 'premium_signup' | 'premium_renewal'
  amount: number
  createdAt: string
}
