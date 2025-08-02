-- Slides tablosuna JSON formatında buttons kolonu ekle
-- Bu script mevcut button_text ve button_url verilerini korur

-- Yeni buttons kolonu ekle (JSON formatında)
ALTER TABLE slides ADD COLUMN IF NOT EXISTS buttons JSONB DEFAULT '[]'::jsonb;

-- Mevcut button_text ve button_url verilerini buttons kolonuna aktar
UPDATE slides 
SET buttons = CASE 
  WHEN button_text IS NOT NULL AND button_text != '' AND button_url IS NOT NULL AND button_url != '' THEN
    jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'text', button_text,
        'url', button_url,
        'style', 'primary'
      )
    )
  ELSE '[]'::jsonb
END
WHERE buttons = '[]'::jsonb OR buttons IS NULL;

-- İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_slides_buttons ON slides USING GIN (buttons);

-- Şimdilik eski kolonları koru (geriye uyumluluk için)
-- İleriki güncellemede kaldırılabilir:
-- ALTER TABLE slides DROP COLUMN IF EXISTS button_text;
-- ALTER TABLE slides DROP COLUMN IF EXISTS button_url;