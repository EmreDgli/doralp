import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('page', { ascending: true })
      .order('language', { ascending: true })

    if (error) {
      console.error('Error fetching contents:', error)
      return NextResponse.json({ message: 'Failed to fetch contents', error: error.message }, { status: 500 })
    }

    console.log('Contents data fetched:', data?.length || 0, 'items')
    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Contents API error:', error)
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('contents')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating content:', error)
      return NextResponse.json({ message: 'Failed to create content', error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ message: 'Content ID is required' }, { status: 400 })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from('contents')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating content:', error)
      return NextResponse.json({ message: 'Failed to update content', error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ message: 'Content ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting content:', error)
      return NextResponse.json({ message: 'Failed to delete content', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Content deleted successfully' })

  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}