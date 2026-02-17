'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClientComponentClient()
    const [status, setStatus] = useState('Initializing...')
    const [debugInfo, setDebugInfo] = useState<any>({})

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code')
            const error = searchParams.get('error')
            const error_description = searchParams.get('error_description')

            setDebugInfo({ code: !!code, error, error_description })

            if (error) {
                setStatus(`Error: ${error_description || error}`)
                return
            }

            if (code) {
                setStatus('Exchanging code for session...')
                try {
                    const { error: sessionError, data } = await supabase.auth.exchangeCodeForSession(code)
                    if (sessionError) {
                        setStatus(`Session Exchange Failed: ${sessionError.message}`)
                        console.error('Session error:', sessionError)
                        return
                    }

                    setStatus('Session created! Redirecting...')
                    console.log('Session success:', data)

                    router.refresh()
                    setTimeout(() => router.push('/dashboard'), 1000)
                } catch (err: any) {
                    setStatus(`Unexpected Error: ${err.message || err}`)
                }
            } else {
                setStatus('No code found. Checking existing session...')
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    setStatus('Session found. Redirecting...')
                    setTimeout(() => router.push('/dashboard'), 1000)
                } else {
                    setStatus('No session found. Please log in.')
                    setTimeout(() => router.push('/login'), 2000)
                }
            }
        }

        handleCallback()
    }, [router, searchParams, supabase])

    return (
        <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">Auth Debugger</h2>

            <div className="p-4 bg-black/30 rounded-lg mb-4 font-mono text-sm break-all">
                <p className="text-gray-400 mb-2">Status:</p>
                <p className={status.includes('Error') || status.includes('Failed') ? 'text-red-400' : 'text-green-400'}>
                    {status}
                </p>
            </div>

            <details className="mb-4 text-xs text-gray-500">
                <summary>Debug Info</summary>
                <pre className="mt-2 p-2 bg-black rounded">
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </details>

            <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-2 bg-accent-cyan text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
                Force Go to Dashboard
            </button>

            <button
                onClick={() => router.push('/login')}
                className="w-full mt-2 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
            >
                Back to Login
            </button>
        </div>
    )
}

export default function AuthCallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1321] text-white p-4">
            <Suspense fallback={
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-400">Loading auth...</p>
                </div>
            }>
                <CallbackContent />
            </Suspense>
        </div>
    )
}
