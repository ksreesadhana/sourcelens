-- SourceLens Analyses Table Schema
-- Run this in Supabase Dashboard > SQL Editor

-- Create analyses table
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  mode TEXT NOT NULL,
  scraped_title TEXT,
  scraped_text TEXT,
  brief_json JSONB,
  structured_json JSONB,
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to insert their own analyses
CREATE POLICY "Users can insert their own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own analyses
CREATE POLICY "Users can view their own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to delete their own analyses
CREATE POLICY "Users can delete their own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);
