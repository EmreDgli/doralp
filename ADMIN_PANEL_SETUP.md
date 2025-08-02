# Doralp Admin Panel - Supabase Backend Setup

## Overview
This document provides complete setup instructions for the Supabase backend infrastructure specifically designed for the Doralp website admin panel accessible at `/admin`.

## Features
- **Secure Admin Authentication**: JWT-based auth with admin-only access
- **Complete CRUD Operations**: Full content management capabilities
- **Activity Logging**: Track all admin actions and changes
- **File Upload Management**: Secure image upload with validation
- **Multi-language Support**: Turkish and English content management
- **Dashboard Analytics**: Real-time statistics and insights

## 1. Database Schema

### Core Tables
- **admin_users**: Admin user profiles and roles
- **contents**: Multi-language page content
- **projects**: Project showcase with images
- **slides**: Homepage carousel management
- **machine_park**: Equipment inventory
- **safety**: Safety information and procedures
- **quality_system**: Quality management content
- **gallery_categories**: Gallery organization
- **gallery_images**: Image management
- **contact_messages**: Contact form submissions
- **admin_activity_log**: Audit trail for all admin actions

### Key Features
- **Row Level Security (RLS)**: All tables protected with admin-only policies
- **Audit Trail**: Automatic logging of all admin actions
- **Soft Deletes**: Archive functionality for important data
- **Optimized Indexes**: Fast queries for admin operations

## 2. Setup Instructions

### Step 1: Run SQL Scripts
Execute these scripts in order in Supabase SQL Editor:

1. `scripts/admin/01-create-admin-schema.sql` - Create all tables and relationships
2. `scripts/admin/02-create-admin-functions.sql` - Create triggers and utility functions
3. `scripts/admin/03-admin-rls-policies.sql` - Set up security policies
4. `scripts/admin/04-admin-api-functions.sql` - Create RPC functions for complex queries
5. `scripts/admin/05-admin-seed-data.sql` - Insert sample data

### Step 2: Configure Storage
Create these storage buckets in Supabase Dashboard:

1. **admin-images** (public)
   - Max file size: 5MB
   - Allowed types: image/jpeg, image/png, image/webp
   - Folder structure: projects/, gallery/, slides/, general/

2. **admin-documents** (public)
   - Max file size: 10MB
   - Allowed types: application/pdf

### Step 3: Create Admin User
\`\`\`sql
-- Create first admin user (run in SQL Editor)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@doralp.com.tr',
  crypt('your_secure_password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Admin User"}'::jsonb
);
\`\`\`

### Step 4: Environment Variables
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## 3. API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin user

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/activity` - Get admin activity log

### Content Management
- `GET /api/admin/contents` - List contents with pagination
- `POST /api/admin/contents` - Create new content
- `GET /api/admin/contents/[id]` - Get specific content
- `PUT /api/admin/contents/[id]` - Update content
- `DELETE /api/admin/contents/[id]` - Delete content

### Project Management
- `GET /api/admin/projects` - List projects with filters
- `POST /api/admin/projects` - Create new project
- `GET /api/admin/projects/[id]` - Get project with images
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project
- `POST /api/admin/projects/[id]/images` - Add project image
- `DELETE /api/admin/projects/images/[id]` - Delete project image

### File Upload
- `POST /api/admin/upload` - Upload images with validation

### Contact Messages
- `GET /api/admin/messages` - List contact messages
- `PUT /api/admin/messages/[id]` - Update message status
- `DELETE /api/admin/messages/[id]` - Archive message

### Gallery Management
- `GET /api/admin/gallery` - Get gallery with categories and images
- `POST /api/admin/gallery/categories` - Create gallery category
- `PUT /api/admin/gallery/categories/[id]` - Update category
- `DELETE /api/admin/gallery/categories/[id]` - Delete category
- `POST /api/admin/gallery/images` - Add gallery image
- `DELETE /api/admin/gallery/images/[id]` - Delete gallery image

### Slides Management
- `GET /api/admin/slides` - List homepage slides
- `POST /api/admin/slides` - Create new slide
- `PUT /api/admin/slides/[id]` - Update slide
- `DELETE /api/admin/slides/[id]` - Delete slide
- `PUT /api/admin/slides/sort` - Update slide order

## 4. Security Features

### Authentication & Authorization
- **JWT Token Validation**: All admin endpoints require valid JWT tokens
- **Admin Role Verification**: Only users in admin_users table can access admin features
- **Session Management**: Secure session handling with automatic token refresh

### Row Level Security Policies
\`\`\`sql
-- Example policy for contents table
CREATE POLICY "Admins can manage contents" ON contents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );
\`\`\`

### File Upload Security
- **File Type Validation**: Only JPEG, PNG, WebP images allowed
- **File Size Limits**: Maximum 5MB per image
- **Secure File Naming**: UUID-based file names to prevent conflicts
- **Path Sanitization**: Prevent directory traversal attacks

### Activity Logging
All admin actions are automatically logged with:
- Admin user ID and name
- Action type (INSERT, UPDATE, DELETE)
- Table and record affected
- Timestamp and IP address
- Old and new values for audit trail

## 5. Usage Examples

### Admin Login
\`\`\`typescript
import { adminAuth } from '@/lib/admin-api'

const handleLogin = async (email: string, password: string) => {
  try {
    const result = await adminAuth.signIn(email, password)
    console.log('Logged in:', result.adminUser)
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
\`\`\`

### Content Management
\`\`\`typescript
import { adminContentApi } from '@/lib/admin-api'

// Get contents with pagination
const contents = await adminContentApi.getContents({
  language: 'tr',
  limit: 10,
  offset: 0
})

// Create new content
const newContent = await adminContentApi.createContent({
  language: 'tr',
  page: 'test-page',
  title: 'Test Title',
  body: 'Test content body',
  meta_title: 'SEO Title',
  meta_description: 'SEO Description'
})
\`\`\`

### Project Management
\`\`\`typescript
import { adminProjectsApi } from '@/lib/admin-api'

// Get projects with filters
const projects = await adminProjectsApi.getProjects({
  language: 'tr',
  isPublished: true,
  limit: 20
})

// Add project image
const projectImage = await adminProjectsApi.addProjectImage(projectId, {
  image_url: 'https://example.com/image.jpg',
  alt_text: 'Project image',
  is_primary: true
})
\`\`\`

### File Upload
\`\`\`typescript
import { adminStorageApi } from '@/lib/admin-api'

const handleFileUpload = async (file: File) => {
  try {
    const result = await adminStorageApi.uploadImage(
      file,
      'admin-images',
      'projects'
    )
    console.log('Upload successful:', result.url)
  } catch (error) {
    console.error('Upload failed:', error.message)
  }
}
\`\`\`

## 6. Dashboard Statistics

The admin dashboard provides real-time statistics:

\`\`\`typescript
import { dashboardApi } from '@/lib/admin-api'

const stats = await dashboardApi.getStats()
// Returns:
// {
//   total_projects: 25,
//   published_projects: 20,
//   total_contents: 15,
//   unread_messages: 3,
//   total_gallery_images: 150,
//   active_slides: 5,
//   machine_count: 12
// }
\`\`\`

## 7. Error Handling

All API functions include comprehensive error handling:

\`\`\`typescript
try {
  const result = await adminContentApi.createContent(contentData)
} catch (error) {
  if (error.message.includes('Access denied')) {
    // Handle authentication error
    router.push('/admin/login')
  } else if (error.message.includes('duplicate key')) {
    // Handle validation error
    setError('Content with this page already exists')
  } else {
    // Handle general error
    setError('An unexpected error occurred')
  }
}
\`\`\`

## 8. Performance Optimization

### Database Indexes
All frequently queried columns have indexes:
- `contents(language, page)`
- `projects(language, is_published, date)`
- `contact_messages(is_read, created_at)`
- `admin_activity_log(admin_id, created_at)`

### Pagination
All list endpoints support pagination:
\`\`\`typescript
const contents = await adminContentApi.getContents({
  limit: 20,
  offset: page * 20
})
\`\`\`

### Caching Strategy
- Static content cached for 1 hour
- Dashboard stats cached for 5 minutes
- User sessions cached until expiry

## 9. Monitoring & Maintenance

### Health Checks
Monitor these key metrics:
- Database connection pool usage
- Storage bucket usage
- API response times
- Authentication success rates

### Backup Strategy
- Automatic daily database backups
- Weekly full system backups
- Image storage replication

### Log Monitoring
Monitor logs for:
- Failed authentication attempts
- Unusual admin activity patterns
- File upload errors
- Database query performance

## 10. Production Deployment

### Environment Configuration
\`\`\`env
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# Security settings
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
\`\`\`

### Security Checklist
- [ ] Enable database SSL connections
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting on API endpoints
- [ ] Enable audit logging
- [ ] Configure backup retention policies
- [ ] Set up monitoring alerts

### Performance Tuning
- Enable connection pooling
- Configure CDN for static assets
- Set up database query optimization
- Implement Redis caching for sessions

This completes the comprehensive Supabase backend setup for the Doralp admin panel. The system is now ready for production use with full security, monitoring, and maintenance capabilities.
