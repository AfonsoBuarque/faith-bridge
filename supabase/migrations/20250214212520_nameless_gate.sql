/*
  # Corrigir acesso admin e consultas SQL

  1. Alterações
    - Corrigir ambiguidade de user_id nas consultas
    - Melhorar políticas de acesso para admin
    - Adicionar índices para melhor performance
  
  2. Segurança
    - Manter RLS ativo
    - Garantir acesso correto para admin
*/

-- Remover políticas existentes
DROP POLICY IF EXISTS "super_admin_all_access_dados_igreja" ON dados_igreja;
DROP POLICY IF EXISTS "super_admin_all_access_user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "super_admin_all_access_admin_users" ON admin_users;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_dados_igreja_user_id ON dados_igreja(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

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
CREATE POLICY "admin_read_all_churches"
  ON dados_igreja
  FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

CREATE POLICY "admin_write_all_churches"
  ON dados_igreja
  FOR ALL
  TO authenticated
  USING (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  )
  WITH CHECK (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

-- Políticas para user_profiles
CREATE POLICY "admin_read_all_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

CREATE POLICY "admin_write_all_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  )
  WITH CHECK (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

-- Políticas para admin_users
CREATE POLICY "admin_read_all_admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

CREATE POLICY "admin_write_all_admins"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  )
  WITH CHECK (
    is_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

-- Garantir que o admin tem acesso a todas as tabelas
DO $$ 
BEGIN
  -- Verificar e atualizar permissões do admin
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
END $$;