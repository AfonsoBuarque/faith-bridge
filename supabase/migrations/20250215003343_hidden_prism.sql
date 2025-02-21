-- Remover políticas existentes
DROP POLICY IF EXISTS "allow_read_own_or_admin" ON dados_igreja;
DROP POLICY IF EXISTS "allow_write_own_or_admin" ON dados_igreja;
DROP POLICY IF EXISTS "allow_read_own_or_admin_profiles" ON user_profiles;
DROP POLICY IF EXISTS "allow_write_own_or_admin_profiles" ON user_profiles;

-- Criar novas políticas
CREATE POLICY "read_own_or_admin"
  ON dados_igreja
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

CREATE POLICY "write_own_or_admin"
  ON dados_igreja
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

CREATE POLICY "read_own_or_admin_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

CREATE POLICY "write_own_or_admin_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND (role = 'Admin' OR is_super_admin = true)
    )
  );

-- Atualizar permissões do admin
UPDATE admin_users
SET permissions = ARRAY[
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
is_super_admin = true
WHERE user_id = '594ed9f1-bddb-4383-a2d5-c6463ebdb457';