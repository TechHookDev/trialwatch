# Free Email Notifications Setup Guide

## 1. Sign up for Resend (FREE - 3,000 emails/month)

1. Go to https://resend.com
2. Sign up for free account
3. Verify your domain OR use Resend's test domain
4. Get your API key from Dashboard > API Keys

## 2. Deploy Edge Function to Supabase

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the edge function
supabase functions deploy send-reminders
```

## 3. Set Environment Variables in Supabase

Go to Supabase Dashboard > Settings > API:

Add these secrets:
- `RESEND_API_KEY` - Your Resend API key
- `SUPABASE_URL` - Your Supabase URL (already there)
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (already there)

## 4. Schedule the Function (Cron Job)

Run this SQL in Supabase SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule reminders to run every hour
SELECT cron.schedule(
  'send-trial-reminders',  -- name of the cron job
  '0 * * * *',            -- every hour at minute 0
  $$ 
    SELECT net.http_get(
      url:='https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-reminders',
      headers:='{"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}'::jsonb
    );
  $$
);
```

Replace:
- `YOUR_PROJECT_ID` with your Supabase project ID
- `YOUR_ANON_KEY` with your anon/public key

## 5. Test the Function

You can manually trigger it via curl:

```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-reminders \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## 6. Monitor in Supabase Dashboard

Go to Edge Functions > Logs to see:
- How many emails sent
- Any errors
- Which reminders triggered

## Email Templates

The function sends 4 types of reminders:
- **7 days before** - Friendly heads up
- **3 days before** - Warning
- **1 day before** - URGENT
- **1 hour before** - FINAL WARNING

All emails include:
- Service name
- End date
- Monthly cost
- Cancellation link

## Free Tier Limits

**Resend Free:**
- 3,000 emails/month
- 100 emails/day
- Perfect for testing and small user base

**If you exceed 3,000/month:**
- $0.0009 per email (very cheap)
- Or upgrade to SendGrid (100 emails/day free)

## Testing

1. Add a trial ending in 7 days
2. Wait for the cron job to run (or manually trigger)
3. Check your email!

## Troubleshooting

**Emails not sending?**
1. Check Resend dashboard for "Sending > Domain" - verify your domain
2. Check Supabase edge function logs
3. Verify environment variables are set
4. Check spam folder

**Cron job not running?**
1. Make sure pg_cron extension is enabled
2. Check cron job with: `SELECT * FROM cron.job;`
3. Verify the HTTP URL is correct

## Revenue Impact

With reminders:
- Users don't get charged = TRUST
- They remember to use your affiliate links = MORE MONEY
- They upgrade to Premium for better reminders = MORE MONEY

Estimated: **50% reduction in forgotten trials = happier users = more referrals**
