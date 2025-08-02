-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
DECLARE
    admin_id_val UUID;
BEGIN
    -- Get current admin user ID
    admin_id_val := auth.uid();
    
    IF admin_id_val IS NOT NULL THEN
        INSERT INTO admin_activity_log (
            admin_id,
            action,
            table_name,
            record_id,
            old_values,
            new_values
        ) VALUES (
            admin_id_val,
            TG_OP,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
            CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slides_updated_at BEFORE UPDATE ON slides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machine_park_updated_at BEFORE UPDATE ON machine_park
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_updated_at BEFORE UPDATE ON safety
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_system_updated_at BEFORE UPDATE ON quality_system
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_categories_updated_at BEFORE UPDATE ON gallery_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create activity logging triggers
CREATE TRIGGER log_contents_activity AFTER INSERT OR UPDATE OR DELETE ON contents
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_projects_activity AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_slides_activity AFTER INSERT OR UPDATE OR DELETE ON slides
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

-- Function to handle new admin user creation
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new admin user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();
