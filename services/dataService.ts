import { supabase } from '../lib/supabase'
import { handleSupabaseError } from '../utils/errorHandler'

// Fixed: Comprehensive data service for all ERP modules
export class DataService {
  // Customer Operations
  static async getCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map snake_case database fields to camelCase for frontend
      return (data || []).map(customer => ({
        id: customer.id,
        customerType: customer.customer_type,
        salutation: customer.salutation,
        firstName: customer.first_name,
        lastName: customer.last_name,
        companyName: customer.company_name,
        displayName: customer.display_name,
        email: customer.email,
        workPhone: customer.work_phone,
        mobilePhone: customer.mobile_phone,
        currency: customer.currency,
        openingBalance: customer.opening_balance,
        paymentTerms: customer.payment_terms,
        taxId: customer.tax_id,
        notes: customer.notes,
        language: customer.language,
        enablePortal: customer.enable_portal,
        billingAddress: customer.billing_address,
        shippingAddress: customer.shipping_address,
        status: customer.status,
        created_at: customer.created_at,
        updated_at: customer.updated_at
      }))
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async createCustomer(customer: any) {
    try {
      // Map camelCase to snake_case for database
      const customerData = {
        customer_type: customer.customerType || 'Business',
        salutation: customer.salutation || '',
        first_name: customer.firstName || '',
        last_name: customer.lastName || '',
        company_name: customer.companyName || '',
        display_name: customer.displayName || customer.companyName || `${customer.firstName} ${customer.lastName}`,
        email: customer.email || '',
        work_phone: customer.workPhone || '',
        mobile_phone: customer.mobilePhone || '',
        currency: customer.currency || 'PKR',
        opening_balance: customer.openingBalance || 0,
        payment_terms: customer.paymentTerms || '',
        tax_id: customer.taxId || '',
        notes: customer.notes || '',
        language: customer.language || 'en',
        enable_portal: customer.enablePortal || false,
        billing_address: customer.billingAddress || {},
        shipping_address: customer.shippingAddress || {},
        status: customer.status || 'Active'
      }

      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async updateCustomer(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async deleteCustomer(id: string) {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  // Vendor Operations
  static async getVendors() {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async createVendor(vendor: any) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendor])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async updateVendor(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async deleteVendor(id: string) {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  // Invoice Operations
  static async getInvoices() {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map snake_case database fields to camelCase for frontend
      return (data || []).map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        customerId: invoice.customer_id,
        customerName: invoice.customer_name,
        date: invoice.date,
        dueDate: invoice.due_date,
        salesperson: invoice.salesperson,
        subject: invoice.subject,
        items: invoice.items,
        notes: invoice.notes,
        termsAndConditions: invoice.terms_and_conditions,
        shippingCharges: invoice.shipping_charges,
        adjustment: invoice.adjustment,
        subtotal: invoice.subtotal,
        totalTax: invoice.total_tax,
        total: invoice.total,
        status: invoice.status,
        created_at: invoice.created_at,
        updated_at: invoice.updated_at
      }))
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async createInvoice(invoice: any) {
    try {
      // Map camelCase to snake_case for database
      const invoiceData = {
        invoice_number: invoice.invoiceNumber,
        customer_id: invoice.customerId,
        customer_name: invoice.customerName,
        date: invoice.date,
        due_date: invoice.dueDate,
        salesperson: invoice.salesperson,
        subject: invoice.subject,
        items: invoice.items,
        notes: invoice.notes,
        terms_and_conditions: invoice.termsAndConditions,
        shipping_charges: invoice.shippingCharges || 0,
        adjustment: invoice.adjustment || 0,
        subtotal: invoice.subtotal,
        total_tax: invoice.totalTax || 0,
        total: invoice.total,
        status: invoice.status || 'Draft'
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async updateInvoice(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async deleteInvoice(id: string) {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  // Bill Operations
  static async getBills() {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async createBill(bill: any) {
    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([bill])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async updateBill(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('bills')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async deleteBill(id: string) {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  // Inventory Operations
  static async getInventoryItems() {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Map snake_case database fields to camelCase for frontend
      return (data || []).map(item => ({
        id: item.id,
        itemType: item.item_type,
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        trackSales: item.track_sales || true,
        sellingPrice: item.selling_price,
        salesDescription: item.sales_description,
        trackPurchases: item.track_purchases || true,
        costPrice: item.cost_price,
        purchaseDescription: item.purchase_description,
        trackInventory: item.track_inventory || true,
        openingStock: item.opening_stock,
        openingStockRate: item.opening_stock_rate,
        currentStock: item.current_stock,
        quantity: item.current_stock, // Alternative field
        price: item.selling_price, // Alternative field
        cost_price: item.cost_price, // Alternative field
        selling_price: item.selling_price, // Alternative field
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async createInventoryItem(item: any) {
    try {
      // Map camelCase to snake_case for database
      const itemData = {
        item_type: item.itemType || 'Goods',
        name: item.name,
        sku: item.sku,
        unit: item.unit || 'pcs',
        track_sales: item.trackSales !== false,
        selling_price: item.sellingPrice,
        sales_description: item.salesDescription,
        track_purchases: item.trackPurchases !== false,
        cost_price: item.costPrice,
        purchase_description: item.purchaseDescription,
        track_inventory: item.trackInventory !== false,
        opening_stock: item.openingStock || 0,
        opening_stock_rate: item.openingStockRate || item.costPrice || 0,
        current_stock: item.currentStock || 0,
        status: item.status || 'Active'
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemData])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async updateInventoryItem(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async deleteInventoryItem(id: string) {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  // Search Operations
  static async searchCustomers(query: string) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async searchVendors(query: string) {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }

  static async searchInventoryItems(query: string) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
}
