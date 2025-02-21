/*
  # Correção das políticas de admin

  1. Alterações
    - Simplifica políticas de acesso
    - Melhora verificação de admin
    - Adiciona política para leitura pública
    
  2. Segurança
    - Mantém restrições para escrita
    - Permite leitura mais permissiva
*/

-- Remove políticas existentes
DROP POLICY IF EXISTS "admin_read_access" ON admin_users;
DROP POLICY IF EXISTS "admin_write_access" ON admin_users;

-- Cria política de leitura mais permissiva
CREATE POLICY "public_read_access"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Cria política de escrita restrita
CREATE POLICY "admin_write_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

-- Garante que o admin existe
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