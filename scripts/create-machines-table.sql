-- Machines tablosunu oluştur
CREATE TABLE IF NOT EXISTS machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  quantity INTEGER DEFAULT 1,
  type TEXT,
  technical_specifications TEXT,
  model TEXT,
  brand TEXT,
  is_local BOOLEAN DEFAULT false,
  is_imported BOOLEAN DEFAULT false,
  capacity TEXT,
  year_acquired INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikalarını ekle
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcılar için tam erişim
CREATE POLICY "Admin users can manage machines" ON machines
  FOR ALL USING (auth.role() = 'authenticated');

-- Public okuma erişimi (sadece aktif makineler)
CREATE POLICY "Public can view active machines" ON machines
  FOR SELECT USING (is_active = true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON machines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 