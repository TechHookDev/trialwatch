import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = request.nextUrl.origin

  console.log('Callback route hit:', { origin, hasCode: !!code })

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  // Create a simple Supabase client for this request
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Session exchange error:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    if (!data.session) {
      return NextResponse.redirect(`${origin}/login?error=no_session`)
    }

    // Manually set the auth cookies
    const response = NextResponse.redirect(`${origin}/dashboard`)
    
    // Set the access token cookie
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    // Set the refresh token cookie
    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log('Session exchange successful, redirecting to dashboard')
    return response
    
  } catch (err) {
    console.error('Unexpected error in callback:', err)
    return NextResponse.redirect(`${origin}/login?error=callback_failed`)
  }
}
