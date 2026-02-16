'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Chrome, Github, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (!formData.name) {
          setError('Please enter your name')
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        await signUpWithEmail(formData.email, formData.password, formData.name)
      } else {
        await signInWithEmail(formData.email, formData.password)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0D1321] via-[#1A1F3A] to-[#0D1321] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 md:p-12 max-w-md w-full"
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

        <h1 className="text-3xl font-bold mb-2 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          {isSignUp 
            ? 'Sign up to start tracking your free trials' 
            : 'Sign in to continue tracking your trials'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/30 rounded-xl text-accent-red text-sm">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <button
            onClick={signInWithGitHub}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1A1F3A] text-gray-400">or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white placeholder-gray-500"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isSignUp ? 'Create a password (6+ chars)' : 'Enter your password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-accent-cyan/50 text-white placeholder-gray-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-bold text-lg text-black shadow-lg shadow-accent-cyan/30 hover:shadow-accent-cyan/50 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Sign In/Up */}
        <p className="mt-6 text-center text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-accent-cyan hover:underline font-semibold"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <p className="mt-8 text-sm text-gray-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  )
}
