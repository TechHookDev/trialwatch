'use client'

import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Chrome, Github } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const { signInWithGoogle, signInWithGitHub } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 md:p-12 max-w-md w-full text-center"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="TrialWatch"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">Welcome to TrialWatch</h1>
        <p className="text-gray-400 mb-8">
          Sign in to track your free trials and never pay for forgotten subscriptions again.
        </p>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            onClick={signInWithGitHub}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  )
}
