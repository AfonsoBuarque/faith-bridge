/*
  # Create Cliente FFT table

  1. New Tables
    - `cliente_fft`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `status` (text)
  
  2. Security
    - Enable RLS on `cliente_fft` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS cliente_fft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  CONSTRAINT cliente_fft_user_id_key UNIQUE (user_id)
);

ALTER TABLE cliente_fft ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own client status"
  ON cliente_fft
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own client status"
  ON cliente_fft
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own client status"
  ON cliente_fft
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);