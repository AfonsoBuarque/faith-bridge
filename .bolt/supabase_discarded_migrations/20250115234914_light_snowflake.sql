/*
  # Fix Admin Policies Final
  
  1. Changes
    - Drop and recreate admin_users table with proper constraints
    - Create non-recursive policies
    - Add initial admin user
    
  2. Security
    - Enable RLS
    - Prevent infinite recursion
    - Ensure proper access control
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
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

-- Create non-recursive policies
-- Allow initial admin setup when table is empty
CREATE POLICY "allow_initial_admin"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

-- Allow admins to read all records
CREATE POLICY "allow_admin_read"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Allow admins to insert new records
CREATE POLICY "allow_admin_insert"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    ) OR
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

-- Allow admins to update records
CREATE POLICY "allow_admin_update"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Allow admins to delete records
CREATE POLICY "allow_admin_delete"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'Admin'
    )
  );

-- Insert initial admin user
INSERT INTO auth.users (id, email)
VALUES ('594ed9f1-bddb-4383-a2d5-c6463ebdb457', 'ftadmin@faithflowtech.com.br')
ON CONFLICT (id) DO NOTHING;

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
ON CONFLICT (user_id) DO NOTHING;