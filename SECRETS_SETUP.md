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
| `RESEND_API_KEY` | `re_8tckoE5C_5wNeYeijaGxorKHrvc3mZ26U` |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Paste the key you copied from Supabase)* |
| `NEXT_PUBLIC_SUPABASE_URL` | *(You can find this in Supabase > Settings > API > Project URL)* |

5.  **Redeploy:** Go to `Deployments` tab, click the three dots on the latest deployment, and select **Redeploy** for the changes to take effect.
