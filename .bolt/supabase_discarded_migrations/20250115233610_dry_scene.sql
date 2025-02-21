/*
  # Create Admin User Table and Initial Admin
  
  1. Create admin_users table if it doesn't exist
  2. Set up initial admin with full permissions
*/

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  permissions text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow first admin creation"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

-- Insert admin user record with a hardcoded UUID
INSERT INTO admin_users (
  user_id,
  name,
  email,
  role,
  permissions
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- This is a placeholder UUID
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
ON CONFLICT (user_id) DO UPDATE
SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  updated_at = now();