-- Safety tablosunu güvenlik sertifikaları için güncelle
-- Yeni alanlar ekle
ALTER TABLE safety 
ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS issue_date DATE,
ADD COLUMN IF NOT EXISTS expiry_date DATE,
ADD COLUMN IF NOT EXISTS issuing_authority VARCHAR(255),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Index'ler ekle
CREATE INDEX IF NOT EXISTS idx_safety_is_active ON safety(is_active);
CREATE INDEX IF NOT EXISTS idx_safety_created_at ON safety(created_at);
CREATE INDEX IF NOT EXISTS idx_safety_certificate_number ON safety(certificate_number);
CREATE INDEX IF NOT EXISTS idx_safety_sort_order ON safety(sort_order);

-- RLS (Row Level Security) politikaları ekle (eğer yoksa)
ALTER TABLE safety ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle ve yenilerini ekle
DROP POLICY IF EXISTS "Allow public read access" ON safety;
DROP POLICY IF EXISTS "Allow admin full access" ON safety;

-- Public read access
CREATE POLICY "Allow public read access" ON safety
  FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Allow admin full access" ON safety
  FOR ALL USING (auth.role() = 'admin' OR auth.uid() IS NOT NULL);

-- Güncelleme trigger'ı ekle
CREATE OR REPLACE FUNCTION update_safety_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_safety_updated_at ON safety;
CREATE TRIGGER update_safety_updated_at 
  BEFORE UPDATE ON safety 
  FOR EACH ROW EXECUTE FUNCTION update_safety_updated_at();

-- Örnek güvenlik sertifikası verileri ekle
INSERT INTO safety (title, description, certificate_number, issue_date, expiry_date, issuing_authority, is_active, sort_order) 
VALUES
('ISO 45001:2018', 'İş Sağlığı ve Güvenliği Yönetim Sistemi Sertifikası - Endüstriyel çelik yapı üretimi ve montajı', 'ISO-45001-2023-001', '2023-01-15', '2026-01-15', 'TSE - Türk Standartları Enstitüsü', true, 1),
('OHSAS 18001:2007', 'İş Sağlığı ve Güvenliği Değerlendirme Serisi Sertifikası', 'OHSAS-18001-2023-002', '2023-02-10', '2026-02-10', 'TÜRKAK', true, 2),
('Güvenlik Eğitim Sertifikası', 'Personel güvenlik eğitim belgeleri ve uygulamaları', 'GUV-EGT-2023-003', '2023-03-05', '2024-03-05', 'İSGUM - İş Sağlığı ve Güvenliği Eğitim Merkezi', true, 3),
('İşyeri Hekimi Raporu', 'İşyeri hekimi periyodik kontrol raporu', 'IH-2023-004', '2023-04-20', '2024-04-20', 'İşyeri Hekimi - Dr. Mehmet Özkan', true, 4),
('İş Güvenliği Uzmanı Raporu', 'İş güvenliği uzmanı periyodik değerlendirme raporu', 'IGU-2023-005', '2023-05-15', '2024-05-15', 'İş Güvenliği Uzmanı - Mühendis Ali Yılmaz', true, 5)
ON CONFLICT (certificate_number) DO NOTHING; 