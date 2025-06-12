import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client  
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Auth types
export interface AdminUser {
  id: string
  email: string
  role?: string
}

// Check if user is admin (you can customize this logic)
export const isAdminUser = (email: string): boolean => {
  const adminEmails = [
    'admin@herayorg.com',
    'founder@herayorg.com',
    'milad@herayorg.com',
    // Add your admin emails here - replace with your actual emails
  ]
  return adminEmails.includes(email.toLowerCase())
} 