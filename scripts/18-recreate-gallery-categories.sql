-- Gallery categories tablosunu yeniden oluştur
-- Önce mevcut tabloyu sil
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_categories CASCADE;

-- Gallery categories tablosunu yeniden oluştur
CREATE TABLE gallery_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images tablosunu yeniden oluştur
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES gallery_categories(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    file_size INTEGER,
    file_type VARCHAR(50),
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'leri yeniden oluştur
CREATE INDEX idx_gallery_categories_active_order ON gallery_categories(is_active, sort_order);
CREATE INDEX idx_gallery_images_category_active ON gallery_images(category_id, is_active);

-- Trigger'ları yeniden oluştur
CREATE OR REPLACE FUNCTION update_gallery_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_categories_updated_at 
  BEFORE UPDATE ON gallery_categories 
  FOR EACH ROW EXECUTE FUNCTION update_gallery_categories_updated_at(); 