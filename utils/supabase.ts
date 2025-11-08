import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'your-anon-key'

// Fixed: Add proper error handling for missing credentials
if (supabaseUrl === 'https://your-project-url.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for ERPMAX
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          display_name: string
          email: string | null
          phone: string | null
          address: string | null
          opening_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          opening_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          opening_balance?: number
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          display_name: string
          email: string | null
          phone: string | null
          address: string | null
          opening_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          display_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          opening_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          opening_balance?: number
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_id: string
          date: string
          due_date: string
          total: number
          balance_due: number
          status: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_id: string
          date: string
          due_date: string
          total: number
          balance_due?: number
          status?: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_id?: string
          date?: string
          due_date?: string
          total?: number
          balance_due?: number
          status?: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue'
          notes?: string | null
          updated_at?: string
        }
      }
      bills: {
        Row: {
          id: string
          bill_number: string
          vendor_id: string
          date: string
          due_date: string
          total: number
          balance_due: number
          status: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bill_number: string
          vendor_id: string
          date: string
          due_date: string
          total: number
          balance_due?: number
          status?: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bill_number?: string
          vendor_id?: string
          date?: string
          due_date: string
          total?: number
          balance_due?: number
          status?: 'Draft' | 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue'
          notes?: string | null
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          name: string
          code: string | null
          description: string | null
          category: string | null
          unit: string
          sale_price: number
          purchase_price: number
          stock_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code?: string | null
          description?: string | null
          category?: string | null
          unit: string
          sale_price: number
          purchase_price: number
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          description?: string | null
          category?: string | null
          unit?: string
          sale_price?: number
          purchase_price?: number
          stock_quantity?: number
          updated_at?: string
        }
      }
    }
  }
}
