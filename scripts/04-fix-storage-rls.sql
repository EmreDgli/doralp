-- Fix RLS policies for storage

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from project-images" ON storage.objects;

-- Create more permissive policies for project-images bucket
CREATE POLICY "Allow authenticated uploads to project-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow public read access to project-images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated updates to project-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated deletes from project-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Also ensure the bucket exists and is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'project-images';

-- Alternative: If still having issues, temporarily disable RLS for testing
-- (NOT recommended for production)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;