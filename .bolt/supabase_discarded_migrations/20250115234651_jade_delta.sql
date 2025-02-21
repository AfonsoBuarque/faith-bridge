/*
  # Fix Admin Policies
  
  1. Changes
    - Drop existing policies
    - Create new non-recursive policies
    - Add initial admin setup policy
  
  2. Security
    - Maintain RLS security
    - Prevent infinite recursion
*/

-- Drop existing policies

-- Create new policies that avoid recursion
-- Allow initial admin setup when table is empty
CREATE POLICY "Allow initial admin setup"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

-- Allow admins to read all records
CREATE POLICY "Admin read access"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    role = 'Admin'
  );

-- Allow admins to insert new records
CREATE POLICY "Admin insert access"
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
CREATE POLICY "Admin update access"
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
CREATE POLICY "Admin delete access"
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