import { supabase } from '../lib/supabase'
import { Customer } from '../types'

export const customerService = {
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getCustomerById(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateCustomer(id: string, updates: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteCustomer(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async searchCustomers(query: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`display_name.ilike.%${query}%,email.ilike.%${query}%,company_name.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}
