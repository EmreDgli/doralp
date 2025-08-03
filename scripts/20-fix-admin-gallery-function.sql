-- get_admin_gallery fonksiyonunu düzelt - NULL created_by değerlerini handle et
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
        COALESCE(gcb.full_name, 'System') as category_created_by,
        gi.id as image_id,
        gi.image_url,
        gi.alt_text as image_alt_text,
        gi.sort_order as image_sort_order,
        gi.is_active as image_is_active,
        gi.file_size as image_file_size,
        COALESCE(gib.full_name, 'System') as image_created_by
    FROM gallery_categories gc
    LEFT JOIN admin_users gcb ON gc.created_by = gcb.id
    LEFT JOIN gallery_images gi ON gc.id = gi.category_id
    LEFT JOIN admin_users gib ON gi.created_by = gib.id
    ORDER BY gc.sort_order, gi.sort_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 