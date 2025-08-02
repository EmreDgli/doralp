# Doralp Website - Supabase Backend Setup

## Overview
This document provides complete setup instructions for the Supabase backend infrastructure for the Doralp corporate website.

## Prerequisites
- Supabase account
- Node.js 18+ installed
- Basic knowledge of SQL and Supabase

## 1. Supabase Project Setup

### Create New Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details:
   - Name: `doralp-website`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users

### Get Project Credentials
After project creation, go to Settings > API:
- Project URL: `https://your-project-id.supabase.co`
- Anon Key: `eyJ...` (public key)
- Service Role Key: `eyJ...` (secret key - keep secure)

## 2. Database Setup

### Run SQL Scripts
Execute the following scripts in order in the Supabase SQL Editor:

1. **Create Tables**: Run `scripts/01-create-tables.sql`
2. **Create Functions**: Run `scripts/02-create-functions.sql`
3. **Setup RLS Policies**: Run `scripts/03-rls-policies.sql`
4. **Create API Functions**: Run `scripts/04-api-functions.sql`
5. **Seed Data**: Run `scripts/05-seed-data.sql`

### Verify Setup
Check that all tables are created:
- contents
- projects
- project_images
- slides
- machine_park
- safety
- quality_system
- gallery_categories
- gallery_images
- contact_messages

## 3. Storage Setup

### Create Storage Buckets
In Supabase Dashboard > Storage, create these buckets:

1. **images** (public)
   - Max file size: 5MB
   - Allowed file types: image/jpeg, image/png, image/webp

2. **documents** (public)
   - Max file size: 10MB
   - Allowed file types: application/pdf

### Storage Policies
For each bucket, create policies:
- **SELECT**: Allow public read access
- **INSERT**: Allow authenticated users only
- **UPDATE**: Allow authenticated users only
- **DELETE**: Allow authenticated users only

## 4. Authentication Setup

### Configure Auth Settings
In Authentication > Settings:
- **Site URL**: `http://localhost:3000` (development) / `https://yourdomain.com` (production)
- **Redirect URLs**: Add your domain URLs
- **Email Auth**: Enable
- **Disable Sign-ups**: Enable (admin-only system)

### Create Admin User
1. Go to Authentication > Users
2. Click "Add User"
3. Enter admin email and password
4. Confirm email if required

## 5. Environment Variables

Create `.env.local` file in your Next.js project:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## 6. API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/content/[language]/[page]` - Get page content
- `GET /api/projects` - Get projects list
- `GET /api/gallery` - Get gallery with categories
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Auth Required)
- All CRUD operations on database tables
- File upload/delete operations
- Contact message management

## 7. Usage Examples

### Frontend Data Fetching
\`\`\`typescript
// Get page content
const content = await fetch('/api/content/tr/hakkimizda').then(r => r.json())

// Get projects
const projects = await fetch('/api/projects?language=tr&limit=6').then(r => r.json())

// Submit contact form
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    subject: 'Test',
    message: 'Test message',
    approved_kvkk: true
  })
})
\`\`\`

### Admin Operations
\`\`\`typescript
import { supabase } from '@/lib/supabase'

// Admin login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@doralp.com.tr',
  password: 'your_password'
})

// Create content (requires auth)
const { data, error } = await supabase
  .from('contents')
  .insert({
    language: 'tr',
    page: 'test',
    title: 'Test Title',
    body: 'Test content'
  })
\`\`\`

## 8. Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Only authenticated users can modify data
- Contact form submissions allowed for anonymous users

### API Security
- JWT token validation on all admin endpoints
- Input validation and sanitization
- SQL injection protection via parameterized queries

### File Upload Security
- File type restrictions
- File size limits (5MB for images)
- Secure file naming and storage

## 9. Monitoring & Maintenance

### Database Monitoring
- Monitor query performance in Supabase Dashboard
- Check storage usage regularly
- Review authentication logs

### Backup Strategy
- Supabase provides automatic backups
- Consider additional backup strategy for production

### Performance Optimization
- Database indexes are created for common queries
- Use pagination for large datasets
- Optimize image sizes and formats

## 10. Troubleshooting

### Common Issues
1. **RLS Policy Errors**: Ensure user is authenticated
2. **CORS Issues**: Check site URL in auth settings
3. **File Upload Fails**: Verify storage policies and file size limits
4. **API Errors**: Check Supabase logs in dashboard

### Support
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create issues in project repository

## 11. Production Deployment

### Environment Setup
1. Update environment variables with production URLs
2. Configure custom domain if needed
3. Set up SSL certificates
4. Update CORS settings

### Performance Considerations
- Enable database connection pooling
- Configure CDN for static assets
- Monitor and optimize slow queries
- Set up database backups

This completes the Supabase backend setup for the Doralp website. The system is now ready for integration with the Next.js frontend and admin panel.
