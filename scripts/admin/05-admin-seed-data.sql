-- Insert sample gallery categories
INSERT INTO gallery_categories (title, slug, sort_order, created_by) VALUES
('Ürün Kabul', 'urun-kabul', 1, NULL),
('Kumlama & Shop Primer', 'kumlama-shop-primer', 2, NULL),
('Kesim', 'kesim', 3, NULL),
('Delik Delme', 'delik-delme', 4, NULL),
('Ölçüm & Montaj', 'olcum-montaj', 5, NULL),
('Kaynak', 'kaynak', 6, NULL),
('Mekanik Temizlik', 'mekanik-temizlik', 7, NULL),
('NDT', 'ndt', 8, NULL),
('Boyama', 'boyama', 9, NULL),
('Sevkiyat', 'sevkiyat', 10, NULL),
('Saha Montajı', 'saha-montaji', 11, NULL);

-- Insert sample content for Turkish
INSERT INTO contents (language, page, title, body, meta_title, meta_description, created_by, updated_by) VALUES
('tr', 'hakkimizda', 'Hakkımızda', 'Doralp, 1998 yılından bu yana endüstriyel çelik yapı sektöründe faaliyet gösteren, kaliteli üretim ve güvenilir hizmet anlayışıyla sektörde öncü konumda yer alan bir firmadır.', 'Doralp Hakkımızda', 'Doralp şirketi hakkında bilgiler, tarihçe ve vizyon', NULL, NULL),
('tr', 'fabrika', 'Fabrikamız', 'Modern teknoloji ve kaliteli üretimin buluşma noktası olan fabrikamızda, deneyimli kadromuz ve son teknoloji ekipmanlarımızla kaliteli üretim gerçekleştiriyoruz.', 'Doralp Fabrika', 'Doralp fabrika tesisleri ve üretim kapasitesi', NULL, NULL),
('tr', 'kalite-sistemi', 'Kalite Sistemi', 'ISO 9001:2015 kalite standartlarında üretim yapan firmamız, müşteri memnuniyetini en üst düzeyde tutmayı hedeflemektedir.', 'Doralp Kalite Sistemi', 'ISO 9001:2015 kalite yönetim sistemi ve standartları', NULL, NULL);

-- Insert sample content for English
INSERT INTO contents (language, page, title, body, meta_title, meta_description, created_by, updated_by) VALUES
('en', 'hakkimizda', 'About Us', 'Doralp has been operating in the industrial steel structure sector since 1998, holding a leading position in the industry with its quality production and reliable service approach.', 'About Doralp', 'Information about Doralp company, history and vision', NULL, NULL),
('en', 'fabrika', 'Our Factory', 'In our factory, which is the meeting point of modern technology and quality production, we carry out quality production with our experienced staff and state-of-the-art equipment.', 'Doralp Factory', 'Doralp factory facilities and production capacity', NULL, NULL),
('en', 'kalite-sistemi', 'Quality System', 'Our company, which produces according to ISO 9001:2015 quality standards, aims to keep customer satisfaction at the highest level.', 'Doralp Quality System', 'ISO 9001:2015 quality management system and standards', NULL, NULL);

-- Insert sample machine park data
INSERT INTO machine_park (name, quantity, type, technical_specifications, model, brand, is_local, capacity, created_by, updated_by) VALUES
('CNC Plazma Kesim Makinesi', 2, 'Kesim Makinesi', 'Yüksek hassasiyetli kesim, 6-200mm kalınlık', 'PM-2000', 'TechCut', false, '2000x6000mm', NULL, NULL),
('MIG/MAG Kaynak Makinesi', 3, 'Kaynak Makinesi', 'Otomatik kaynak sistemi, çok pozisyonlu', 'WM-500', 'WeldPro', true, '500A', NULL, NULL),
('Hidrolik Pres', 1, 'Şekillendirme Makinesi', 'CNC kontrollü bükme ve şekillendirme', 'HP-3000', 'PressMaster', false, '3000 ton', NULL, NULL),
('Köprü Vinç', 2, 'Kaldırma Ekipmanı', 'Güvenlik sistemli kaldırma ekipmanı', 'BC-50', 'CraneTech', true, '50 ton', NULL, NULL);

-- Insert sample safety data
INSERT INTO safety (title, description, content, sort_order, created_by, updated_by) VALUES
('Kişisel Koruyucu Donanım', 'Tüm çalışanlarımız için zorunlu KKD kullanımı', 'Tüm çalışanlarımız için zorunlu KKD kullanımı ve düzenli kontrolleri yapılmaktadır. Güvenlik kaskı, koruyucu gözlük, iş eldivenleri ve güvenlik ayakkabısı kullanımı zorunludur.', 1, NULL, NULL),
('Güvenlik Eğitimleri', 'Düzenli güvenlik eğitimleri ve sertifikasyon programları', 'Düzenli güvenlik eğitimleri ve sertifikasyon programları ile çalışan güvenliği sağlanmaktadır. İş güvenliği, ilk yardım ve yangın güvenliği eğitimleri verilmektedir.', 2, NULL, NULL),
('Risk Değerlendirmesi', 'Sürekli risk analizi ve önleyici tedbirler', 'Sürekli risk analizi ve önleyici tedbirler ile güvenli çalışma ortamı oluşturulmaktadır. Düzenli denetimler ve risk haritalaması yapılmaktadır.', 3, NULL, NULL);

-- Insert sample quality system data
INSERT INTO quality_system (section, title, description, content, sort_order, created_by, updated_by) VALUES
('altbaslik1', 'ISO 9001:2015', 'Kalite Yönetim Sistemi', 'Kalite Yönetim Sistemi sertifikamız ile uluslararası standartlarda üretim yapıyoruz. Sürekli iyileştirme ilkesiyle hareket ediyoruz.', 1, NULL, NULL),
('altbaslik2', 'Kalite Kontrol', 'Her üretim aşamasında titiz kalite kontrol', 'Her üretim aşamasında titiz kalite kontrol süreçleri uygulanmaktadır. Hammadde girişinden son ürün çıkışına kadar her aşama kontrol edilir.', 2, NULL, NULL),
('altbaslik3', 'Müşteri Memnuniyeti', 'Müşteri odaklı hizmet anlayışı', 'Müşteri geri bildirimlerini değerlendirerek sürekli iyileştirme sağlıyoruz. Müşteri memnuniyeti bizim önceliğimizdir.', 3, NULL, NULL),
('altbaslik4', 'Sürekli Gelişim', 'Teknoloji ve süreç geliştirme', 'Teknoloji ve süreçlerimizi sürekli geliştirerek kalite standartlarımızı yükseltiyoruz. Ar-Ge çalışmalarına önem veriyoruz.', 4, NULL, NULL);

-- Insert sample homepage slides
INSERT INTO slides (title, subtitle, description, button_text, button_url, sort_order, language, created_by, updated_by) VALUES
('Endüstriyel Çelik Yapı Çözümleri', '25+ yıllık deneyimle güvenilir hizmet', 'Modern teknoloji ve deneyimli kadromuzla endüstriyel çelik yapı projelerinizde yanınızdayız.', 'Projelerimizi İnceleyin', '/projeler', 1, 'tr', NULL, NULL),
('Kaliteli Üretim, Güvenilir Hizmet', 'ISO 9001:2015 kalite standartları', 'Kalite yönetim sistemimiz ile müşteri memnuniyetini en üst düzeyde tutuyoruz.', 'Hakkımızda', '/hakkimizda', 2, 'tr', NULL, NULL),
('Modern Fabrika Tesisleri', 'Son teknoloji makine parkı', 'Modern üretim tesislerimizde en kaliteli ürünleri üretiyoruz.', 'Fabrikamızı Keşfedin', '/fabrika', 3, 'tr', NULL, NULL);
