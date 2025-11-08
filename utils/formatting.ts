// Fixed: Comprehensive data formatting utilities for ERP
import { format } from 'date-fns'

// Fixed: Comprehensive data formatting utilities for ERP
export const formatters = {
  // Currency formatting
  currency: (amount: number, currency = 'PKR') => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency === 'PKR' ? 'PKR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  },

  // Simple currency formatting for display
  currencySimple: (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  },

  // Date formatting
  date: (date: string | Date, formatStr = 'dd MMM yyyy') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr)
  },

  // Date time formatting
  dateTime: (date: string | Date) => {
    return formatters.date(date, 'dd MMM yyyy, hh:mm a')
  },

  // Short date formatting
  shortDate: (date: string | Date) => {
    return formatters.date(date, 'dd/MM/yyyy')
  },

  // Long date formatting
  longDate: (date: string | Date) => {
    return formatters.date(date, 'dd MMMM yyyy')
  },

  // Number formatting with thousands separator
  number: (num: number, decimals = 0) => {
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  },

  // Percentage formatting
  percentage: (num: number, decimals = 1) => {
    return `${formatters.number(num, decimals)}%`
  },

  // Phone number formatting
  phone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    return phone
  },

  // Capitalize first letter
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  // Title case formatting
  titleCase: (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  // Truncate text with ellipsis
  truncate: (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str
    return str.slice(0, maxLength - 3) + '...'
  },

  // Format address
  address: (address: any) => {
    if (!address || typeof address !== 'object') return ''
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean)

    return parts.join(', ')
  },

  // Format customer/vendor display name
  displayName: (entity: any) => {
    if (!entity) return ''
    
    if (entity.company_name) {
      return entity.company_name
    }
    
    if (entity.first_name && entity.last_name) {
      return `${entity.first_name} ${entity.last_name}`
    }
    
    if (entity.first_name) {
      return entity.first_name
    }
    
    return entity.display_name || 'Unknown'
  }
}

// Fixed: ERP-specific formatting functions
export const erpFormatters = {
  // Invoice number formatting
  invoiceNumber: (num: number, prefix = 'INV') => {
    return `${prefix}-${String(num).padStart(6, '0')}`
  },

  // Bill number formatting
  billNumber: (num: number, prefix = 'BILL') => {
    return `${prefix}-${String(num).padStart(6, '0')}`
  },

  // Journal voucher number formatting
  jvNumber: (num: number, prefix = 'JV') => {
    return `${prefix}-${String(num).padStart(6, '0')}`
  },

  // Payment reference formatting
  paymentReference: (type: string, num: number) => {
    const prefixes = {
      receipt: 'REC',
      payment: 'PAY',
      cash_receipt: 'CR',
      cash_payment: 'CP',
      bank_receipt: 'BR',
      bank_payment: 'BP'
    }
    const prefix = prefixes[type] || 'PAY'
    return `${prefix}-${String(num).padStart(6, '0')}`
  },

  // Status badge formatting
  status: (status: string) => {
    const statusMap = {
      'Draft': { color: 'gray', text: 'Draft' },
      'Unpaid': { color: 'yellow', text: 'Unpaid' },
      'Paid': { color: 'green', text: 'Paid' },
      'Partially Paid': { color: 'blue', text: 'Partially Paid' },
      'Overdue': { color: 'red', text: 'Overdue' },
      'Active': { color: 'green', text: 'Active' },
      'Inactive': { color: 'gray', text: 'Inactive' }
    }
    return statusMap[status] || { color: 'gray', text: status }
  },

  // Account type formatting
  accountType: (type: string) => {
    const typeMap = {
      'Asset': 'Assets',
      'Liability': 'Liabilities',
      'Equity': 'Equity',
      'Revenue': 'Revenue',
      'Expense': 'Expenses'
    }
    return typeMap[type] || type
  },

  // Stock quantity formatting
  stock: (quantity: number, unit: string) => {
    return `${formatters.number(quantity, 2)} ${unit}`
  },

  // Price per unit formatting
  pricePerUnit: (price: number, unit: string) => {
    return `${formatters.currencySimple(price)}/${unit}`
  }
}

// Fixed: Calculation helpers for ERP
export const erpCalculations = {
  // Calculate subtotal from items
  subtotal: (items: any[]) => {
    return items.reduce((total, item) => {
      return total + (item.quantity * item.price)
    }, 0)
  },

  // Calculate tax amount
  tax: (subtotal: number, taxRate: number) => {
    return subtotal * (taxRate / 100)
  },

  // Calculate discount amount
  discount: (subtotal: number, discountRate: number) => {
    return subtotal * (discountRate / 100)
  },

  // Calculate total
  total: (subtotal: number, tax = 0, discount = 0, shipping = 0, adjustment = 0) => {
    return subtotal + tax - discount + shipping + adjustment
  },

  // Calculate balance due
  balanceDue: (total: number, paidAmount: number) => {
    return total - paidAmount
  },

  // Calculate overdue days
  overdueDays: (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  // Calculate inventory value
  inventoryValue: (items: any[]) => {
    return items.reduce((total, item) => {
      return total + (item.current_stock * item.cost_price)
    }, 0)
  },

  // Calculate profit margin
  profitMargin: (sellingPrice: number, costPrice: number) => {
    if (costPrice === 0) return 0
    return ((sellingPrice - costPrice) / costPrice) * 100
  }
}
