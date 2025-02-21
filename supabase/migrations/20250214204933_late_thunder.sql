/*
  # Correção da autenticação de admin

  1. Alterações
    - Remove função antiga
    - Cria nova função para verificar status de admin
    - Atualiza políticas de segurança
    
  2. Segurança
    - Melhora verificação de admin
    - Simplifica políticas de acesso
*/

-- Remove função antiga
DROP FUNCTION IF EXISTS is_admin(uuid);

-- Cria nova função para verificar status de admin
CREATE OR REPLACE FUNCTION check_admin_status(check_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = check_user_id 
    AND (role = 'Admin' OR is_super_admin = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recria políticas com verificação mais simples
DROP POLICY IF EXISTS "allow_read_all" ON admin_users;
DROP POLICY IF EXISTS "allow_insert_if_no_admins" ON admin_users;
DROP POLICY IF EXISTS "allow_update_if_admin" ON admin_users;

CREATE POLICY "admin_read_access"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR check_admin_status(auth.uid())
  );

CREATE POLICY "admin_write_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (check_admin_status(auth.uid()))
  WITH CHECK (check_admin_status(auth.uid()));

-- Atualiza admin padrão
UPDATE auth.users 
SET email = 'ftadmin@faithflowtech.com.br'
WHERE id = '594ed9f1-bddb-4383-a2d5-c6463ebdb457';

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