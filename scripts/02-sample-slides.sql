-- Sample slides data for homepage carousel
INSERT INTO slides (
  title, 
  subtitle, 
  image_url, 
  button_text, 
  button_url, 
  is_active, 
  sort_order
) VALUES 
(
  'Endüstriyel Çelik Yapı Çözümleri',
  '25+ yıllık deneyimimizle endüstriyel çelik yapı, fabrika inşaatı ve proje yönetimi alanında güvenilir çözümler sunuyoruz.',
  'https://YOUR_SUPABASE_URL/storage/v1/object/public/images/slider-images/herosection-doralp-foto.jpg',
  'Projelerimizi İnceleyin',
  '/projeler',
  true,
  0
),
(
  'Kaliteli ve Güvenilir Üretim',
  'Modern teknoloji ve deneyimli ekibimizle, yüksek kaliteli çelik yapı çözümleri üretiyoruz.',
  'https://YOUR_SUPABASE_URL/storage/v1/object/public/images/slider-images/herosection-doralp-foto.jpg',
  'Fabrikamızı Görün',
  '/fabrika',
  true,
  1
),
(
  'Yeni Projeler İçin Bizimle İletişime Geçin',
  'Hayalinizdeki projeyi gerçekleştirmek için bugün bizimle iletişime geçin.',
  'https://YOUR_SUPABASE_URL/storage/v1/object/public/images/slider-images/herosection-doralp-foto.jpg',
  'İletişim',
  '/iletisim',
  true,
  2
);

-- Update slides table to include language support (optional for future use)
-- ALTER TABLE slides ADD COLUMN language language_enum DEFAULT 'tr';