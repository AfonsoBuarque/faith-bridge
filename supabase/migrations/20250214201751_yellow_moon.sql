/*
  # Criar estrutura para Pequenos Grupos

  1. Novas Tabelas
    - `pequenos_grupos`: Armazena informações dos pequenos grupos
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência para auth.users)
      - `nome` (text)
      - `lider` (uuid, referência para membros)
      - `endereco` (text)
      - `dia_reuniao` (text)
      - `horario` (text)
      - `capacidade_maxima` (integer)
      - `descricao` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `membros_pequenos_grupos`: Tabela de relacionamento entre membros e grupos
      - `id` (uuid, primary key)
      - `grupo_id` (uuid, referência para pequenos_grupos)
      - `membro_id` (uuid, referência para membros)
      - `funcao` (text)
      - `data_entrada` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS em todas as tabelas
    - Políticas de acesso para usuários autenticados
*/

-- Criar tabela de pequenos grupos
CREATE TABLE pequenos_grupos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  nome text NOT NULL,
  lider uuid REFERENCES membros(id),
  endereco text NOT NULL,
  dia_reuniao text NOT NULL,
  horario text NOT NULL,
  capacidade_maxima integer,
  descricao text,
  status text DEFAULT 'ativo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de relacionamento membros-grupos
CREATE TABLE membros_pequenos_grupos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id uuid REFERENCES pequenos_grupos(id) ON DELETE CASCADE,
  membro_id uuid REFERENCES membros(id) ON DELETE CASCADE,
  funcao text DEFAULT 'membro',
  data_entrada timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(grupo_id, membro_id)
);

-- Habilitar RLS
ALTER TABLE pequenos_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros_pequenos_grupos ENABLE ROW LEVEL SECURITY;

-- Políticas para pequenos_grupos
CREATE POLICY "Usuários podem visualizar seus próprios grupos"
  ON pequenos_grupos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios grupos"
  ON pequenos_grupos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios grupos"
  ON pequenos_grupos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios grupos"
  ON pequenos_grupos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para membros_pequenos_grupos
CREATE POLICY "Usuários podem visualizar membros dos seus grupos"
  ON membros_pequenos_grupos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pequenos_grupos
      WHERE id = grupo_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem adicionar membros aos seus grupos"
  ON membros_pequenos_grupos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pequenos_grupos
      WHERE id = grupo_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar membros dos seus grupos"
  ON membros_pequenos_grupos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pequenos_grupos
      WHERE id = grupo_id AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pequenos_grupos
      WHERE id = grupo_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem remover membros dos seus grupos"
  ON membros_pequenos_grupos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pequenos_grupos
      WHERE id = grupo_id AND user_id = auth.uid()
    )
  );