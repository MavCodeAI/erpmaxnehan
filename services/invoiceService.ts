import { supabase } from '../lib/supabase'
import { Invoice } from '../types'

export const invoiceService = {
  async getInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getInvoiceById(id: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateInvoice(id: string, updates: Partial<Invoice>) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteInvoice(id: string) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async searchInvoices(query: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .or(`customer_name.ilike.%${query}%,invoice_number.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
