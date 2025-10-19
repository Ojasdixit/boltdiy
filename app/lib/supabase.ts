// This file should be in app/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface UserCodeState {
  id: string
  user_id: string
  code_content: string
  language: string
  file_path: string
  last_modified: string
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_name: string
  created_at: string
  updated_at: string
}

export interface Sandbox {
  id: string
  user_id: string
  sandbox_url: string
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  expires_at: string
}

export default supabase
