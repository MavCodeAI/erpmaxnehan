// Generated TypeScript types for Supabase
// Run: npx supabase gen types typescript --project-id=qtblryuydfqhushksyyy > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          code: string
          name: string
          type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
          account_type: string | null
          opening_balance: number
          status: string
          is_posting_account: boolean
          description: string | null
          parent_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
          account_type?: string | null
          opening_balance?: number
          status?: string
          is_posting_account?: boolean
          description?: string | null
          parent_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          type?: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
          account_type?: string | null
          opening_balance?: number
          status?: string
          is_posting_account?: boolean
          description?: string | null
          parent_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          customer_type: string
          salutation: string | null
          first_name: string | null
          last_name: string | null
          company_name: string | null
          display_name: string
          email: string | null
          work_phone: string | null
          mobile_phone: string | null
          currency: string
          opening_balance: number
          payment_terms: string | null
          tax_id: string | null
          notes: string | null
          language: string
          enable_portal: boolean
          billing_address: Json | null
          shipping_address: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_type?: string
          salutation?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          display_name: string
          email?: string | null
          work_phone?: string | null
          mobile_phone?: string | null
          currency?: string
          opening_balance?: number
          payment_terms?: string | null
          tax_id?: string | null
          notes?: string | null
          language?: string
          enable_portal?: boolean
          billing_address?: Json | null
          shipping_address?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_type?: string
          salutation?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          display_name?: string
          email?: string | null
          work_phone?: string | null
          mobile_phone?: string | null
          currency?: string
          opening_balance?: number
          payment_terms?: string | null
          tax_id?: string | null
          notes?: string | null
          language?: string
          enable_portal?: boolean
          billing_address?: Json | null
          shipping_address?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          salutation: string | null
          first_name: string | null
          last_name: string | null
          company_name: string | null
          display_name: string
          email: string | null
          work_phone: string | null
          mobile_phone: string | null
          currency: string
          payment_terms: string | null
          tax_id: string | null
          company_id: string | null
          website: string | null
          remarks: string | null
          status: string
          billing_address: Json | null
          shipping_address: Json | null
          opening_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          salutation?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          display_name: string
          email?: string | null
          work_phone?: string | null
          mobile_phone?: string | null
          currency?: string
          payment_terms?: string | null
          tax_id?: string | null
          company_id?: string | null
          website?: string | null
          remarks?: string | null
          status?: string
          billing_address?: Json | null
          shipping_address?: Json | null
          opening_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          salutation?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          display_name?: string
          email?: string | null
          work_phone?: string | null
          mobile_phone?: string | null
          currency?: string
          payment_terms?: string | null
          tax_id?: string | null
          company_id?: string | null
          website?: string | null
          remarks?: string | null
          status?: string
          billing_address?: Json | null
          shipping_address?: Json | null
          opening_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      item_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          item_type: string
          name: string
          sku: string
          unit: string | null
          selling_price: number | null
          cost_price: number | null
          opening_stock: number
          current_stock: number
          sales_description: string | null
          purchase_description: string | null
          item_group_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_type?: string
          name: string
          sku: string
          unit?: string | null
          selling_price?: number | null
          cost_price?: number | null
          opening_stock?: number
          current_stock?: number
          sales_description?: string | null
          purchase_description?: string | null
          item_group_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_type?: string
          name?: string
          sku?: string
          unit?: string | null
          selling_price?: number | null
          cost_price?: number | null
          opening_stock?: number
          current_stock?: number
          sales_description?: string | null
          purchase_description?: string | null
          item_group_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_id: string
          customer_name: string
          date: string
          due_date: string
          salesperson: string | null
          subject: string | null
          items: Json
          notes: string | null
          terms_and_conditions: string | null
          shipping_charges: number
          adjustment: number
          subtotal: number
          total_tax: number
          total: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_id: string
          customer_name: string
          date: string
          due_date: string
          salesperson?: string | null
          subject?: string | null
          items: Json
          notes?: string | null
          terms_and_conditions?: string | null
          shipping_charges?: number
          adjustment?: number
          subtotal: number
          total_tax?: number
          total: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_id?: string
          customer_name?: string
          date?: string
          due_date?: string
          salesperson?: string | null
          subject?: string | null
          items?: Json
          notes?: string | null
          terms_and_conditions?: string | null
          shipping_charges?: number
          adjustment?: number
          subtotal?: number
          total_tax?: number
          total?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      purchase_bills: {
        Row: {
          id: string
          bill_number: string
          vendor_id: string
          vendor_name: string
          date: string
          due_date: string
          items: Json
          notes: string | null
          terms_and_conditions: string | null
          shipping_charges: number
          adjustment: number
          subtotal: number
          total_tax: number
          total: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bill_number: string
          vendor_id: string
          vendor_name: string
          date: string
          due_date: string
          items: Json
          notes?: string | null
          terms_and_conditions?: string | null
          shipping_charges?: number
          adjustment?: number
          subtotal: number
          total_tax?: number
          total: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bill_number?: string
          vendor_id?: string
          vendor_name?: string
          date?: string
          due_date?: string
          items?: Json
          notes?: string | null
          terms_and_conditions?: string | null
          shipping_charges?: number
          adjustment?: number
          subtotal?: number
          total_tax?: number
          total?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
