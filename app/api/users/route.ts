import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET - Kullanıcıları listele (sadece admin)
export async function GET() {
  try {
    console.log('API: GET users request received');
    
    // Admin client ile kullanıcıları getir
    const adminClient = createAdminClient();
    console.log('API: Fetching users with admin client');
    
    // Supabase Admin API kullanarak kullanıcıları getir
    const { data: users, error } = await adminClient.auth.admin.listUsers();
    
    console.log('API: Users fetch result:', { usersCount: users?.users?.length, error: error?.message });

    if (error) {
      console.log('API: Error fetching users:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Kullanıcı verilerini düzenle ve gerekli bilgileri ekle
    const formattedUsers = users.users?.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      role: user.role || 'authenticated',
      is_super_admin: user.app_metadata?.is_super_admin || false,
      banned_until: user.banned_until,
      deleted_at: null // Supabase Auth bu alanı sağlamaz
    })) || [];

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.log('API: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Yeni kullanıcı oluştur (sadece admin)
export async function POST(request: NextRequest) {
  try {
    console.log('API: POST user request received');
    
    const body = await request.json();
    const { email, password, role } = body;
    
    console.log('API: Received user data:', { email, role });

    // Gerekli alanları kontrol et
    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
    }

    // Admin client ile kullanıcı oluştur
    const adminClient = createAdminClient();
    
    const { data: newUser, error: userError } = await adminClient.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Email'i otomatik onayla
      user_metadata: {},
      app_metadata: {
        role: role || 'authenticated'
      }
    });

    if (userError) {
      console.log('API: Error creating user:', userError.message);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    console.log('API: User created successfully:', newUser.user?.id);
    return NextResponse.json({
      id: newUser.user?.id,
      email: newUser.user?.email,
      created_at: newUser.user?.created_at,
      role: role || 'authenticated'
    });
  } catch (error) {
    console.log('API: Error in POST:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}