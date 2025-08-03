-- Gallery images tablosunda file_size alanının type'ını düzelt
-- PostgreSQL'de INTEGER yerine INT4 kullan

-- Önce mevcut tabloyu kontrol et
DO $$
BEGIN
    -- Eğer file_size alanı varsa, type'ını değiştir
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gallery_images' 
        AND column_name = 'file_size'
    ) THEN
        -- file_size alanını INT4 olarak değiştir
        ALTER TABLE gallery_images 
        ALTER COLUMN file_size TYPE INT4;
        
        RAISE NOTICE 'file_size alanı INT4 olarak güncellendi';
    ELSE
        RAISE NOTICE 'file_size alanı bulunamadı';
    END IF;
END $$;

-- Yeni tablo oluşturma için örnek (eğer tabloyu yeniden oluşturuyorsanız)
-- CREATE TABLE gallery_images (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     category_id UUID NOT NULL REFERENCES gallery_categories(id) ON DELETE CASCADE,
--     image_url VARCHAR(500) NOT NULL,
--     alt_text VARCHAR(200),
--     caption TEXT,
--     sort_order INT4 DEFAULT 0,
--     is_active BOOLEAN DEFAULT TRUE,
--     file_size INT4,  -- ← INT4 kullan
--     file_type VARCHAR(50),
--     created_by UUID REFERENCES admin_users(id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- ); 