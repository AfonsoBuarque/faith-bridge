-- Remover políticas existentes
DROP POLICY IF EXISTS "read_own_or_admin" ON dados_igreja;
DROP POLICY IF EXISTS "write_own_or_admin" ON dados_igreja;
DROP POLICY IF EXISTS "read_own_or_admin_profiles" ON user_profiles;
DROP POLICY IF EXISTS "write_own_or_admin_profiles" ON user_profiles;

-- Criar view para relacionar user_profiles com dados_igreja
CREATE OR REPLACE VIEW user_profiles_with_church AS
SELECT 
  up.*,
  di.nome_igreja,
  di.responsavel,
  di.telefone as igreja_telefone,
  di.email as igreja_email
FROM user_profiles up
LEFT JOIN dados_igreja di ON up.user_id = di.user_id;

-- Criar políticas para a view
ALTER VIEW user_profiles_with_church OWNER TO postgres;

-- Criar novas políticas para dados_igreja
CREATE POLICY "read_own_or_admin_igreja"
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

CREATE POLICY "write_own_or_admin_igreja"
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

-- Criar novas políticas para user_profiles
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