/*
  # Correção das políticas de admin

  1. Alterações
    - Remove recursão nas políticas
    - Simplifica verificação de admin
    - Adiciona política para leitura pública
    
  2. Segurança
    - Mantém restrições para escrita
    - Permite leitura mais permissiva
*/

-- Remove políticas existentes
DROP POLICY IF EXISTS "public_read_access" ON admin_users;
DROP POLICY IF EXISTS "admin_write_access" ON admin_users;

-- Cria política de leitura pública
CREATE POLICY "allow_read_for_all"
  ON admin_users
  FOR SELECT
  USING (true);

-- Cria política de escrita simplificada
CREATE POLICY "allow_write_for_admins"
  ON admin_users
  FOR ALL
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.role = 'Admin'
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.role = 'Admin'
    )
  );

-- Garante que o admin padrão existe
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