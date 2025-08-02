import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET - Makineleri listele (Public access)
export async function GET() {
  try {
    console.log('API: GET machines request received');
    
    // Admin client ile makineleri getir (authentication gerektirmez)
    const adminClient = createAdminClient();
    console.log('API: Fetching machines with admin client');
    
    const { data: machines, error } = await adminClient
      .from('machines')
      .select('*')
      .order('marka', { ascending: true })
      .order('cins', { ascending: true });
    
    console.log('API: Machines fetch result:', { machinesCount: machines?.length, error: error?.message });

    if (error) {
      console.log('API: Error fetching machines:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(machines || []);
  } catch (error) {
    console.log('API: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Yeni makine oluştur (sadece admin)
export async function POST(request: NextRequest) {
  try {
    console.log('API: POST machine request received');

    const body = await request.json();
    console.log('API: Received request body:', body);
    
    const { 
      adet, 
      cins, 
      model, 
      marka, 
      yerli, 
      ithal, 
      kapasite
    } = body;
    
    console.log('API: Received machine data:', { adet, cins, model, marka });

    // Gerekli alanları kontrol et
    if (!adet || !cins || !model || !marka) {
      return NextResponse.json({ error: 'Adet, cins, model ve marka alanları gerekli' }, { status: 400 });
    }

    // Admin client ile makine oluştur
    const adminClient = createAdminClient();
    
    // Makine verilerini hazırla
    const machineData = {
      adet: Number(adet),
      cins: cins,
      model: model,
      marka: marka,
      yerli: Boolean(yerli),
      ithal: Boolean(ithal),
      kapasite: kapasite || null
    };

    console.log('API: Machine data to insert:', machineData);

    const { data: newMachine, error: machineError } = await adminClient
      .from('machines')
      .insert(machineData)
      .select()
      .single();

    if (machineError) {
      console.log('API: Error creating machine:', machineError.message);
      console.log('API: Full machine error:', machineError);
      return NextResponse.json({ error: machineError.message }, { status: 500 });
    }

    console.log('API: Machine created successfully:', newMachine.id);
    return NextResponse.json(newMachine);
  } catch (error) {
    console.log('API: Error in POST:', error);
    console.log('API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

 