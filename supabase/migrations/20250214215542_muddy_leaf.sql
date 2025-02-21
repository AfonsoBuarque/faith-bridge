-- Remover políticas existentes
DROP POLICY IF EXISTS "admin_read_all_churches" ON dados_igreja;
DROP POLICY IF EXISTS "admin_write_all_churches" ON dados_igreja;
DROP POLICY IF EXISTS "admin_read_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "admin_write_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "admin_read_all_admins" ON admin_users;
DROP POLICY IF EXISTS "admin_write_all_admins" ON admin_users;

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid)
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

-- Políticas para dados_igreja
CREATE POLICY "allow_read_own_or_admin"
  ON dados_igreja
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  );

CREATE POLICY "allow_write_own_or_admin"
  ON dados_igreja
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  );

-- Políticas para user_profiles
CREATE POLICY "allow_read_own_or_admin_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  );

CREATE POLICY "allow_write_own_or_admin_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  );

-- Políticas para admin_users
CREATE POLICY "allow_read_own_or_admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  );

CREATE POLICY "allow_write_own_or_admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid() OR
    is_admin(auth.uid())
  );

-- Garantir que o admin tem acesso total
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