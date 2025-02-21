/*
  # Create Visitor Registration System

  1. New Tables
    - `cadastro_visitantes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `nome` (text)
      - `email` (text)
      - `telefone` (text)
      - `whatsapp` (text)
      - `endereco` (text)
      - `bairro` (text)
      - `cidade` (text)
      - `estado` (text)
      - `data_nascimento` (date)
      - `estado_civil` (text)
      - `profissao` (text)
      - `como_conheceu` (text)
      - `observacoes` (text)
      - `data_visita` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `cadastro_visitantes` table
    - Add policies for authenticated users to manage their visitors
*/

-- Create the visitors table
CREATE TABLE IF NOT EXISTS cadastro_visitantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nome text NOT NULL,
  email text,
  telefone text,
  whatsapp text,
  endereco text,
  bairro text,
  cidade text,
  estado text,
  data_nascimento date,
  estado_civil text,
  profissao text,
  como_conheceu text,
  observacoes text,
  data_visita timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cadastro_visitantes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for authenticated users" ON cadastro_visitantes
  FOR SELECT TO authenticated
  USING (auth.uid() = cadastro_visitantes.user_id);

CREATE POLICY "Enable insert for authenticated users" ON cadastro_visitantes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = cadastro_visitantes.user_id);

CREATE POLICY "Enable update for authenticated users" ON cadastro_visitantes
  FOR UPDATE TO authenticated
  USING (auth.uid() = cadastro_visitantes.user_id)
  WITH CHECK (auth.uid() = cadastro_visitantes.user_id);

CREATE POLICY "Enable delete for authenticated users" ON cadastro_visitantes
  FOR DELETE TO authenticated
  USING (auth.uid() = cadastro_visitantes.user_id);