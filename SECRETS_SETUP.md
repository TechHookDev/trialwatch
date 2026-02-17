# How to Deploy Secrets (Environment Variables)

Your code is deployed automatically, but your **secrets** (API keys) are not. This is for security reasons.

## 1. Get the Supabase Service Role Key
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project (`trialwatch` / `TechHookDev`).
3.  Go to **Project Settings** (cog icon at bottom left).
4.  Click on **API**.
5.  Look for `Project API keys`.
6.  You will see `anon` (public) and `service_role` (secret).
7.  Click `Reveal` on **service_role** and copy it.
    > **⚠️ WARNING:** This key has full access to your database. Never share it or commit it to GitHub.

## 2. Add Keys to Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your project (`trialwatch`).
3.  Go to **Settings** > **Environment Variables**.
4.  Add the following keys:

| Key | Value |
| :--- | :--- |
| `RESEND_API_KEY` | *(Your Resend API Key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Paste the key you copied from Supabase)* |
| `NEXT_PUBLIC_SUPABASE_URL` | *(You can find this in Supabase > Settings > API > Project URL)* |


## 3. Configure Redirect URLs (Vital for OAuth)
For "Continue with Google" to work, Supabase must trust your Vercel URL.

1.  Go to **Supabase Dashboard** > **Authentication** > **URL Configuration**.
2.  Look at **Redirect URLs**.
3.  Click **Add URL** and enter: 
    *   `https://trialwatch-rebbahds-projects.vercel.app/auth/callback`
    *   *(Add any other domains you deploy to, e.g., `https://your-custom-domain.com/auth/callback`)*
4.  Click **Save**.

Without this, Google Login will fail or loop.

5.  **Redeploy:** Go to `Deployments` tab, click the three dots on the latest deployment, and select **Redeploy** for the changes to take effect.
