/*
  # Add Departments Management

  1. New Tables
    - `departamentos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `nome` (text)
      - `responsavel_id` (uuid, references membros)
      - `responsavel_2_id` (uuid, references membros)
      - `email` (text)
      - `telefone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `departamentos` table
    - Add policies for authenticated users
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nome text NOT NULL,
  responsavel_id uuid REFERENCES membros(id),
  responsavel_2_id uuid REFERENCES membros(id),
  email text,
  telefone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own departments"
  ON departamentos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own departments"
  ON departamentos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own departments"
  ON departamentos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own departments"
  ON departamentos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);