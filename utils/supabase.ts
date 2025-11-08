import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace these with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'  // Paste your Project URL here
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'  // Paste your anon key here

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
