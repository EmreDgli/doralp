-- Insert sample gallery categories
INSERT INTO gallery_categories (title, slug, sort_order) VALUES
('Ürün Kabul', 'urun-kabul', 1),
('Kumlama & Shop Primer', 'kumlama-shop-primer', 2),
('Kesim', 'kesim', 3),
('Delik Delme', 'delik-delme', 4),
('Ölçüm & Montaj', 'olcum-montaj', 5),
('Kaynak', 'kaynak', 6),
('Mekanik Temizlik', 'mekanik-temizlik', 7),
('NDT', 'ndt', 8),
('Boyama', 'boyama', 9),
('Sevkiyat', 'sevkiyat', 10),
('Saha Montajı', 'saha-montaji', 11);

-- Insert sample content for Turkish
INSERT INTO contents (language, page, title, body) VALUES
('tr', 'hakkimizda', 'Hakkımızda', 'Doralp, 1998 yılından bu yana endüstriyel çelik yapı sektöründe faaliyet gösteren, kaliteli üretim ve güvenilir hizmet anlayışıyla sektörde öncü konumda yer alan bir firmadır.'),
('tr', 'fabrika', 'Fabrikamız', 'Modern teknoloji ve kaliteli üretimin buluşma noktası olan fabrikamızda, deneyimli kadromuz ve son teknoloji ekipmanlarımızla kaliteli üretim gerçekleştiriyoruz.'),
('tr', 'kalite-sistemi', 'Kalite Sistemi', 'ISO 9001:2015 kalite standartlarında üretim yapan firmamız, müşteri memnuniyetini en üst düzeyde tutmayı hedeflemektedir.');

-- Insert sample content for English
INSERT INTO contents (language, page, title, body) VALUES
('en', 'hakkimizda', 'About Us', 'Doralp has been operating in the industrial steel structure sector since 1998, holding a leading position in the industry with its quality production and reliable service approach.'),
('en', 'fabrika', 'Our Factory', 'In our factory, which is the meeting point of modern technology and quality production, we carry out quality production with our experienced staff and state-of-the-art equipment.'),
('en', 'kalite-sistemi', 'Quality System', 'Our company, which produces according to ISO 9001:2015 quality standards, aims to keep customer satisfaction at the highest level.');

-- Insert sample machine park data
INSERT INTO machine_park (quantity, type, technical_specifications, model, brand, is_local, capacity) VALUES
(2, 'CNC Plazma Kesim Makinesi', 'Yüksek hassasiyetli kesim, 6-200mm kalınlık', 'PM-2000', 'TechCut', false, '2000x6000mm'),
(3, 'MIG/MAG Kaynak Makinesi', 'Otomatik kaynak sistemi, çok pozisyonlu', 'WM-500', 'WeldPro', true, '500A'),
(1, 'Hidrolik Pres', 'CNC kontrollü bükme ve şekillendirme', 'HP-3000', 'PressMaster', false, '3000 ton'),
(2, 'Köprü Vinç', 'Güvenlik sistemli kaldırma ekipmanı', 'BC-50', 'CraneTech', true, '50 ton');

-- Insert sample safety data
INSERT INTO safety (title, description, seo_description) VALUES
('Kişisel Koruyucu Donanım', 'Tüm çalışanlarımız için zorunlu KKD kullanımı ve düzenli kontrolleri yapılmaktadır.', 'İş güvenliği kapsamında kişisel koruyucu donanım kullanımı'),
('Güvenlik Eğitimleri', 'Düzenli güvenlik eğitimleri ve sertifikasyon programları ile çalışan güvenliği sağlanmaktadır.', 'İş güvenliği eğitimleri ve sertifikasyon programları'),
('Risk Değerlendirmesi', 'Sürekli risk analizi ve önleyici tedbirler ile güvenli çalışma ortamı oluşturulmaktadır.', 'İş güvenliği risk değerlendirmesi ve önleyici tedbirler');

-- Insert sample quality system data
INSERT INTO quality_system (section, title, description) VALUES
('altbaslik1', 'ISO 9001:2015', 'Kalite Yönetim Sistemi sertifikamız ile uluslararası standartlarda üretim yapıyoruz.'),
('altbaslik2', 'Kalite Kontrol', 'Her üretim aşamasında titiz kalite kontrol süreçleri uygulanmaktadır.'),
('altbaslik3', 'Müşteri Memnuniyeti', 'Müşteri geri bildirimlerini değerlendirerek sürekli iyileştirme sağlıyoruz.'),
('altbaslik4', 'Sürekli Gelişim', 'Teknoloji ve süreçlerimizi sürekli geliştirerek kalite standartlarımızı yükseltiyoruz.');
