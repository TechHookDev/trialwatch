import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxrynytyyftgkuueclnr.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cnlueXR5eWZ0Z2t1dWVjbG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzM5ODIsImV4cCI6MjA4NjYwOTk4Mn0.PUK9MvRu_x4MVFhUuigyKHwsI1L1do7TQeTuyBkUK24'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Using the SAME Supabase project as your mobile app - FREE forever!
