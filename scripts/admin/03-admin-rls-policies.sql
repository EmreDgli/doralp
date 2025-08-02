-- Enable Row Level Security on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can view all admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.role = 'super_admin' AND au.is_active = true
        )
    );

-- Contents policies
CREATE POLICY "Admins can manage contents" ON contents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Projects policies
CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Project images policies
CREATE POLICY "Admins can manage project images" ON project_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Slides policies
CREATE POLICY "Admins can manage slides" ON slides
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Machine park policies
CREATE POLICY "Admins can manage machine park" ON machine_park
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Safety policies
CREATE POLICY "Admins can manage safety" ON safety
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Quality system policies
CREATE POLICY "Admins can manage quality system" ON quality_system
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Gallery categories policies
CREATE POLICY "Admins can manage gallery categories" ON gallery_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Gallery images policies
CREATE POLICY "Admins can manage gallery images" ON gallery_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Contact messages policies
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage contact messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "Admins can update contact messages" ON contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- Admin activity log policies
CREATE POLICY "Admins can view activity log" ON admin_activity_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

CREATE POLICY "System can insert activity log" ON admin_activity_log
    FOR INSERT WITH CHECK (true);
