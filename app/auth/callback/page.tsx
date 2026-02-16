'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash or query params
        const hash = window.location.hash
        const query = window.location.search
        
        console.log('Auth callback received:', { hash, query })
        
        // Check for error in URL
        const urlParams = new URLSearchParams(query)
        const errorParam = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription)
          setError(`Authentication failed: ${errorDescription || errorParam}`)
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        // The session should be automatically set by Supabase
        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Failed to get session. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        if (session) {
          console.log('Session found, redirecting to dashboard')
          router.push('/dashboard')
        } else {
          // Wait a bit and check again (Supabase might still be processing)
          console.log('No session yet, waiting...')
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession()
            if (retrySession) {
              router.push('/dashboard')
            } else {
              setError('Authentication timeout. Please try again.')
              setTimeout(() => router.push('/login'), 3000)
            }
          }, 2000)
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('An unexpected error occurred.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
        <div className="text-center glass rounded-2xl p-8 max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-accent-red mb-2">Authentication Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan mx-auto mb-4"></div>
        <p className="text-gray-400">Completing sign in...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account</p>
      </div>
    </div>
  )
}
