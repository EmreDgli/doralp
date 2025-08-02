import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Check machines table endpoint called');
    
    const adminClient = createAdminClient();
    
    // Machines tablosunu kontrol et
    const { data: machines, error: machinesError } = await adminClient
      .from('machines')
      .select('*')
      .limit(1);
    
    console.log('Machines table check:', { 
      hasTable: !machinesError, 
      error: machinesError?.message,
      sampleData: machines?.[0]
    });
    
    // Tablo yapısını kontrol et - basit sorgu ile
    const { data: tableColumns, error: tableError } = await adminClient
      .from('machines')
      .select('*')
      .limit(0);
    
    console.log('Table structure check:', { 
      hasTable: !tableError, 
      error: tableError?.message,
      tableError: tableError
    });
    
    return NextResponse.json({
      success: true,
      machines: {
        hasTable: !machinesError,
        error: machinesError?.message,
        sampleData: machines?.[0] || null
      },
      table_structure: tableError ? `Error: ${tableError.message}` : 'Table exists and accessible'
    });
    
  } catch (error) {
    console.log('API: Error in check machines table:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 