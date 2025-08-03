-- Gallery categories tablosunda created_by ve updated_by alanlarını NULL olabilir yap
ALTER TABLE gallery_categories 
ALTER COLUMN created_by DROP NOT NULL,
ALTER COLUMN updated_by DROP NOT NULL; 