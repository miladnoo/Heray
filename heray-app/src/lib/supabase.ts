import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Member {
  id: string
  full_name: string
  email: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface MemberInsert {
  full_name: string
  email: string
  phone?: string
} 