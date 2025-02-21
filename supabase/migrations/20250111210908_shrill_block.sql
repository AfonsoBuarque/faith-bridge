/*
  # Create members table and storage

  1. New Tables
    - `membros`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `igreja_id` (uuid, references dados_igreja)
      - All personal and ecclesiastical information fields
      - Timestamps

  2. Storage
    - Create bucket for member photos
    - Set up appropriate policies

  3. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Create members table
CREATE TABLE IF NOT EXISTS membros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  igreja_id uuid REFERENCES dados_igreja(user_id),
  foto_url text,
  
  -- Informações Pessoais
  nome_completo text NOT NULL,
  data_nascimento date,
  rg text,
  cpf text,
  estado_civil text,
  profissao text,
  email text,
  telefone text,
  celular text,
  endereco text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  cep text,
  
  -- Informações Eclesiásticas
  data_conversao date,
  data_batismo date,
  data_membro date,
  cargo_ministerial text,
  departamento text,
  dizimista boolean DEFAULT false,
  observacoes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own members"
  ON membros
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own members"
  ON membros
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own members"
  ON membros
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own members"
  ON membros
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for member photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public users can view member photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'member-photos');

CREATE POLICY "Authenticated users can upload member photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'member-photos' 
    AND (CASE 
      WHEN metadata->>'content-type' = 'image/png' THEN true
      WHEN metadata->>'content-type' = 'image/jpeg' THEN true
      WHEN metadata->>'content-type' = 'image/jpg' THEN true
      ELSE false
    END)
    AND (CASE 
      WHEN metadata->>'size' IS NOT NULL 
      THEN (metadata->>'size')::int <= 2097152 -- 2MB
      ELSE false
    END)
  );

CREATE POLICY "Users can manage own member photos"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'member-photos')
  WITH CHECK (bucket_id = 'member-photos');