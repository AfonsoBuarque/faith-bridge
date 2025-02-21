/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `birth_date` (date)
      - `gender` (text)
      - `marital_status` (text)
      - `cpf` (text)
      - `rg` (text)
      - `email` (text)
      - `phone` (text)
      - `mobile` (text)
      - `whatsapp` (text)
      - `street` (text)
      - `number` (text)
      - `complement` (text)
      - `neighborhood` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own profile
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text,
  birth_date date,
  gender text,
  marital_status text,
  cpf text UNIQUE,
  rg text,
  email text,
  phone text,
  mobile text,
  whatsapp text,
  street text,
  number text,
  complement text,
  neighborhood text,
  city text,
  state text,
  zip_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);