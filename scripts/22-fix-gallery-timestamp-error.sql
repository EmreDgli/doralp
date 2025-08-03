-- Gallery tablolarındaki timestamp hatasını düzelt
-- created_by ve updated_by alanlarını temizle

-- Gallery categories tablosundaki hatalı verileri temizle
UPDATE gallery_categories 
SET 
  created_by = NULL,
  updated_by = NULL
WHERE 
  created_by IS NOT NULL 
  AND created_by::text NOT SIMILAR TO '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

-- Gallery images tablosundaki hatalı verileri temizle
UPDATE gallery_images 
SET 
  created_by = NULL
WHERE 
  created_by IS NOT NULL 
  AND created_by::text NOT SIMILAR TO '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

-- Alanların NULL olabilir olduğundan emin ol
ALTER TABLE gallery_categories 
ALTER COLUMN created_by DROP NOT NULL,
ALTER COLUMN updated_by DROP NOT NULL;

ALTER TABLE gallery_images 
ALTER COLUMN created_by DROP NOT NULL;

-- Temizlik sonrası durumu kontrol et
SELECT 
  'gallery_categories' as table_name,
  COUNT(*) as total_records,
  COUNT(created_by) as records_with_created_by,
  COUNT(updated_by) as records_with_updated_by
FROM gallery_categories
UNION ALL
SELECT 
  'gallery_images' as table_name,
  COUNT(*) as total_records,
  COUNT(created_by) as records_with_created_by,
  NULL as records_with_updated_by
FROM gallery_images; 