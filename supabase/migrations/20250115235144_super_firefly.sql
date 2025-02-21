/*
  # Fix Admin Policies Final
  
  1. Changes
    - Drop and recreate admin_users table with proper constraints
    - Create non-recursive policies using a simpler approach
    - Add initial admin user
    
  2. Security
    - Enable RLS
    - Use role-based access control
    - Prevent infinite recursion
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
  is_super_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admin_users_user_id_key UNIQUE (user_id),
  CONSTRAINT admin_users_email_key UNIQUE (email)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a function to check admin status
CREATE OR REPLACE FUNCTION check_admin_status(check_user_id uuid)
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

-- Create simplified policies
CREATE POLICY "allow_read_own"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "allow_read_all_if_admin"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (check_admin_status(auth.uid()));

CREATE POLICY "allow_insert_if_admin"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    check_admin_status(auth.uid()) OR
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

CREATE POLICY "allow_update_if_admin"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (check_admin_status(auth.uid()))
  WITH CHECK (check_admin_status(auth.uid()));

CREATE POLICY "allow_delete_if_admin"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (check_admin_status(auth.uid()));

-- Insert initial admin user
DO $$ 
BEGIN
  -- Create the user in auth.users if it doesn't exist
  INSERT INTO auth.users (id, email)
  VALUES ('594ed9f1-bddb-4383-a2d5-c6463ebdb457', 'ftadmin@faithflowtech.com.br')
  ON CONFLICT (id) DO NOTHING;

  -- Create the admin user
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
  ON CONFLICT (user_id) DO NOTHING;
END $$;