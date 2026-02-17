import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'
    const origin = request.nextUrl.origin

    if (code) {
        // Create a response object that we can modify
        let response = NextResponse.redirect(`${origin}${next}`)

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Set cookie on the request for subsequent reads
                        request.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                        // Set cookie on the response to send to browser
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        request.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (!error) {
                return response
            } else {
                console.error('Exchange Error:', error)
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
            }
        } catch (err) {
            console.error('Unexpected Exchange Error:', err)
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
