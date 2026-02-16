-- Supabase Database Schema for TrialWatch
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
alter table if exists trials enable row level security;

-- Drop existing table if it exists
drop table if exists trials;

-- Create trials table
CREATE TABLE trials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service_url TEXT,
  monthly_cost DECIMAL(10, 2),
  trial_days INTEGER DEFAULT 30,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own trials" 
  ON trials FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own trials" 
  ON trials FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own trials" 
  ON trials FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own trials" 
  ON trials FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_trials_user_id ON trials(user_id);
CREATE INDEX idx_trials_status ON trials(status);
CREATE INDEX idx_trials_end_date ON trials(end_date);

-- Enable realtime
alter publication supabase_realtime add table trials;

-- Create user_profiles table for premium status
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  is_premium BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'premium_yearly')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create notifications table for reminders
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trial_id UUID REFERENCES trials(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('7d', '3d', '1d', '1h', 'expired')),
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  push_sent BOOLEAN DEFAULT false,
  push_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Create revenue tracking table for affiliate clicks
CREATE TABLE revenue_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trial_id UUID,
  service_name TEXT,
  event_type TEXT CHECK (event_type IN ('affiliate_click', 'premium_signup', 'premium_renewal')),
  amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_trial_id ON notifications(trial_id);
CREATE INDEX idx_revenue_events_user_id ON revenue_events(user_id);
CREATE INDEX idx_revenue_events_created_at ON revenue_events(created_at);

-- Add to realtime
alter publication supabase_realtime add table user_profiles;
alter publication supabase_realtime add table notifications;
