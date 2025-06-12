import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Client-side Supabase client
export const createSupabaseClient = () => createClientComponentClient()

// Server-side Supabase client  
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })

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