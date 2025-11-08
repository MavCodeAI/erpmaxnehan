// Fixed: Fallback data service for offline/demo mode when database is not available
import { handleSupabaseError } from '../utils/errorHandler'

// Mock data for demo purposes
const mockCustomers = [
  {
    id: '1',
    customerType: 'Business',
    salutation: 'Mr.',
    firstName: 'John',
    lastName: 'Smith',
    companyName: 'ABC Corporation',
    displayName: 'ABC Corporation',
    email: 'info@abc.com',
    workPhone: '+92-21-1234567',
    mobilePhone: '',
    currency: 'PKR',
    openingBalance: 0,
    paymentTerms: 'Net 30',
    billingAddress: { street: '123 Business St', city: 'Karachi', state: 'Sindh', zipCode: '75000', country: 'Pakistan' },
    shippingAddress: { street: '123 Business St', city: 'Karachi', state: 'Sindh', zipCode: '75000', country: 'Pakistan' },
    status: 'Active',
    created_at: new Date().toISOString()
  },
  {
    id: '2', 
    customerType: 'Business',
    salutation: 'Ms.',
    firstName: 'Sarah',
    lastName: 'Ahmed',
    companyName: 'XYZ Industries',
    displayName: 'XYZ Industries',
    email: 'contact@xyz.com',
    workPhone: '+92-21-7654321',
    mobilePhone: '',
    currency: 'PKR',
    openingBalance: 0,
    paymentTerms: 'Net 30',
    billingAddress: { street: '456 Industrial Ave', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan' },
    shippingAddress: { street: '456 Industrial Ave', city: 'Lahore', state: 'Punjab', zipCode: '54000', country: 'Pakistan' },
    status: 'Active',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    customerType: 'Individual',
    salutation: 'Mr.',
    firstName: 'Ali',
    lastName: 'Khan',
    companyName: '',
    displayName: 'Ali Khan',
    email: 'ali.khan@email.com',
    workPhone: '+92-300-1234567',
    mobilePhone: '+92-300-1234567',
    currency: 'PKR',
    openingBalance: 0,
    paymentTerms: 'Due on Receipt',
    billingAddress: { street: '789 Residential Area', city: 'Islamabad', state: 'ICT', zipCode: '44000', country: 'Pakistan' },
    shippingAddress: { street: '789 Residential Area', city: 'Islamabad', state: 'ICT', zipCode: '44000', country: 'Pakistan' },
    status: 'Active',
    created_at: new Date().toISOString()
  }
]

const mockVendors = [
  {
    id: '1',
    display_name: 'Global Supplies Ltd',
    email: 'sales@globalsupplies.com',
    work_phone: '+92-21-1111111',
    billing_address: '789 Supplier Rd, Faisalabad, Pakistan',
    created_at: new Date().toISOString()
  }
]

const mockInventoryItems = [
  {
    id: '1',
    itemType: 'Goods',
    name: 'Office Chair',
    sku: 'CHAIR-001',
    unit: 'pcs',
    trackSales: true,
    sellingPrice: 15000,
    salesDescription: 'Ergonomic office chair with adjustable height',
    trackPurchases: true,
    costPrice: 10000,
    purchaseDescription: 'Office Chair - Ergonomic',
    trackInventory: true,
    openingStock: 50,
    openingStockRate: 10000,
    reorderPoint: 10,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    itemType: 'Goods',
    name: 'Laptop Computer',
    sku: 'LAPTOP-001', 
    unit: 'pcs',
    trackSales: true,
    sellingPrice: 120000,
    salesDescription: 'Dell Latitude Business Laptop',
    trackPurchases: true,
    costPrice: 100000,
    purchaseDescription: 'Laptop Computer - Dell Latitude',
    trackInventory: true,
    openingStock: 25,
    openingStockRate: 100000,
    reorderPoint: 5,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    itemType: 'Goods',
    name: 'Wireless Mouse',
    sku: 'MOUSE-001',
    unit: 'pcs',
    trackSales: true,
    sellingPrice: 2500,
    salesDescription: 'Logitech Wireless Mouse',
    trackPurchases: true,
    costPrice: 1800,
    purchaseDescription: 'Wireless Mouse - Logitech',
    trackInventory: true,
    openingStock: 100,
    openingStockRate: 1800,
    reorderPoint: 20,
    created_at: new Date().toISOString()
  }
]

const mockInvoices = [
  {
    id: '1',
    customer_id: '1',
    customer_name: 'ABC Corporation',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Unpaid',
    subtotal: 15000,
    total: 16500,
    items: [
      {
        inventory_item_id: '1',
        description: 'Office Chair',
        quantity: 1,
        price: 15000,
        total: 15000
      }
    ],
    created_at: new Date().toISOString()
  }
]

const mockBills = [
  {
    id: '1',
    vendor_id: '1',
    vendor_name: 'Global Supplies Ltd',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Unpaid',
    subtotal: 10000,
    total: 11000,
    items: [
      {
        inventory_item_id: '1',
        description: 'Office Chair',
        quantity: 1,
        price: 10000,
        total: 10000
      }
    ],
    created_at: new Date().toISOString()
  }
]

// Fixed: Fallback data service with mock data
export class FallbackDataService {
  // Fixed: Simulate API delay for realistic UX
  private static async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Customer Operations
  static async getCustomers() {
    try {
      await this.delay()
      return mockCustomers
    } catch (error) {
      throw new Error('Failed to load customers: ' + error.message)
    }
  }

  static async createCustomer(customer: any) {
    try {
      await this.delay()
      const newCustomer = {
        ...customer,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      mockCustomers.push(newCustomer)
      return newCustomer
    } catch (error) {
      throw new Error('Failed to create customer: ' + error.message)
    }
  }

  static async updateCustomer(id: string, updates: any) {
    try {
      await this.delay()
      const index = mockCustomers.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Customer not found')
      
      mockCustomers[index] = { ...mockCustomers[index], ...updates }
      return mockCustomers[index]
    } catch (error) {
      throw new Error('Failed to update customer: ' + error.message)
    }
  }

  static async deleteCustomer(id: string) {
    try {
      await this.delay()
      const index = mockCustomers.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Customer not found')
      
      mockCustomers.splice(index, 1)
      return true
    } catch (error) {
      throw new Error('Failed to delete customer: ' + error.message)
    }
  }

  // Vendor Operations
  static async getVendors() {
    try {
      await this.delay()
      return mockVendors
    } catch (error) {
      throw new Error('Failed to load vendors: ' + error.message)
    }
  }

  static async createVendor(vendor: any) {
    try {
      await this.delay()
      const newVendor = {
        ...vendor,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      mockVendors.push(newVendor)
      return newVendor
    } catch (error) {
      throw new Error('Failed to create vendor: ' + error.message)
    }
  }

  static async updateVendor(id: string, updates: any) {
    try {
      await this.delay()
      const index = mockVendors.findIndex(v => v.id === id)
      if (index === -1) throw new Error('Vendor not found')
      
      mockVendors[index] = { ...mockVendors[index], ...updates }
      return mockVendors[index]
    } catch (error) {
      throw new Error('Failed to update vendor: ' + error.message)
    }
  }

  static async deleteVendor(id: string) {
    try {
      await this.delay()
      const index = mockVendors.findIndex(v => v.id === id)
      if (index === -1) throw new Error('Vendor not found')
      
      mockVendors.splice(index, 1)
      return true
    } catch (error) {
      throw new Error('Failed to delete vendor: ' + error.message)
    }
  }

  // Invoice Operations
  static async getInvoices() {
    try {
      await this.delay()
      return mockInvoices
    } catch (error) {
      throw new Error('Failed to load invoices: ' + error.message)
    }
  }

  static async createInvoice(invoice: any) {
    try {
      await this.delay()
      const newInvoice = {
        ...invoice,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      mockInvoices.push(newInvoice)
      return newInvoice
    } catch (error) {
      throw new Error('Failed to create invoice: ' + error.message)
    }
  }

  static async updateInvoice(id: string, updates: any) {
    try {
      await this.delay()
      const index = mockInvoices.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Invoice not found')
      
      mockInvoices[index] = { ...mockInvoices[index], ...updates }
      return mockInvoices[index]
    } catch (error) {
      throw new Error('Failed to update invoice: ' + error.message)
    }
  }

  static async deleteInvoice(id: string) {
    try {
      await this.delay()
      const index = mockInvoices.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Invoice not found')
      
      mockInvoices.splice(index, 1)
      return true
    } catch (error) {
      throw new Error('Failed to delete invoice: ' + error.message)
    }
  }

  // Bill Operations
  static async getBills() {
    try {
      await this.delay()
      return mockBills
    } catch (error) {
      throw new Error('Failed to load bills: ' + error.message)
    }
  }

  static async createBill(bill: any) {
    try {
      await this.delay()
      const newBill = {
        ...bill,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      mockBills.push(newBill)
      return newBill
    } catch (error) {
      throw new Error('Failed to create bill: ' + error.message)
    }
  }

  static async updateBill(id: string, updates: any) {
    try {
      await this.delay()
      const index = mockBills.findIndex(b => b.id === id)
      if (index === -1) throw new Error('Bill not found')
      
      mockBills[index] = { ...mockBills[index], ...updates }
      return mockBills[index]
    } catch (error) {
      throw new Error('Failed to update bill: ' + error.message)
    }
  }

  static async deleteBill(id: string) {
    try {
      await this.delay()
      const index = mockBills.findIndex(b => b.id === id)
      if (index === -1) throw new Error('Bill not found')
      
      mockBills.splice(index, 1)
      return true
    } catch (error) {
      throw new Error('Failed to delete bill: ' + error.message)
    }
  }

  // Inventory Operations
  static async getInventoryItems() {
    try {
      await this.delay()
      return mockInventoryItems
    } catch (error) {
      throw new Error('Failed to load inventory items: ' + error.message)
    }
  }

  static async createInventoryItem(item: any) {
    try {
      await this.delay()
      const newItem = {
        ...item,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
      mockInventoryItems.push(newItem)
      return newItem
    } catch (error) {
      throw new Error('Failed to create inventory item: ' + error.message)
    }
  }

  static async updateInventoryItem(id: string, updates: any) {
    try {
      await this.delay()
      const index = mockInventoryItems.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Inventory item not found')
      
      mockInventoryItems[index] = { ...mockInventoryItems[index], ...updates }
      return mockInventoryItems[index]
    } catch (error) {
      throw new Error('Failed to update inventory item: ' + error.message)
    }
  }

  static async deleteInventoryItem(id: string) {
    try {
      await this.delay()
      const index = mockInventoryItems.findIndex(i => i.id === id)
      if (index === -1) throw new Error('Inventory item not found')
      
      mockInventoryItems.splice(index, 1)
      return true
    } catch (error) {
      throw new Error('Failed to delete inventory item: ' + error.message)
    }
  }

  // Search Operations
  static async searchCustomers(query: string) {
    try {
      await this.delay()
      // Fixed: Add null check and safe string handling
      const safeQuery = (query || '').toString().toLowerCase().trim()
      if (!safeQuery) return mockCustomers
      
      return mockCustomers.filter(customer => 
        (customer.displayName || '').toString().toLowerCase().includes(safeQuery) ||
        (customer.email || '').toString().toLowerCase().includes(safeQuery)
      )
    } catch (error) {
      throw new Error('Failed to search customers: ' + error.message)
    }
  }

  static async searchVendors(query: string) {
    try {
      await this.delay()
      // Fixed: Add null check and safe string handling
      const safeQuery = (query || '').toString().toLowerCase().trim()
      if (!safeQuery) return mockVendors
      
      return mockVendors.filter(vendor => 
        (vendor.display_name || '').toString().toLowerCase().includes(safeQuery) ||
        (vendor.email || '').toString().toLowerCase().includes(safeQuery)
      )
    } catch (error) {
      throw new Error('Failed to search vendors: ' + error.message)
    }
  }

  static async searchInventoryItems(query: string) {
    try {
      await this.delay()
      // Fixed: Add null check and safe string handling
      const safeQuery = (query || '').toString().toLowerCase().trim()
      if (!safeQuery) return mockInventoryItems
      
      return mockInventoryItems.filter(item => 
        (item.name || '').toString().toLowerCase().includes(safeQuery) ||
        (item.sku || '').toString().toLowerCase().includes(safeQuery)
      )
    } catch (error) {
      throw new Error('Failed to search inventory items: ' + error.message)
    }
  }
}
