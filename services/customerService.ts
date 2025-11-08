import { supabase, Database } from '../utils/supabase'
import { showToast } from '../utils/toast'

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export class CustomerService {
  // Get all customers
  static async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      showToast.error('Failed to fetch customers')
      console.error('Error fetching customers:', error)
      return []
    }
  }

  // Get customer by ID
  static async getCustomer(id: string): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      showToast.error('Failed to fetch customer')
      console.error('Error fetching customer:', error)
      return null
    }
  }

  // Create new customer
  static async createCustomer(customer: CustomerInsert): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single()

      if (error) throw error
      showToast.success('Customer created successfully')
      return data
    } catch (error) {
      showToast.error('Failed to create customer')
      console.error('Error creating customer:', error)
      return null
    }
  }

  // Update customer
  static async updateCustomer(id: string, updates: CustomerUpdate): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      showToast.success('Customer updated successfully')
      return data
    } catch (error) {
      showToast.error('Failed to update customer')
      console.error('Error updating customer:', error)
      return null
    }
  }

  // Delete customer
  static async deleteCustomer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) throw error
      showToast.success('Customer deleted successfully')
      return true
    } catch (error) {
      showToast.error('Failed to delete customer')
      console.error('Error deleting customer:', error)
      return false
    }
  }

  // Search customers
  static async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`display_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('display_name')

      if (error) throw error
      return data || []
    } catch (error) {
      showToast.error('Failed to search customers')
      console.error('Error searching customers:', error)
      return []
    }
  }

  // Get customer receivables (total unpaid invoices)
  static async getCustomerReceivables(customerId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('balance_due')
        .eq('customer_id', customerId)
        .in('status', ['Unpaid', 'Partially Paid', 'Overdue'])

      if (error) throw error
      
      const total = data?.reduce((sum, invoice) => sum + invoice.balance_due, 0) || 0
      return total
    } catch (error) {
      console.error('Error fetching customer receivables:', error)
      return 0
    }
  }
}
