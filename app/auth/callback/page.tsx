'use client'

import { Suspense } from 'react'
import AuthCallbackContent from './AuthCallbackContent'

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-xl font-bold text-white mb-2">Loading...</h2>
                    <p className="text-gray-400">Please wait.</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    )
}
