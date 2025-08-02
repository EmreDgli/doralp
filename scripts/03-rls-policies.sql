-- Enable Row Level Security on all tables
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_park ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_system ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated admin users
-- Contents policies
CREATE POLICY "Admin can view all contents" ON contents
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert contents" ON contents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update contents" ON contents
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete contents" ON contents
    FOR DELETE USING (auth.role() = 'authenticated');

-- Projects policies
CREATE POLICY "Admin can view all projects" ON projects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert projects" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update projects" ON projects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete projects" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- Project images policies
CREATE POLICY "Admin can view all project_images" ON project_images
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert project_images" ON project_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update project_images" ON project_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete project_images" ON project_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Slides policies
CREATE POLICY "Admin can view all slides" ON slides
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert slides" ON slides
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update slides" ON slides
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete slides" ON slides
    FOR DELETE USING (auth.role() = 'authenticated');

-- Machine park policies
CREATE POLICY "Admin can view all machine_park" ON machine_park
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert machine_park" ON machine_park
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update machine_park" ON machine_park
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete machine_park" ON machine_park
    FOR DELETE USING (auth.role() = 'authenticated');

-- Safety policies
CREATE POLICY "Admin can view all safety" ON safety
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert safety" ON safety
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update safety" ON safety
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete safety" ON safety
    FOR DELETE USING (auth.role() = 'authenticated');

-- Quality system policies
CREATE POLICY "Admin can view all quality_system" ON quality_system
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert quality_system" ON quality_system
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update quality_system" ON quality_system
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete quality_system" ON quality_system
    FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery categories policies
CREATE POLICY "Admin can view all gallery_categories" ON gallery_categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert gallery_categories" ON gallery_categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update gallery_categories" ON gallery_categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete gallery_categories" ON gallery_categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery images policies
CREATE POLICY "Admin can view all gallery_images" ON gallery_images
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert gallery_images" ON gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update gallery_images" ON gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete gallery_images" ON gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Contact messages policies
CREATE POLICY "Admin can view all contact_messages" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert contact_messages" ON contact_messages
    FOR INSERT WITH CHECK (true); -- Allow anonymous contact form submissions

CREATE POLICY "Admin can update contact_messages" ON contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete contact_messages" ON contact_messages
    FOR DELETE USING (auth.role() = 'authenticated');
