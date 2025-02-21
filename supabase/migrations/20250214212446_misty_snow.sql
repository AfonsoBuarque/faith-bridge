/*
  # Adicionar políticas de acesso para admin

  1. Alterações
    - Adicionar políticas para permitir acesso total do admin às tabelas:
      - dados_igreja
      - user_profiles
      - admin_users
  
  2. Segurança
    - Manter RLS ativo
    - Garantir que apenas o admin tenha acesso total
    - Manter políticas existentes para outros usuários
*/

-- Função auxiliar para verificar se é super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE user_id = $1 
    AND is_super_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para dados_igreja
CREATE POLICY "super_admin_all_access_dados_igreja"
  ON dados_igreja
  FOR ALL 
  TO authenticated
  USING (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  )
  WITH CHECK (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

-- Políticas para user_profiles
CREATE POLICY "super_admin_all_access_user_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  )
  WITH CHECK (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

-- Políticas para admin_users
CREATE POLICY "super_admin_all_access_admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  )
  WITH CHECK (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  );