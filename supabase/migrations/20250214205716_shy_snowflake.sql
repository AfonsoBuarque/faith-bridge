-- Remove todas as políticas existentes
DROP POLICY IF EXISTS "allow_select_for_authenticated" ON admin_users;
DROP POLICY IF EXISTS "allow_insert_for_first_admin" ON admin_users;
DROP POLICY IF EXISTS "allow_all_for_admin" ON admin_users;

-- Cria uma única política simplificada para leitura
CREATE POLICY "allow_read_access"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Cria política para inserção apenas quando não há admins
CREATE POLICY "allow_first_admin_creation"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM admin_users
    )
  );

-- Cria política para admins existentes
CREATE POLICY "allow_admin_management"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- Garante que o admin padrão existe
DO $$
BEGIN
  -- Cria o usuário se não existir
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    confirmation_token
  ) VALUES (
    '594ed9f1-bddb-4383-a2d5-c6463ebdb457',
    'ftadmin@faithflowtech.com.br',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    raw_app_meta_data = EXCLUDED.raw_app_meta_data;

  -- Cria o registro de admin
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
END $$;