/*
  # Adicionar permissões para visualização de usuários

  1. Alterações
    - Criar view para listar todos os usuários com dados da igreja
    - Adicionar políticas de acesso para admin
    - Garantir que o admin tem todas as permissões necessárias

  2. Segurança
    - Apenas admins podem ver todos os usuários
    - Usuários normais só veem seus próprios dados
*/

-- Remover view existente se houver
DROP VIEW IF EXISTS user_profiles_with_church;

-- Criar view otimizada para listar usuários com dados da igreja
CREATE OR REPLACE VIEW user_profiles_with_church AS
SELECT 
  up.id,
  up.user_id,
  up.full_name,
  up.email,
  up.created_at,
  di.nome_igreja,
  di.responsavel,
  di.telefone as igreja_telefone,
  di.email as igreja_email
FROM user_profiles up
LEFT JOIN dados_igreja di ON up.user_id = di.user_id;

-- Garantir que o admin tem todas as permissões necessárias
UPDATE admin_users
SET permissions = array_cat(
  permissions,
  ARRAY[
    'users.view',
    'users.list',
    'users.search'
  ]
)
WHERE user_id = '594ed9f1-bddb-4383-a2d5-c6463ebdb457'
AND NOT permissions @> ARRAY['users.view', 'users.list', 'users.search'];

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

-- Criar políticas para a view
ALTER VIEW user_profiles_with_church OWNER TO postgres;

-- Garantir que as políticas existentes não conflitem
DROP POLICY IF EXISTS "read_own_or_admin_igreja" ON dados_igreja;
DROP POLICY IF EXISTS "write_own_or_admin_igreja" ON dados_igreja;

-- Criar novas políticas para dados_igreja
CREATE POLICY "read_own_or_admin_igreja"
  ON dados_igreja
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    has_admin_permission('users.view')
  );

CREATE POLICY "write_own_or_admin_igreja"
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

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dados_igreja_user_id ON dados_igreja(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);