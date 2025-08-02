import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Test connection endpoint called');
    
    // Environment variables kontrolü
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    };
    
    console.log('Environment variables check:', envCheck);
    
    const client = createClient();
    const adminClient = createAdminClient();
    
    // Client test
    const { data: clientBuckets, error: clientError } = await client.storage.listBuckets();
    console.log('Client buckets:', clientBuckets?.map(b => b.name));
    console.log('Client error:', clientError);
    
    // Admin client test
    const { data: adminBuckets, error: adminError } = await adminClient.storage.listBuckets();
    console.log('Admin buckets:', adminBuckets?.map(b => b.name));
    console.log('Admin error:', adminError);
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      client: {
        buckets: clientBuckets?.map(b => b.name) || [],
        error: clientError?.message
      },
      admin: {
        buckets: adminBuckets?.map(b => b.name) || [],
        error: adminError?.message
      }
    });
    
  } catch (error) {
    console.log('API: Error in test connection:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 