import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      contents: {
        Row: {
          id: string
          language: "tr" | "en"
          page: string
          title: string
          body: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          language: "tr" | "en"
          page: string
          title: string
          body?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          language?: "tr" | "en"
          page?: string
          title?: string
          body?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string | null
          language: "tr" | "en"
          location: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date?: string | null
          language: "tr" | "en"
          location?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string | null
          language?: "tr" | "en"
          location?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          surname: string
          email: string
          subject: string
          message: string
          approved_kvkk: boolean
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          surname: string
          email: string
          subject: string
          message: string
          approved_kvkk: boolean
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          surname?: string
          email?: string
          subject?: string
          message?: string
          approved_kvkk?: boolean
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Functions: {
      get_content: {
        Args: {
          p_language: "tr" | "en"
          p_page: string
        }
        Returns: {
          id: string
          language: "tr" | "en"
          page: string
          title: string
          body: string
          created_at: string
          updated_at: string
        }[]
      }
      get_projects: {
        Args: {
          p_language?: "tr" | "en"
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          date: string
          language: "tr" | "en"
          location: string
          category: string
          image_count: number
          primary_image: string
          created_at: string
        }[]
      }
      submit_contact_message: {
        Args: {
          p_name: string
          p_surname: string
          p_email: string
          p_subject: string
          p_message: string
          p_approved_kvkk: boolean
        }
        Returns: string
      }
    }
  }
}
