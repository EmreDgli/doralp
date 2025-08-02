-- Create contact table for dynamic contact page content
CREATE TABLE IF NOT EXISTS contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL, -- 'location' or 'contact_item'
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(500),
    icon VARCHAR(50), -- For contact items: 'phone', 'email', 'address', 'clock'
    color VARCHAR(50), -- For contact items: 'bg-blue-500', 'bg-green-500', etc.
    details JSONB, -- Array of detail strings
    address TEXT, -- For location
    map_embed_url TEXT, -- For location map
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_contact_info_type ON contact_info(type);
CREATE INDEX IF NOT EXISTS idx_contact_info_active ON contact_info(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_sort ON contact_info(sort_order);

-- Insert default contact items (these will be the base cards that admin can edit)
INSERT INTO contact_info (type, title, icon, color, details, sort_order) VALUES
('contact_item', 'Telefon', 'phone', 'bg-blue-500', '["(+90) 212 123 45 67", "(+90) 212 123 45 68"]', 1),
('contact_item', 'E-posta', 'email', 'bg-green-500', '["info@doralp.com.tr", "satis@doralp.com.tr"]', 2),
('contact_item', 'Adres', 'address', 'bg-red-500', '["Organize Sanayi Bölgesi", "1. Cadde No: 123", "İstanbul, Türkiye"]', 3),
('contact_item', 'Çalışma Saatleri', 'clock', 'bg-purple-500', '["Pazartesi - Cuma: 08:00 - 18:00", "Cumartesi: 08:00 - 16:00"]', 4),
('contact_item', 'Faks', 'fax', 'bg-yellow-500', '["(+90) 212 123 45 69"]', 5),
('contact_item', 'Website', 'website', 'bg-indigo-500', '["www.doralp.com.tr"]', 6);

-- Insert default location info
INSERT INTO contact_info (type, title, subtitle, address, map_embed_url, sort_order) VALUES
('location', 'Konum', 'Fabrikamızı ve ofisimizi ziyaret etmek için aşağıdaki konum bilgilerini kullanabilirsiniz.', 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7542285841885!2d28.85!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzI5LjUiTiAyOMKwNTEnMDAuMCJF!5e0!3m2!1str!2str!4v1600000000000!5m2!1str!2str" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>', 1);

-- Create RLS policies
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON contact_info FOR SELECT TO public USING (is_active = true);

-- Allow authenticated users to do everything
CREATE POLICY "Allow authenticated users full access" ON contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);