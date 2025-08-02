import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// PUT - Makine güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: PUT machine request received for ID:', params.id);
    
    const body = await request.json();
    const { adet, cins, model, marka, yerli, ithal, kapasite } = body;
    
    if (!adet || !cins || !model || !marka) {
      return NextResponse.json({ error: 'Adet, cins, model ve marka alanları gerekli' }, { status: 400 });
    }

    const adminClient = createAdminClient();
    
    const machineData = {
      adet: Number(adet),
      cins: cins,
      model: model,
      marka: marka,
      yerli: Boolean(yerli),
      ithal: Boolean(ithal),
      kapasite: kapasite || null,
      updated_at: new Date().toISOString()
    };

    const { data: updatedMachine, error: machineError } = await adminClient
      .from('machines')
      .update(machineData)
      .eq('id', params.id)
      .select()
      .single();

    if (machineError) {
      console.log('API: Error updating machine:', machineError.message);
      return NextResponse.json({ error: machineError.message }, { status: 500 });
    }

    return NextResponse.json(updatedMachine);
  } catch (error) {
    console.log('API: Error in PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Makine sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: DELETE machine request received for ID:', params.id);

    const adminClient = createAdminClient();
    
    const { error: machineError } = await adminClient
      .from('machines')
      .delete()
      .eq('id', params.id);

    if (machineError) {
      console.log('API: Error deleting machine:', machineError.message);
      return NextResponse.json({ error: machineError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Makine başarıyla silindi' });
  } catch (error) {
    console.log('API: Error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}