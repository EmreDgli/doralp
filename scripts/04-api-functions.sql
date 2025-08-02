-- RPC Functions for API endpoints

-- Get contents by language and page
CREATE OR REPLACE FUNCTION get_content(p_language language_enum, p_page VARCHAR)
RETURNS TABLE (
    id UUID,
    language language_enum,
    page VARCHAR,
    title VARCHAR,
    body TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.language, c.page, c.title, c.body, c.created_at, c.updated_at
    FROM contents c
    WHERE c.language = p_language AND c.page = p_page;
END;
$$;

-- Get projects with pagination
CREATE OR REPLACE FUNCTION get_projects(
    p_language language_enum DEFAULT NULL,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    description TEXT,
    date DATE,
    language language_enum,
    location VARCHAR,
    category VARCHAR,
    image_count BIGINT,
    primary_image VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.date,
        p.language,
        p.location,
        p.category,
        COALESCE(img_count.count, 0) as image_count,
        primary_img.image_url as primary_image,
        p.created_at
    FROM projects p
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
    ORDER BY p.date DESC, p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Get gallery with categories and images
CREATE OR REPLACE FUNCTION get_gallery()
RETURNS TABLE (
    category_id UUID,
    category_title VARCHAR,
    category_slug VARCHAR,
    category_sort_order INTEGER,
    image_id UUID,
    image_url VARCHAR,
    image_alt_text VARCHAR,
    image_sort_order INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gc.id as category_id,
        gc.title as category_title,
        gc.slug as category_slug,
        gc.sort_order as category_sort_order,
        gi.id as image_id,
        gi.image_url,
        gi.alt_text as image_alt_text,
        gi.sort_order as image_sort_order
    FROM gallery_categories gc
    LEFT JOIN gallery_images gi ON gc.id = gi.category_id AND gi.is_active = true
    WHERE gc.is_active = true
    ORDER BY gc.sort_order, gi.sort_order;
END;
$$;

-- Get machine park items
CREATE OR REPLACE FUNCTION get_machine_park()
RETURNS TABLE (
    id UUID,
    quantity INTEGER,
    type VARCHAR,
    technical_specifications TEXT,
    model VARCHAR,
    brand VARCHAR,
    is_local BOOLEAN,
    is_imported BOOLEAN,
    capacity VARCHAR,
    image_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id,
        mp.quantity,
        mp.type,
        mp.technical_specifications,
        mp.model,
        mp.brand,
        mp.is_local,
        mp.is_imported,
        mp.capacity,
        mp.image_url,
        mp.created_at
    FROM machine_park mp
    ORDER BY mp.type, mp.brand;
END;
$$;

-- Get active slides for homepage
CREATE OR REPLACE FUNCTION get_active_slides()
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    subtitle VARCHAR,
    image_url VARCHAR,
    button_text VARCHAR,
    button_url VARCHAR,
    sort_order INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.subtitle,
        s.image_url,
        s.button_text,
        s.button_url,
        s.sort_order
    FROM slides s
    WHERE s.is_active = true
    ORDER BY s.sort_order;
END;
$$;

-- Submit contact message
CREATE OR REPLACE FUNCTION submit_contact_message(
    p_name VARCHAR,
    p_surname VARCHAR,
    p_email VARCHAR,
    p_subject VARCHAR,
    p_message TEXT,
    p_approved_kvkk BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO contact_messages (name, surname, email, subject, message, approved_kvkk)
    VALUES (p_name, p_surname, p_email, p_subject, p_message, p_approved_kvkk)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$;

-- Get contact messages with pagination (admin only)
CREATE OR REPLACE FUNCTION get_contact_messages(
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0,
    p_unread_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    surname VARCHAR,
    email VARCHAR,
    subject VARCHAR,
    message TEXT,
    approved_kvkk BOOLEAN,
    is_read BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is authenticated
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        cm.id,
        cm.name,
        cm.surname,
        cm.email,
        cm.subject,
        cm.message,
        cm.approved_kvkk,
        cm.is_read,
        cm.created_at
    FROM contact_messages cm
    WHERE (NOT p_unread_only OR cm.is_read = false)
    ORDER BY cm.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Mark contact message as read
CREATE OR REPLACE FUNCTION mark_message_as_read(p_message_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is authenticated
    IF auth.role() != 'authenticated' THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE contact_messages 
    SET is_read = true 
    WHERE id = p_message_id;
    
    RETURN FOUND;
END;
$$;
