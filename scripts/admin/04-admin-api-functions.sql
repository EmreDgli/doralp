-- Admin authentication check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT json_build_object(
        'total_projects', (SELECT COUNT(*) FROM projects),
        'published_projects', (SELECT COUNT(*) FROM projects WHERE is_published = true),
        'total_contents', (SELECT COUNT(*) FROM contents),
        'unread_messages', (SELECT COUNT(*) FROM contact_messages WHERE is_read = false),
        'total_gallery_images', (SELECT COUNT(*) FROM gallery_images WHERE is_active = true),
        'active_slides', (SELECT COUNT(*) FROM slides WHERE is_active = true),
        'machine_count', (SELECT COALESCE(SUM(quantity), 0) FROM machine_park WHERE is_active = true)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get contents with pagination and filtering
CREATE OR REPLACE FUNCTION get_admin_contents(
    p_language language_enum DEFAULT NULL,
    p_page VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    language language_enum,
    page VARCHAR,
    title VARCHAR,
    body TEXT,
    meta_title VARCHAR,
    meta_description TEXT,
    is_published BOOLEAN,
    created_by_name VARCHAR,
    updated_by_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        c.id,
        c.language,
        c.page,
        c.title,
        c.body,
        c.meta_title,
        c.meta_description,
        c.is_published,
        cb.full_name as created_by_name,
        ub.full_name as updated_by_name,
        c.created_at,
        c.updated_at,
        COUNT(*) OVER() as total_count
    FROM contents c
    LEFT JOIN admin_users cb ON c.created_by = cb.id
    LEFT JOIN admin_users ub ON c.updated_by = ub.id
    WHERE (p_language IS NULL OR c.language = p_language)
    AND (p_page IS NULL OR c.page ILIKE '%' || p_page || '%')
    ORDER BY c.updated_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get projects with pagination and filtering
CREATE OR REPLACE FUNCTION get_admin_projects(
    p_language language_enum DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_is_published BOOLEAN DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    short_description VARCHAR,
    date DATE,
    language language_enum,
    location VARCHAR,
    category VARCHAR,
    client_name VARCHAR,
    is_featured BOOLEAN,
    is_published BOOLEAN,
    image_count BIGINT,
    primary_image VARCHAR,
    created_by_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.short_description,
        p.date,
        p.language,
        p.location,
        p.category,
        p.client_name,
        p.is_featured,
        p.is_published,
        COALESCE(img_count.count, 0) as image_count,
        primary_img.image_url as primary_image,
        cb.full_name as created_by_name,
        p.created_at,
        COUNT(*) OVER() as total_count
    FROM projects p
    LEFT JOIN admin_users cb ON p.created_by = cb.id
    LEFT JOIN (
        SELECT project_id, COUNT(*) as count
        FROM project_images
        GROUP BY project_id
    ) img_count ON p.id = img_count.project_id
    LEFT JOIN (
        SELECT DISTINCT ON (project_id) project_id, image_url
        FROM project_images
        WHERE is_primary = true
        ORDER BY project_id, created_at
    ) primary_img ON p.id = primary_img.project_id
    WHERE (p_language IS NULL OR p.language = p_language)
    AND (p_category IS NULL OR p.category ILIKE '%' || p_category || '%')
    AND (p_is_published IS NULL OR p.is_published = p_is_published)
    ORDER BY p.date DESC, p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get contact messages with pagination
CREATE OR REPLACE FUNCTION get_admin_contact_messages(
    p_is_read BOOLEAN DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    surname VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    subject VARCHAR,
    message TEXT,
    approved_kvkv BOOLEAN,
    is_read BOOLEAN,
    is_archived BOOLEAN,
    admin_notes TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        cm.id,
        cm.name,
        cm.surname,
        cm.email,
        cm.phone,
        cm.subject,
        cm.message,
        cm.approved_kvkk,
        cm.is_read,
        cm.is_archived,
        cm.admin_notes,
        cm.replied_at,
        rb.full_name as replied_by_name,
        cm.created_at,
        COUNT(*) OVER() as total_count
    FROM contact_messages cm
    LEFT JOIN admin_users rb ON cm.replied_by = rb.id
    WHERE (p_is_read IS NULL OR cm.is_read = p_is_read)
    AND cm.is_archived = false
    ORDER BY cm.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update contact message status
CREATE OR REPLACE FUNCTION update_contact_message_status(
    p_message_id UUID,
    p_is_read BOOLEAN DEFAULT NULL,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE contact_messages 
    SET 
        is_read = COALESCE(p_is_read, is_read),
        admin_notes = COALESCE(p_admin_notes, admin_notes),
        replied_at = CASE WHEN p_is_read = true AND replied_at IS NULL THEN NOW() ELSE replied_at END,
        replied_by = CASE WHEN p_is_read = true AND replied_by IS NULL THEN auth.uid() ELSE replied_by END
    WHERE id = p_message_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get gallery with admin details
CREATE OR REPLACE FUNCTION get_admin_gallery()
RETURNS TABLE (
    category_id UUID,
    category_title VARCHAR,
    category_slug VARCHAR,
    category_sort_order INTEGER,
    category_is_active BOOLEAN,
    category_created_by VARCHAR,
    image_id UUID,
    image_url VARCHAR,
    image_alt_text VARCHAR,
    image_sort_order INTEGER,
    image_is_active BOOLEAN,
    image_file_size INTEGER,
    image_created_by VARCHAR
) AS $$
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        gc.id as category_id,
        gc.title as category_title,
        gc.slug as category_slug,
        gc.sort_order as category_sort_order,
        gc.is_active as category_is_active,
        gcb.full_name as category_created_by,
        gi.id as image_id,
        gi.image_url,
        gi.alt_text as image_alt_text,
        gi.sort_order as image_sort_order,
        gi.is_active as image_is_active,
        gi.file_size as image_file_size,
        gib.full_name as image_created_by
    FROM gallery_categories gc
    LEFT JOIN admin_users gcb ON gc.created_by = gcb.id
    LEFT JOIN gallery_images gi ON gc.id = gi.category_id
    LEFT JOIN admin_users gib ON gi.created_by = gib.id
    ORDER BY gc.sort_order, gi.sort_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get admin activity log
CREATE OR REPLACE FUNCTION get_admin_activity_log(
    p_admin_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    admin_name VARCHAR,
    admin_email VARCHAR,
    action VARCHAR,
    table_name VARCHAR,
    record_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        aal.id,
        au.full_name as admin_name,
        au.email as admin_email,
        aal.action,
        aal.table_name,
        aal.record_id,
        aal.created_at,
        COUNT(*) OVER() as total_count
    FROM admin_activity_log aal
    JOIN admin_users au ON aal.admin_id = au.id
    WHERE (p_admin_id IS NULL OR aal.admin_id = p_admin_id)
    ORDER BY aal.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bulk update sort orders
CREATE OR REPLACE FUNCTION update_sort_orders(
    p_table_name VARCHAR,
    p_updates JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    update_record JSONB;
BEGIN
    -- Check admin access
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    -- Validate table name
    IF p_table_name NOT IN ('slides', 'gallery_categories', 'gallery_images', 'safety', 'quality_system') THEN
        RAISE EXCEPTION 'Invalid table name';
    END IF;

    -- Update sort orders
    FOR update_record IN SELECT * FROM jsonb_array_elements(p_updates)
    LOOP
        EXECUTE format('UPDATE %I SET sort_order = $1, updated_at = NOW() WHERE id = $2', p_table_name)
        USING (update_record->>'sort_order')::INTEGER, (update_record->>'id')::UUID;
    END LOOP;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
