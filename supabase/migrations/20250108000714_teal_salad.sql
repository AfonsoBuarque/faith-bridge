/*
  # Add church logo support
  
  1. New Tables
    - `church_logos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `logo_url` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS church_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  logo_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT church_logos_user_id_key UNIQUE (user_id)
);

ALTER TABLE church_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logo"
  ON church_logos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logo"
  ON church_logos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logo"
  ON church_logos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);