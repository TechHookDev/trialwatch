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
