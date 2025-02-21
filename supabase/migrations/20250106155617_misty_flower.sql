/*
  # Create church data table

  1. New Tables
    - `dados_igreja`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `nome_igreja` (text)
      - `razao_social` (text)
      - `responsavel` (text) 
      - `quantidade_membros` (integer)
      - `telefone` (text)
      - `whatsapp` (text)
      - `email` (text)
      - `endereco_completo` (text)
      - `rede_social` (text)
      - `como_conheceu` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `dados_igreja` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS dados_igreja (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nome_igreja text NOT NULL,
  razao_social text,
  responsavel text NOT NULL,
  quantidade_membros integer,
  telefone text,
  whatsapp text,
  email text,
  endereco_completo text NOT NULL,
  rede_social text,
  como_conheceu text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT dados_igreja_user_id_key UNIQUE (user_id)
);

ALTER TABLE dados_igreja ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own church data"
  ON dados_igreja
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own church data"
  ON dados_igreja
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own church data"
  ON dados_igreja
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);