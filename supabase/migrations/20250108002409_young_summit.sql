/*
  # Fix storage policies for logo uploads

  1. Changes
    - Add public access policy for logos bucket
    - Add more permissive upload policy
    - Fix bucket access policy
  
  2. Security
    - Maintain RLS while allowing necessary operations
    - Keep file size and type restrictions
*/

-- Make logos bucket publicly accessible
UPDATE storage.buckets 
SET public = true 
WHERE id = 'logos';

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Authenticated users can create logos bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can view logos bucket" ON storage.buckets;
DROP POLICY IF EXISTS "Authenticated users can upload logo objects" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own logo objects" ON storage.objects;

-- Create more permissive bucket policies
CREATE POLICY "Public users can view logos bucket"
  ON storage.buckets
  FOR SELECT
  TO public
  USING (name = 'logos');

CREATE POLICY "Authenticated users can use logos bucket"
  ON storage.buckets
  FOR ALL
  TO authenticated
  USING (name = 'logos');

-- Create more permissive object policies
CREATE POLICY "Public users can view logo objects"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can manage logo objects"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'logos')
  WITH CHECK (
    bucket_id = 'logos' 
    AND (CASE 
      WHEN metadata->>'content-type' = 'image/png' THEN true
      WHEN metadata->>'content-type' = 'image/jpeg' THEN true
      WHEN metadata->>'content-type' = 'image/jpg' THEN true
      ELSE false
    END)
    AND (CASE 
      WHEN metadata->>'size' IS NOT NULL 
      THEN (metadata->>'size')::int <= 2097152 -- 2MB
      ELSE false
    END)
  );