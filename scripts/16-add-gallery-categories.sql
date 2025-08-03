-- Galeri kategorilerini ekle - Üretim süreçleri
INSERT INTO gallery_categories (title, slug, sort_order, is_active) 
VALUES
('Ürün Kabul', 'urun-kabul', 1, true),
('Kumlama & Shop Primer', 'kumlama-shop-primer', 2, true),
('Kesim', 'kesim', 3, true),
('Delik Delme', 'delik-delme', 4, true),
('Ölçüm & Montaj', 'olcum-montaj', 5, true),
('Kaynak', 'kaynak', 6, true),
('Mekanik Temizlik', 'mekanik-temizlik', 7, true),
('NDT', 'ndt', 8, true),
('Boyama', 'boyama', 9, true),
('Sevkiyat', 'sevkiyat', 10, true),
('Saha Montajı', 'saha-montaji', 11, true)
ON CONFLICT (slug) DO NOTHING; 