/*
  # Correção da autenticação e políticas do admin

  1. Alterações
    - Simplifica políticas para evitar recursão
    - Atualiza autenticação do admin
    - Remove funções desnecessárias
    
  2. Segurança
    - Mantém controle de acesso
    - Evita loops infinitos nas políticas
*/

-- Habilita a extensão pgcrypto se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove políticas existentes
DROP POLICY IF EXISTS "allow_read_for_all" ON admin_users;
DROP POLICY IF EXISTS "allow_write_for_admins" ON admin_users;

-- Cria política de leitura básica
CREATE POLICY "basic_read_access"
  ON admin_users
  FOR SELECT
  USING (true);

-- Cria política de escrita para o primeiro admin
CREATE POLICY "first_admin_access"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (NOT EXISTS (SELECT 1 FROM admin_users));

-- Cria política de escrita para admins existentes
CREATE POLICY "admin_write_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Atualiza o usuário admin
INSERT INTO auth.users (id, email, encrypted_password, raw_app_meta_data)
VALUES (
  '594ed9f1-bddb-4383-a2d5-c6463ebdb457',
  'ftadmin@faithflowtech.com.br',
  crypt('admin123', gen_salt('bf')),
  '{"provider": "email", "providers": ["email"]}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data;

-- Garante que o admin existe na tabela admin_users
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
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_super_admin = EXCLUDED.is_super_admin;