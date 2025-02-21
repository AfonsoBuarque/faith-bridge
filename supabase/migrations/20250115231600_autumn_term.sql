/*
  # Fix Admin Policies

  1. Changes
    - Drop existing policies that cause recursion
    - Create new policies with direct user checks
    - Add special policy for first admin creation
    - Add policy for self-viewing

  2. Security
    - Maintain RLS protection
    - Allow first user to become admin
    - Allow admins to manage other admins
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert new admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;

-- Create new policies
-- Allow first admin creation when table is empty
CREATE POLICY "Allow first admin creation"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

-- Allow users to view their own admin record
CREATE POLICY "Users can view own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow admins to view all records
CREATE POLICY "Admins can view all records"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM admin_users 
      WHERE role = 'Admin'
    )
  );

-- Allow admins to insert new admins
CREATE POLICY "Admins can insert new admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM admin_users 
      WHERE role = 'Admin'
    )
  );

-- Allow admins to update records
CREATE POLICY "Admins can update records"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM admin_users 
      WHERE role = 'Admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM admin_users 
      WHERE role = 'Admin'
    )
  );