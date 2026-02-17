// Auto-import trials from Gmail
// Uses Gmail API to scan for subscription confirmations

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID')
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

// Keywords that indicate a trial signup
const trialKeywords = [
  'trial', 'free trial', 'start your free', 'trial period', 'trial subscription',
  'welcome to', 'subscription confirmed', 'you\'re all set', 'activation complete',
  'premium activated', 'membership confirmed', 'account created'
]

// Service patterns to extract
const servicePatterns = [
  { name: 'Netflix', patterns: ['netflix.com', 'Netflix Membership'] },
  { name: 'Spotify', patterns: ['spotify.com', 'Spotify Premium'] },
  { name: 'Disney+', patterns: ['disneyplus.com', 'Disney+'] },
  { name: 'Amazon Prime', patterns: ['amazon.com/prime', 'Prime Membership'] },
  { name: 'Hulu', patterns: ['hulu.com', 'Hulu Subscription'] },
  { name: 'Apple TV+', patterns: ['tv.apple.com', 'Apple TV+'] },
  { name: 'Paramount+', patterns: ['paramountplus.com', 'Paramount+'] },
  { name: 'HBO Max', patterns: ['hbomax.com', 'HBO Max'] },
  { name: 'YouTube Premium', patterns: ['youtube.com/premium', 'YouTube Premium'] },
  { name: 'Adobe', patterns: ['adobe.com', 'Creative Cloud'] },
  { name: 'Canva', patterns: ['canva.com', 'Canva Pro'] },
  { name: 'Notion', patterns: ['notion.so', 'Notion'] },
  { name: 'Figma', patterns: ['figma.com', 'Figma'] },
  { name: 'Grammarly', patterns: ['grammarly.com', 'Grammarly'] },
  { name: 'LinkedIn', patterns: ['linkedin.com', 'LinkedIn Premium'] },
  { name: 'Coursera', patterns: ['coursera.org', 'Coursera Plus'] },
  { name: 'Duolingo', patterns: ['duolingo.com', 'Duolingo Plus'] },
  { name: 'Headspace', patterns: ['headspace.com', 'Headspace'] },
  { name: 'Calm', patterns: ['calm.com', 'Calm'] },
  { name: 'Peloton', patterns: ['onepeloton.com', 'Peloton'] },
  { name: 'Strava', patterns: ['strava.com', 'Strava'] },
  { name: 'NordVPN', patterns: ['nordvpn.com', 'NordVPN'] },
  { name: 'ExpressVPN', patterns: ['expressvpn.com', 'ExpressVPN'] },
  { name: '1Password', patterns: ['1password.com', '1Password'] },
  { name: 'LastPass', patterns: ['lastpass.com', 'LastPass'] },
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, access_token } = await req.json()
    
    if (!user_id || !access_token) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id or access_token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch recent emails from Gmail
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:(trial OR subscription OR welcome OR confirmed) newer_than:7d&maxResults=50',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`)
    }

    const data = await response.json()
    const importedTrials: string[] = []

    // Process each email
    for (const message of data.messages || []) {
      const emailDetails = await fetchEmailDetails(message.id, access_token)
      
      if (emailDetails && isTrialConfirmation(emailDetails)) {
        const trialInfo = extractTrialInfo(emailDetails)
        
        if (trialInfo) {
          // Check if trial already exists
          const { data: existing } = await supabase
            .from('trials')
            .select('id')
            .eq('user_id', user_id)
            .eq('name', trialInfo.name)
            .single()

          if (!existing) {
            // Create trial
            await supabase.from('trials').insert({
              user_id,
              name: trialInfo.name,
              service_url: trialInfo.url,
              monthly_cost: trialInfo.monthlyCost,
              trial_days: trialInfo.trialDays,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + trialInfo.trialDays * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
            })

            importedTrials.push(trialInfo.name)
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imported: importedTrials.length,
        trials: importedTrials
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function fetchEmailDetails(messageId: string, access_token: string) {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    }
  )

  if (!response.ok) return null
  return await response.json()
}

function isTrialConfirmation(email: any): boolean {
  const subject = email.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || ''
  const snippet = email.snippet || ''
  const text = (subject + ' ' + snippet).toLowerCase()

  return trialKeywords.some(keyword => text.includes(keyword.toLowerCase()))
}

function extractTrialInfo(email: any): { name: string, url: string, monthlyCost: number, trialDays: number } | null {
  const subject = email.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || ''
  const body = extractBody(email.payload)
  const fullText = subject + ' ' + body

  // Find matching service
  for (const service of servicePatterns) {
    if (service.patterns.some(pattern => fullText.toLowerCase().includes(pattern.toLowerCase()))) {
      // Extract trial duration
      let trialDays = 30 // default
      const durationMatch = fullText.match(/(\d+)\s*(day|days)/i)
      if (durationMatch) {
        trialDays = parseInt(durationMatch[1])
      }

      // Extract monthly cost
      let monthlyCost = 0
      const costMatch = fullText.match(/\$([\d.]+)\s*(per|\/)\s*month/i)
      if (costMatch) {
        monthlyCost = parseFloat(costMatch[1])
      }

      return {
        name: service.name,
        url: `https://${service.patterns[0]}`,
        monthlyCost,
        trialDays
      }
    }
  }

  return null
}

function extractBody(payload: any): string {
  if (!payload) return ''
  
  if (payload.body && payload.body.data) {
    return atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'))
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        return atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))
      }
    }
  }

  return ''
}
