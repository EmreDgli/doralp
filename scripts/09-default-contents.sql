-- Default content for Turkish pages
INSERT INTO contents (language, page, title, body) VALUES
('tr', 'home', 'Doralp Yapı', 'Kaliteli inşaat çözümleri sunan, güvenilir ve deneyimli bir firmayız. Müşteri memnuniyetini ön planda tutarak, her projede en iyi sonuçları hedefliyoruz.'),
('tr', 'about', 'Hakkımızda', 'Doralp Yapı olarak, inşaat sektöründe uzun yıllara dayanan deneyimimizle müşterilerimize en kaliteli hizmeti sunmaya devam ediyoruz. Modern teknoloji ve geleneksel ustalık birleştiren yaklaşımımızla her projeyi özenle gerçekleştiriyoruz.'),
('tr', 'services', 'Hizmetlerimiz', 'Geniş hizmet yelpazemizle inşaat sektörünün her alanında çözüm ortağınızız. Konut projelerinden ticari yapılara, altyapı çalışmalarından özel tasarımlara kadar her alanda uzman ekibimizle hizmet veriyoruz.'),
('tr', 'projects', 'Projelerimiz', 'Gerçekleştirdiğimiz başarılı projelerle sektörde öncü konumumuzu sürdürüyoruz. Her projenin kendine özgü ihtiyaçlarını anlayarak, yaratıcı ve fonksiyonel çözümler üretiyoruz.'),
('tr', 'footer', 'Doralp Yapı', 'Kalite, güven ve müşteri memnuniyeti odaklı çalışma prensiplerimizle inşaat sektörünün lider firmalarından biriyiz.'),
('tr', 'general', 'Hoş Geldiniz', 'Doralp Yapı ailesine hoş geldiniz. Kaliteli hizmet ve güvenilir çözümler için doğru adrestesiniz.');

-- Default content for English pages  
INSERT INTO contents (language, page, title, body) VALUES
('en', 'home', 'Doralp Construction', 'We are a reliable and experienced company providing quality construction solutions. We prioritize customer satisfaction and aim for the best results in every project.'),
('en', 'about', 'About Us', 'As Doralp Construction, we continue to provide the highest quality service to our customers with our years of experience in the construction industry. We carefully execute every project with our approach that combines modern technology and traditional craftsmanship.'),
('en', 'services', 'Our Services', 'With our wide range of services, we are your solution partner in every field of the construction industry. We serve with our expert team in every field from residential projects to commercial buildings, from infrastructure works to special designs.'),
('en', 'projects', 'Our Projects', 'We maintain our leading position in the industry with the successful projects we have implemented. We understand the unique needs of each project and produce creative and functional solutions.'),
('en', 'footer', 'Doralp Construction', 'We are one of the leading companies in the construction industry with our working principles focused on quality, trust and customer satisfaction.'),
('en', 'general', 'Welcome', 'Welcome to the Doralp Construction family. You are at the right address for quality service and reliable solutions.');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for contents table
CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();