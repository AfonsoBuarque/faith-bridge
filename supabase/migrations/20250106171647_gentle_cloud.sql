/*
  # Fix Client Table Structure

  1. New Tables
    - Ensures cliente_fft table exists with proper structure
    - Only creates policies if they don't exist
*/

-- Create the cliente_fft table if it doesn't exist
CREATE TABLE IF NOT EXISTS cliente_fft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  CONSTRAINT cliente_fft_user_id_key UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE cliente_fft ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cliente_fft' AND policyname = 'Users can view own client status'
  ) THEN
    CREATE POLICY "Users can view own client status"
      ON cliente_fft
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cliente_fft' AND policyname = 'Users can insert own client status'
  ) THEN
    CREATE POLICY "Users can insert own client status"
      ON cliente_fft
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cliente_fft' AND policyname = 'Users can update own client status'
  ) THEN
    CREATE POLICY "Users can update own client status"
      ON cliente_fft
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;