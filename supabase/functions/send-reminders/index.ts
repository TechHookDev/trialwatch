// Send trial reminder emails
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

const reminderTemplates = {
  '7d': {
    subject: 'Your {service} trial ends in 7 days',
    body: `Hey there!

Your {service} free trial ends in 7 days ({endDate}).

Monthly cost: ${monthlyCost}
Don't forget to cancel if you don't want to be charged!

Cancel here: {cancellationUrl}

Best,
TrialWatch Team`,
  },
  '3d': {
    subject: '⚠️ 3 days left on your {service} trial',
    body: `Hey there!

Only 3 days left on your {service} trial!

Ends: {endDate}
Monthly cost: ${monthlyCost}

Don't get charged unexpectedly. Cancel here: {cancellationUrl}

Best,
TrialWatch Team`,
  },
  '1d': {
    subject: '🚨 URGENT: Your {service} trial ends tomorrow!',
    body: `Hey!

Your {service} trial ENDS TOMORROW ({endDate})!

You will be charged ${monthlyCost}/month if you don't cancel now.

CANCEL IMMEDIATELY: {cancellationUrl}

TrialWatch Team`,
  },
  '1h': {
    subject: '🔴 FINAL WARNING: {service} trial expires in 1 hour!',
    body: `URGENT!

Your {service} trial expires in 1 HOUR!

Time: {endDate}
Charge amount: ${monthlyCost}/month

CANCEL RIGHT NOW: {cancellationUrl}

This is your final warning!

TrialWatch Team`,
  },
}

serve(async (req) => {
  try {
    // Get all active trials that need reminders
    const now = new Date()
    const reminderWindows = [
      { type: '7d', hours: 24 * 7 },
      { type: '3d', hours: 24 * 3 },
      { type: '1d', hours: 24 },
      { type: '1h', hours: 1 },
    ]

    const sentReminders = []

    for (const window of reminderWindows) {
      // Calculate time window
      const windowStart = new Date(now.getTime() + (window.hours - 0.5) * 60 * 60 * 1000)
      const windowEnd = new Date(now.getTime() + (window.hours + 0.5) * 60 * 60 * 1000)

      // Get trials in this window
      const { data: trials, error: trialsError } = await supabase
        .from('trials')
        .select(`
          id,
          name,
          end_date,
          monthly_cost,
          service_url,
          user_id,
          user_profiles (email)
        `)
        .eq('status', 'active')
        .gte('end_date', windowStart.toISOString())
        .lte('end_date', windowEnd.toISOString())

      if (trialsError) throw trialsError

      if (!trials || trials.length === 0) continue

      for (const trial of trials) {
        // Check if reminder already sent
        const { data: existingReminder } = await supabase
          .from('notifications')
          .select('*')
          .eq('trial_id', trial.id)
          .eq('type', window.type)
          .eq('email_sent', true)
          .single()

        if (existingReminder) continue // Already sent

        // Get user email
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('id', trial.user_id)
          .single()

        if (userError || !userData?.email) continue

        // Send email via Resend
        const template = reminderTemplates[window.type as keyof typeof reminderTemplates]
        const formattedBody = template.body
          .replace('{service}', trial.name)
          .replace('{endDate}', new Date(trial.end_date).toLocaleDateString())
          .replace('{monthlyCost}', trial.monthly_cost || '0')
          .replace('{cancellationUrl}', trial.service_url || '#')

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'TrialWatch <reminders@trialwatch.app>',
            to: userData.email,
            subject: template.subject.replace('{service}', trial.name),
            text: formattedBody,
          }),
        })

        if (res.ok) {
          // Record that we sent this reminder
          await supabase.from('notifications').insert({
            user_id: trial.user_id,
            trial_id: trial.id,
            type: window.type,
            email_sent: true,
            email_sent_at: new Date().toISOString(),
          })

          sentReminders.push({
            trial: trial.name,
            user: userData.email,
            type: window.type,
          })
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentReminders.length,
        reminders: sentReminders,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
