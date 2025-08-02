-- Makine tablosu oluşturma
CREATE TABLE machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adet INTEGER NOT NULL DEFAULT 1,
  cins TEXT NOT NULL,
  model TEXT NOT NULL,
  marka TEXT NOT NULL,
  yerli BOOLEAN DEFAULT false,
  ithal BOOLEAN DEFAULT true,
  kapasite TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) etkinleştirme
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- Tüm kullanıcıların makine verilerini okuyabilmesi için policy
CREATE POLICY "Machines are viewable by everyone" ON machines
  FOR SELECT USING (true);

-- Sadece authenticated kullanıcıların makine ekleyebilmesi için policy
CREATE POLICY "Machines are insertable by authenticated users" ON machines
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Sadece authenticated kullanıcıların makine güncelleyebilmesi için policy
CREATE POLICY "Machines are updatable by authenticated users" ON machines
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Sadece authenticated kullanıcıların makine silebilmesi için policy
CREATE POLICY "Machines are deletable by authenticated users" ON machines
  FOR DELETE USING (auth.role() = 'authenticated');

-- Örnek veriler
INSERT INTO machines (adet, cins, model, marka, yerli, ithal, kapasite) VALUES
(1, 'PEDDİNGHAUS FDB 2500 CNC SAC DELME MERKEZİ', '2006', 'PEDDİNGHAUS', false, true, '2000 mm'),
(1, 'PEDDİNGHAUS BDL 1250 CNC PROFİL DELME', '2010', 'PEDDİNGHAUS', false, true, '1250 mm'),
(1, 'PEDDİNGHAUS DG 1100 CNC PROFİL KESME', '2010', 'PEDDİNGHAUS', false, true, '1100 mm'),
(1, 'PEDDİNGHAUS AVENGER CNC PROFİL DELME', '2010', 'PEDDİNGHAUS', false, true, '2000 mm'),
(1, 'AZAHİNLER HİDROLİK SİLİNDİR 4 RSS', '2010', 'AZAHİNLER', true, false, '25 mm'); 