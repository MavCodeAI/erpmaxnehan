import { supabase, Database } from '../utils/supabase'
import { showToast } from '../utils/toast'

export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export class InvoiceService {
  // Get all invoices
  static async getInvoices(): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(display_name, email)
        `)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      showToast.error('Failed to fetch invoices')
      console.error('Error fetching invoices:', error)
      return []
    }
  }

  // Get invoice by ID
  static async getInvoice(id: string): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(display_name, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      showToast.error('Failed to fetch invoice')
      console.error('Error fetching invoice:', error)
      return null
    }
  }

  // Create new invoice
  static async createInvoice(invoice: InvoiceInsert): Promise<Invoice | null> {
    try {
      // Generate invoice number if not provided
      if (!invoice.invoice_number) {
        const { data: numberData } = await supabase.rpc('generate_invoice_number')
        invoice.invoice_number = numberData
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select(`
          *,
          customer:customers(display_name, email)
        `)
        .single()

      if (error) throw error
      showToast.success('Invoice created successfully')
      return data
    } catch (error) {
      showToast.error('Failed to create invoice')
      console.error('Error creating invoice:', error)
      return null
    }
  }

  // Update invoice
  static async updateInvoice(id: string, updates: InvoiceUpdate): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          customer:customers(display_name, email)
        `)
        .single()

      if (error) throw error
      showToast.success('Invoice updated successfully')
      return data
    } catch (error) {
      showToast.error('Failed to update invoice')
      console.error('Error updating invoice:', error)
      return null
    }
  }

  // Delete invoice
  static async deleteInvoice(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error
      showToast.success('Invoice deleted successfully')
      return true
    } catch (error) {
      showToast.error('Failed to delete invoice')
      console.error('Error deleting invoice:', error)
      return false
    }
  }

  // Search invoices
  static async searchInvoices(query: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customer:customers(display_name, email)
        `)
        .or(`invoice_number.ilike.%${query}%,customer.display_name.ilike.%${query}%`)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      showToast.error('Failed to search invoices')
      console.error('Error searching invoices:', error)
      return []
    }
  }

  // Get invoice summary statistics
  static async getInvoiceSummary() {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('status, total, date, due_date')

      if (error) throw error

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const summary = {
        total: 0,
        drafts: 0,
        dueToday: 0,
        overdue: 0,
        paid: 0,
        unpaid: 0,
        partiallyPaid: 0
      }

      data?.forEach(invoice => {
        if (invoice.status === 'Draft') {
          summary.drafts += invoice.total
        } else {
          summary.total += invoice.total
          
          const dueDate = new Date(invoice.due_date)
          dueDate.setHours(0, 0, 0, 0)
          
          if (invoice.status === 'Paid') {
            summary.paid += invoice.total
          } else if (invoice.status === 'Unpaid' || invoice.status === 'Overdue') {
            summary.unpaid += invoice.total
            if (dueDate.getTime() === today.getTime()) {
              summary.dueToday += invoice.total
            } else if (dueDate < today) {
              summary.overdue += invoice.total
            }
          } else if (invoice.status === 'Partially Paid') {
            summary.partiallyPaid += invoice.total
          }
        }
      })

      return summary
    } catch (error) {
      console.error('Error fetching invoice summary:', error)
      return {
        total: 0,
        drafts: 0,
        dueToday: 0,
        overdue: 0,
        paid: 0,
        unpaid: 0,
        partiallyPaid: 0
      }
    }
  }

  // Update invoice status
  static async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      showToast.success('Invoice status updated')
      return true
    } catch (error) {
      showToast.error('Failed to update invoice status')
      console.error('Error updating invoice status:', error)
      return false
    }
  }
}
