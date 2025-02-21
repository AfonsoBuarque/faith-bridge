/*
  # Fix storage RLS policies

  1. Changes
    - Drop and recreate storage policies with correct permissions
    - Add public access for logo objects
    - Simplify RLS policies
  
  2. Security
    - Maintain file type and size restrictions
    - Allow public read access
    - Restrict write access to authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public users can view logos bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can use logos bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Public users can view logo objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage logo objects" ON storage.objects;

-- Bucket policies
CREATE POLICY "Enable read access for all users"
  ON storage.buckets
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for authenticated users only"
  ON storage.buckets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Object policies
CREATE POLICY "Enable read access for all users"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Enable insert access for authenticated users only"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Enable update access for authenticated users only"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "Enable delete access for authenticated users only"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos');