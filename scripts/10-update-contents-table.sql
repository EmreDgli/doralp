-- Contents tablosunu genişletme
-- Mevcut contents tablosuna yeni kolonlar ekliyoruz

-- Yeni kolonlar ekle
ALTER TABLE contents 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS data JSONB,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS section VARCHAR(100);

-- İndeks ekle
CREATE INDEX IF NOT EXISTS idx_contents_section ON contents(section);
CREATE INDEX IF NOT EXISTS idx_contents_is_published ON contents(is_published);

-- Ana sayfa içeriği ekle
INSERT INTO contents (language, page, title, body, data) VALUES
('tr', 'home', 'Ana Sayfa', 'Ana sayfa içeriği', '{"hero": {"title": "Doralp Yapı", "subtitle": "Güvenilir İnşaat Çözümleri", "description": "25 yıllık deneyimle kaliteli inşaat hizmetleri sunuyoruz"}}')
ON CONFLICT (language, page) 
DO UPDATE SET 
    data = EXCLUDED.data,
    updated_at = NOW();

-- SEO ayarları ekle
INSERT INTO contents (language, page, title, body, data) VALUES
('tr', 'seo', 'SEO Ayarları', 'Genel SEO ayarları', '{"meta_title_template": "{title} | Doralp Yapı", "meta_description_template": "{description} - Doralp Yapı ile güvenilir inşaat çözümleri", "default_keywords": "inşaat, yapı, doralp, construction"}')
ON CONFLICT (language, page) 
DO UPDATE SET 
    data = EXCLUDED.data,
    updated_at = NOW();

-- Footer içeriği ekle  
INSERT INTO contents (language, page, title, body, data) VALUES
('tr', 'footer', 'Footer', 'Alt bilgi içeriği', '{"company_info": {"name": "Doralp Yapı", "description": "İnşaat sektörünün güvenilir lideri", "phone": "+90 212 123 45 67", "email": "info@doralp.com.tr"}, "social_media": {"facebook": "", "instagram": "", "linkedin": ""}, "quick_links": [{"title": "Projeler", "url": "/projeler"}, {"title": "Hakkımızda", "url": "/hakkimizda"}, {"title": "İletişim", "url": "/iletisim"}]}')
ON CONFLICT (language, page) 
DO UPDATE SET 
    data = EXCLUDED.data,
    updated_at = NOW();

-- Ana sayfa hakkımızda bölümü ekle
INSERT INTO contents (language, page, section, title, body, data) VALUES
('tr', 'home', 'about_section', 'Kurumsal Kimliğimiz', 'Ana sayfadaki hakkımızda bölümü', '{"title": "Neden Doralp Yapı?", "description": "25 yıllık deneyimimiz, kaliteli malzemelerimiz ve uzman ekibimizle her projede mükemmelliği hedefliyoruz.", "features": ["Deneyimli Ekip", "Kaliteli Malzeme", "Zamanında Teslimat", "Müşteri Memnuniyeti"]}')
ON CONFLICT (language, page) 
DO NOTHING;

-- Hakkımızda sayfası detayları ekle
UPDATE contents 
SET data = '{"vision": {"title": "Vizyonumuz", "text": "İnşaat sektöründe lider konumumuzu koruyarak, yenilikçi ve sürdürülebilir projelerle geleceği inşa etmek."}, "mission": {"title": "Misyonumuz", "text": "Müşterilerimize en kaliteli hizmeti sunarak, güvenilir ve uzun soluklu iş ortaklıkları kurmak."}, "values": {"title": "Değerlerimiz", "items": ["Kalite", "Güvenilirlik", "Yenilikçilik", "Müşteri Odaklılık", "Sürdürülebilirlik"]}}'
WHERE language = 'tr' AND page = 'about';

COMMENT ON COLUMN contents.data IS 'JSONB formatında esnek veri saklama alanı';
COMMENT ON COLUMN contents.section IS 'Sayfa içindeki bölüm identifier (hero, about_section vb.)';
COMMENT ON COLUMN contents.is_published IS 'İçeriğin yayınlanma durumu';