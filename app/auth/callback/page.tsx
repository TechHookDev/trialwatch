'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const error_description = searchParams.get('error_description')

      if (error) {
        console.error('Auth error:', error, error_description)
        router.push(`/login?error=${encodeURIComponent(error_description || error)}`)
        return
      }

      if (code) {
        try {
          const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          if (sessionError) {
            console.error('Session error:', sessionError)
            router.push(`/login?error=${encodeURIComponent(sessionError.message)}`)
            return
          }
          router.refresh()
          router.push('/dashboard')
        } catch (err) {
          console.error('Unexpected error:', err)
          router.push('/login?error=unexpected_error')
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      }
    }

    handleCallback()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-white mb-2">Verifying...</h2>
        <p className="text-gray-400">Securely logging you in.</p>
      </div>
    </div>
  )
}
