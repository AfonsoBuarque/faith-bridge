-- Create children table
CREATE TABLE IF NOT EXISTS criancas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nome_completo text NOT NULL,
  data_nascimento date NOT NULL,
  genero text,
  foto_url text,
  
  -- Parent/Guardian Information
  responsavel_1_nome text NOT NULL,
  responsavel_1_parentesco text NOT NULL,
  responsavel_1_telefone text NOT NULL,
  responsavel_1_email text,
  
  responsavel_2_nome text,
  responsavel_2_parentesco text,
  responsavel_2_telefone text,
  responsavel_2_email text,
  
  -- Medical Information
  alergias text,
  medicamentos text,
  condicoes_especiais text,
  observacoes_medicas text,
  
  -- Church Information
  turma_id uuid,
  data_inicio date,
  ativo boolean DEFAULT true,
  observacoes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS turmas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nome text NOT NULL,
  faixa_etaria_min int NOT NULL,
  faixa_etaria_max int NOT NULL,
  professor_responsavel text NOT NULL,
  capacidade_maxima int,
  dia_semana text,
  horario text,
  sala text,
  descricao text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS presenca_criancas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  crianca_id uuid REFERENCES criancas(id) NOT NULL,
  turma_id uuid REFERENCES turmas(id) NOT NULL,
  data_aula date NOT NULL,
  presente boolean DEFAULT false,
  observacoes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE criancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE presenca_criancas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own children" ON criancas;
DROP POLICY IF EXISTS "Users can insert own children" ON criancas;
DROP POLICY IF EXISTS "Users can update own children" ON criancas;
DROP POLICY IF EXISTS "Users can view own classes" ON turmas;
DROP POLICY IF EXISTS "Users can manage own classes" ON turmas;
DROP POLICY IF EXISTS "Users can view own attendance" ON presenca_criancas;
DROP POLICY IF EXISTS "Users can manage own attendance" ON presenca_criancas;

-- Create policies for criancas
CREATE POLICY "Users can view own children"
  ON criancas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own children"
  ON criancas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children"
  ON criancas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for turmas
CREATE POLICY "Users can view own classes"
  ON turmas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own classes"
  ON turmas
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for presenca_criancas
CREATE POLICY "Users can view own attendance"
  ON presenca_criancas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own attendance"
  ON presenca_criancas
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for children photos if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('children-photos', 'children-photos', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public users can view children photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload children photos" ON storage.objects;

-- Create policies for children photos
CREATE POLICY "Public users can view children photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'children-photos');

CREATE POLICY "Users can upload children photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'children-photos' 
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