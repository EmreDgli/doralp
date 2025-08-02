-- Alternative: More permissive storage policies if still having RLS issues

-- Drop all existing policies for project-images
DROP POLICY IF EXISTS "Allow authenticated uploads to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from project-images" ON storage.objects;

-- Create very permissive policies (for development/testing)
CREATE POLICY "Allow all operations on project-images"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');

-- Ensure bucket is public
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'project-images';

-- If the bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;