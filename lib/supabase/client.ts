import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                flowType: 'pkce',
            },
            cookieOptions: {
                name: 'sb-auth-token',
                domain: window.location.hostname,
                path: '/',
                sameSite: 'lax',
                secure: window.location.protocol === 'https:',
            },
        }
    )
}
