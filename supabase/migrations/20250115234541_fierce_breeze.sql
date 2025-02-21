/*
  # Admin Users Setup
  
  1. Tables
    - Create admin_users table with proper constraints
  
  2. Security
    - Enable RLS
    - Add policies for access control
    
  3. Initial Data
    - Create initial admin user
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admin_users_user_id_key UNIQUE (user_id),
  CONSTRAINT admin_users_email_key UNIQUE (email)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create basic policies without recursion
CREATE POLICY "Public read access"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin write access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'Admin'
    )
  );

-- Create initial admin user
DO $$ 
DECLARE 
  v_user_id uuid;
BEGIN
  -- First create the user in auth.users if it doesn't exist
  INSERT INTO auth.users (id, email)
  VALUES ('594ed9f1-bddb-4383-a2d5-c6463ebdb457', 'ftadmin@faithflowtech.com.br')
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_user_id;

  -- Then create the admin user
  INSERT INTO admin_users (
    user_id,
    name,
    email,
    role,
    permissions
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
    ]
  )
  ON CONFLICT DO NOTHING;
END $$;