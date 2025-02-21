/*
  # Atualizar políticas de acesso para admin

  1. Alterações
    - Remover políticas existentes
    - Criar novas políticas para acesso de admin
    - Atualizar permissões do admin padrão
    
  2. Segurança
    - Apenas admins podem ver todos os dados
    - Usuários normais só veem seus próprios dados
*/

-- Remover políticas existentes
DROP POLICY IF EXISTS "read_own_or_admin_profiles" ON user_profiles;
DROP POLICY IF EXISTS "write_own_or_admin_profiles" ON user_profiles;
DROP POLICY IF EXISTS "read_own_or_admin_igreja" ON dados_igreja;
DROP POLICY IF EXISTS "write_own_or_admin_igreja" ON dados_igreja;

-- Criar função para verificar permissões de admin
CREATE OR REPLACE FUNCTION has_admin_permission(permission text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = auth.uid() 
    AND (
      is_super_admin = true OR 
      permissions @> ARRAY[permission]
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar novas políticas
CREATE POLICY "admin_read_igreja"
  ON dados_igreja
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    has_admin_permission('users.view')
  );

CREATE POLICY "admin_write_igreja"
  ON dados_igreja
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    has_admin_permission('users.edit')
  )
  WITH CHECK (
    user_id = auth.uid() OR
    has_admin_permission('users.edit')
  );

CREATE POLICY "admin_read_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    has_admin_permission('users.view')
  );

CREATE POLICY "admin_write_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid() OR
    has_admin_permission('users.edit')
  )
  WITH CHECK (
    user_id = auth.uid() OR
    has_admin_permission('users.edit')
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