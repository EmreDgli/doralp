import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// PUT - Kullanıcı güncelle (sadece admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: PUT user request received for ID:', params.id);
    
    const body = await request.json();
    const { email, password, role } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email gerekli' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    
    // Kullanıcı güncelleme verilerini hazırla
    const updateData: any = {
      email: email,
      app_metadata: {
        role: role || 'authenticated'
      }
    };

    // Eğer şifre varsa, onu da ekle
    if (password && password.trim() !== '') {
      updateData.password = password;
    }

    const { data: updatedUser, error: userError } = await adminClient.auth.admin.updateUserById(
      params.id,
      updateData
    );

    if (userError) {
      console.log('API: Error updating user:', userError.message);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    console.log('API: User updated successfully:', updatedUser.user?.id);
    return NextResponse.json({
      id: updatedUser.user?.id,
      email: updatedUser.user?.email,
      role: role || 'authenticated'
    });
  } catch (error) {
    console.log('API: Error in PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Kullanıcı sil (sadece admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: DELETE user request received for ID:', params.id);

    const adminClient = createAdminClient();
    
    const { error: userError } = await adminClient.auth.admin.deleteUser(params.id);

    if (userError) {
      console.log('API: Error deleting user:', userError.message);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    console.log('API: User deleted successfully:', params.id);
    return NextResponse.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.log('API: Error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}