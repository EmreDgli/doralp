-- Images bucket için RLS policy'leri (slider-images ve project-images klasörleri için)

-- Önce eski policy'leri temizle
DROP POLICY IF EXISTS "Allow project images access" ON storage.objects;
DROP POLICY IF EXISTS "project-images-all-access" ON storage.objects;
DROP POLICY IF EXISTS "allow_project_images_access" ON storage.objects;
DROP POLICY IF EXISTS "Allow images bucket access" ON storage.objects;

-- Images bucket için yeni policy oluştur (slider-images ve project-images klasörleri için)
CREATE POLICY "Allow images bucket access" ON storage.objects
FOR ALL TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Bucket'ın public olduğundan emin ol
UPDATE storage.buckets 
SET public = true 
WHERE id = 'images';

-- Eğer images bucket yoksa oluştur (muhtemelen var ama emin olmak için)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;