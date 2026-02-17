import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ClientProviders from './components/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrialWatch - Never Pay for Forgotten Trials Again',
  description: 'Discover the best free trials and track them all in one place. Get alerts before you get charged. Save $240+ per year.',
  keywords: 'free trials, subscription tracker, trial reminder, save money, Netflix trial, Spotify trial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  )
}
