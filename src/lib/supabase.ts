import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key são necessários')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas
export type Ticket = {
  id: string
  client: string
  subject: string
  category: string
  technician: string
  status: string
  date: string
  reported_issue?: string
  confirmed_issue?: string
  service_performed?: string
  priority?: string
  arrival_time?: string
  departure_time?: string
  created_at?: string
  updated_at?: string
}

export type Client = {
  id: string
  name: string
  unit: string
  phone: string
  email: string
  city: string
  state?: string
  cep?: string
  active_tickets: number
  created_at?: string
  updated_at?: string
}

export type User = {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  created_at?: string
  updated_at?: string
} 