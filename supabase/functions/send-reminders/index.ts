import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get all active trials that need reminders
    const now = new Date()
    const sentReminders: string[] = []

    // Check 7 days
    const sevenDaysWindow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    await checkAndSendReminders(sevenDaysWindow, '7d', sentReminders)

    // Check 3 days
    const threeDaysWindow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    await checkAndSendReminders(threeDaysWindow, '3d', sentReminders)

    // Check 1 day
    const oneDayWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    await checkAndSendReminders(oneDayWindow, '1d', sentReminders)

    // Check 1 hour
    const oneHourWindow = new Date(now.getTime() + 60 * 60 * 1000)
    await checkAndSendReminders(oneHourWindow, '1h', sentReminders)

    return new Response(
      JSON.stringify({ success: true, sent: sentReminders.length, reminders: sentReminders }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function checkAndSendReminders(targetTime: Date, type: string, sentList: string[]) {
  const windowStart = new Date(targetTime.getTime() - 30 * 60 * 1000) // 30 min before
  const windowEnd = new Date(targetTime.getTime() + 30 * 60 * 1000) // 30 min after

  const { data: trials } = await supabase
    .from('trials')
    .select(`
      id,
      name,
      end_date,
      monthly_cost,
      service_url,
      user_id
    `)
    .eq('status', 'active')
    .gte('end_date', windowStart.toISOString())
    .lte('end_date', windowEnd.toISOString())

  if (!trials || trials.length === 0) return

  for (const trial of trials) {
    // Check if already sent
    const { data: existing } = await supabase
      .from('notifications')
      .select('*')
      .eq('trial_id', trial.id)
      .eq('type', type)
      .eq('email_sent', true)
      .single()

    if (existing) continue

    // Get user email
    const { data: user } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', trial.user_id)
      .single()

    if (!user?.email) continue

    // Send email
    const subject = getSubject(type, trial.name)
    const body = getBody(type, trial)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TrialWatch <reminders@trialwatch.app>',
        to: user.email,
        subject,
        text: body,
      }),
    })

    if (res.ok) {
      await supabase.from('notifications').insert({
        user_id: trial.user_id,
        trial_id: trial.id,
        type,
        email_sent: true,
        email_sent_at: new Date().toISOString(),
      })

      sentList.push(`${trial.name} - ${type}`)
    }
  }
}

function getSubject(type: string, serviceName: string): string {
  const subjects: Record<string, string> = {
    '7d': `Your ${serviceName} trial ends in 7 days`,
    '3d': `⚠️ 3 days left on your ${serviceName} trial`,
    '1d': `🚨 URGENT: ${serviceName} trial ends tomorrow!`,
    '1h': `🔴 FINAL WARNING: ${serviceName} expires in 1 hour!`,
  }
  return subjects[type] || `Trial reminder: ${serviceName}`
}

function getBody(type: string, trial: any): string {
  const endDate = new Date(trial.end_date).toLocaleDateString()
  const cost = trial.monthly_cost || '0'
  const cancelUrl = trial.service_url || '#'

  const bodies: Record<string, string> = {
    '7d': `Hey there!

Your ${trial.name} free trial ends in 7 days (${endDate}).

Monthly cost: $${cost}
Don't forget to cancel if you don't want to be charged!

Cancel here: ${cancelUrl}

Best,
TrialWatch Team`,

    '3d': `Hey there!

Only 3 days left on your ${trial.name} trial!

Ends: ${endDate}
Monthly cost: $${cost}

Don't get charged unexpectedly. Cancel here: ${cancelUrl}

Best,
TrialWatch Team`,

    '1d': `Hey!

Your ${trial.name} trial ENDS TOMORROW (${endDate})!

You will be charged $${cost}/month if you don't cancel now.

CANCEL IMMEDIATELY: ${cancelUrl}

TrialWatch Team`,

    '1h': `URGENT!

Your ${trial.name} trial expires in 1 HOUR!

Time: ${endDate}
Charge amount: $${cost}/month

CANCEL RIGHT NOW: ${cancelUrl}

This is your final warning!

TrialWatch Team`,
  }

  return bodies[type] || `Reminder: Your ${trial.name} trial ends ${endDate}. Cancel: ${cancelUrl}`
}
