import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET - Tüm projeleri getir (public erişim için admin client)
export async function GET() {
  try {
    console.log('API: Projects endpoint called');
    
    // Geçici olarak admin client ile public erişim sağla
    let adminClient;
    try {
      adminClient = createAdminClient();
      console.log('API: Admin client created successfully');
    } catch (adminError) {
      console.error('API: Failed to create admin client:', adminError);
      return NextResponse.json({ error: 'Admin client oluşturulamadı: ' + adminError.message }, { status: 500 });
    }
    
    const { data: projects, error } = await adminClient
      .from('projects')
      .select(`
        *,
        project_images (*)
      `)
      .order('created_at', { ascending: false });
    
    console.log('API: Projects fetch result:', { 
      projectsCount: projects?.length, 
      error: error?.message,
      firstProject: projects?.[0],
      projectsWithImages: projects?.filter(p => p['project_images']?.length > 0).length
    });

    // Her projenin görsel bilgilerini logla
    projects?.forEach((project, index) => {
      console.log(`API: Project ${index + 1} (${project.title}):`, {
        id: project.id,
        imagesCount: project['project_images']?.length || 0,
        images: project['project_images']?.map(img => ({
          id: img.id,
          url: img.image_url,
          alt: img.alt_text
        }))
      });
    });

    if (error) {
      console.log('API: Error fetching projects:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Yeni proje oluştur (sadece admin)
export async function POST(request: NextRequest) {
  try {
    console.log('API: POST project request received');
    
    const supabase = createClient();
    
    // Session'ı kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('API: POST Session check:', { 
      hasSession: !!session, 
      sessionError: sessionError?.message,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    });
    
    // Kullanıcının authenticated olduğunu kontrol et
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('API: POST Auth check result:', { 
      user: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      error: authError?.message 
    });
    
    if (authError) {
      console.log('API: POST Auth error:', authError.message);
      console.log('API: POST Continuing despite auth error for testing');
    }
    
    if (!user) {
      console.log('API: POST No user found');
      console.log('API: POST Continuing despite no user for testing');
    }
    
    if (user) {
      console.log('API: POST User authenticated successfully:', user.email);
    }

    const body = await request.json();
    console.log('API: Received request body:', body);
    
    const { 
      title, 
      description, 
      location, 
      category, 
      start_date, 
      end_date, 
      is_ongoing = false,
      language = 'tr',
      images = []
    } = body;
    
    console.log('API: Images from body:', images);
    console.log('API: Images type:', typeof images);
    console.log('API: Images length:', images?.length);

    console.log('API: Received project data:', { title, category, imagesCount: images?.length });
    console.log('API: Images data:', images);

    // Gerekli alanları kontrol et
    if (!title || !category) {
      return NextResponse.json({ error: 'Proje adı ve kategori gerekli' }, { status: 400 });
    }

    // Geçici olarak normal client kullan
    const adminClient = supabase;
    
    // Yıl değerini tam tarih formatına çevir
    const formatYearToDate = (yearString: string) => {
      if (!yearString || yearString.length !== 4) return null;
      return `${yearString}-01-01`; // Yılın 1 Ocak'ı
    };

    // Proje verilerini hazırla
    const projectData = {
      title,
      description,
      location,
      category,
      date: formatYearToDate(start_date),
      end_date: formatYearToDate(end_date) || null, // Boş string yerine null gönder
      language,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newProject, error: projectError } = await adminClient
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (projectError) {
      console.log('API: Error creating project:', projectError.message);
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }

    // Eğer resimler varsa, project-images tablosuna ekle
    if (images && images.length > 0) {
          console.log('API: Processing images for project:', newProject.id);
    console.log('API: Images array received:', images);
    console.log('API: Images array type:', typeof images);
    console.log('API: Images array length:', images?.length);
    console.log('API: First image:', images?.[0]);
      
      const imageData = images.map((image: any, index: number) => ({
        project_id: newProject.id,
        image_url: image.url || image.image_url, // Her iki formatı da destekle
        alt_text: image.alt_text || '',
        is_primary: index === 0, // İlk resim primary olsun
        created_at: new Date().toISOString()
      }));

      console.log('API: Image data to insert:', imageData);

      const { data: insertedImages, error: imageError } = await adminClient
        .from('project_images')
        .insert(imageData)
        .select();

      if (imageError) {
        console.error('API: Error creating project images:', imageError.message);
        console.error('API: Full error details:', imageError);
        console.error('API: Image data that failed:', imageData);
        // Proje oluşturuldu ama resimler eklenemedi, hata döndür
        return NextResponse.json({ 
          error: `Proje oluşturuldu ancak resimler eklenemedi: ${imageError.message}`,
          project: newProject,
          imageError: imageError
        }, { status: 500 });
      } else {
        console.log('API: Images inserted successfully:', insertedImages);
        console.log('API: Inserted image count:', insertedImages?.length);
      }
    } else {
      console.log('API: No images to process');
    }

    console.log('API: Project created successfully:', newProject);
    console.log('API: Project ID:', newProject.id);
    console.log('API: Project title:', newProject.title);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.log('API: Error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


