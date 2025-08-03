-- Gallery categories tablosundaki timestamp sorunlarını düzelt
-- created_by ve updated_by alanlarını NULL yap

UPDATE gallery_categories 
SET 
  created_by = NULL,
  updated_by = NULL
WHERE created_by IS NOT NULL OR updated_by IS NOT NULL;

-- Alanları NULL olabilir yap (eğer zaten değilse)
ALTER TABLE gallery_categories 
ALTER COLUMN created_by DROP NOT NULL,
ALTER COLUMN updated_by DROP NOT NULL; 