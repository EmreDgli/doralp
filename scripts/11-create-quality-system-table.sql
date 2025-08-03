-- Quality System (Kalite Sistemi) tablosu
CREATE TABLE IF NOT EXISTS quality_system (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  certificate_number VARCHAR(100) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  issuing_authority VARCHAR(255) NOT NULL,
  certificate_file_url TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_quality_system_is_active ON quality_system(is_active);
CREATE INDEX IF NOT EXISTS idx_quality_system_created_at ON quality_system(created_at);
CREATE INDEX IF NOT EXISTS idx_quality_system_certificate_number ON quality_system(certificate_number);

-- RLS (Row Level Security) politikaları
ALTER TABLE quality_system ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" ON quality_system
  FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Allow admin full access" ON quality_system
  FOR ALL USING (auth.role() = 'admin' OR auth.uid() IS NOT NULL);

-- Örnek veri
INSERT INTO quality_system (title, description, certificate_number, issue_date, expiry_date, issuing_authority, is_active) VALUES
('ISO 9001:2015', 'Kalite Yönetim Sistemi Sertifikası - Endüstriyel çelik yapı üretimi ve montajı', 'ISO-9001-2023-001', '2023-01-15', '2026-01-15', 'TSE - Türk Standartları Enstitüsü', true),
('ISO 14001:2015', 'Çevre Yönetim Sistemi Sertifikası - Çevre dostu üretim süreçleri', 'ISO-14001-2023-002', '2023-02-10', '2026-02-10', 'TSE - Türk Standartları Enstitüsü', true),
('OHSAS 18001:2007', 'İş Sağlığı ve Güvenliği Yönetim Sistemi Sertifikası', 'OHSAS-18001-2023-003', '2023-03-05', '2026-03-05', 'TÜRKAK', true),
('CE Marking', 'Avrupa Uygunluk Beyanı - Çelik konstrüksiyon ürünleri', 'CE-2023-004', '2023-04-20', null, 'Notifiye Kuruluş', true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quality_system_updated_at 
  BEFORE UPDATE ON quality_system 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();