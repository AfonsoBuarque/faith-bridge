/*
  # Add Storage Policies for Logo Uploads

  1. Changes
    - Add storage policies for the logos bucket
    - Enable authenticated users to upload and manage their logos
  
  2. Security
    - Only authenticated users can upload
    - Users can only access their own files
    - File size and type restrictions enforced
*/

-- Create storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Enable storage by creating the buckets table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT false
);

-- Create objects table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text REFERENCES storage.buckets(id),
  name text NOT NULL,
  owner uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED
);

-- Insert the logos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Bucket policies
CREATE POLICY "Authenticated users can create logos bucket"
  ON storage.buckets
  FOR INSERT
  TO authenticated
  WITH CHECK (name = 'logos');

CREATE POLICY "Authenticated users can view logos bucket"
  ON storage.buckets
  FOR SELECT
  TO authenticated
  USING (name = 'logos');

-- Object policies
CREATE POLICY "Authenticated users can upload logo objects"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos' 
    AND owner = auth.uid()
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

CREATE POLICY "Users can view their own logo objects"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'logos' AND owner = auth.uid());

CREATE POLICY "Users can update their own logo objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos' AND owner = auth.uid());

CREATE POLICY "Users can delete their own logo objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos' AND owner = auth.uid());