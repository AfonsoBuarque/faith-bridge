/*
  # Correção da autenticação de admin

  1. Alterações
    - Recria a tabela admin_users com estrutura correta
    - Adiciona políticas de segurança mais permissivas para autenticação
    - Insere admin padrão do sistema
    
  2. Segurança
    - Habilita RLS na tabela
    - Adiciona políticas para controle de acesso
*/

-- Recria a tabela admin_users
DROP TABLE IF EXISTS admin_users CASCADE;

CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL,
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admin_users_user_id_key UNIQUE (user_id),
  CONSTRAINT admin_users_email_key UNIQUE (email)
);

-- Habilita RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Cria políticas mais permissivas para autenticação
CREATE POLICY "allow_read_all"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_insert_if_no_admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

CREATE POLICY "allow_update_if_admin"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

-- Insere admin padrão
INSERT INTO auth.users (id, email)
VALUES ('594ed9f1-bddb-4383-a2d5-c6463ebdb457', 'ftadmin@faithflowtech.com.br')
ON CONFLICT (id) DO NOTHING;

INSERT INTO admin_users (
  user_id,
  name,
  email,
  role,
  permissions,
  is_super_admin
) VALUES (
  '594ed9f1-bddb-4383-a2d5-c6463ebdb457',
  'FaithFlow Tech Admin',
  'ftadmin@faithflowtech.com.br',
  'Admin',
  ARRAY[
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'churches.view',
    'churches.create',
    'churches.edit',
    'churches.delete',
    'messages.view',
    'messages.send',
    'settings.view',
    'settings.edit'
  ],
  true
)
ON CONFLICT (user_id) DO NOTHING;