// Alternative: Use Gmail SMTP for 100% FREE (but limited to 500 emails/day)
// This uses Deno's built-in SMTP capabilities

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const GMAIL_USER = Deno.env.get('GMAIL_USER') // your-email@gmail.com
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD') // App password from Google

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  try {
    const client = new SmtpClient()
    
    // Connect to Gmail
    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_APP_PASSWORD,
    })

    // Get trials needing reminders (same logic as other function)
    const now = new Date()
    const { data: trials } = await supabase
      .from('trials')
      .select('*')
      .eq('status', 'active')
      .lte('end_date', new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString())
      .gte('end_date', now.toISOString())

    for (const trial of trials) {
      await client.send({
        from: GMAIL_USER,
        to: trial.user_email,
        subject: `Trial Reminder: ${trial.name} expires soon!`,
        content: `Your ${trial.name} trial expires on ${trial.end_date}. Cancel here: ${trial.service_url}`,
      })
    }

    await client.close()

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

/*
GMAIL SETUP:
1. Enable 2-Factor Authentication on your Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use that 16-character password as GMAIL_APP_PASSWORD
4. Set GMAIL_USER to your full email address

LIMITS:
- 500 emails/day max
- Might go to spam more often
- Google can block if too many bounces

RECOMMENDATION: Use Resend for production, Gmail only for testing!
*/
