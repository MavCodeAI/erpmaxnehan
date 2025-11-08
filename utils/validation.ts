// Fixed: Comprehensive validation utilities for ERP forms
export const validators = {
  // Email validation
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Phone validation (supports international formats)
  phone: (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  },

  // Required field validation
  required: (value: any) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return value !== null && value !== undefined
  },

  // Number validation
  number: (value: any) => {
    return !isNaN(value) && isFinite(value)
  },

  // Positive number validation
  positiveNumber: (value: any) => {
    return validators.number(value) && parseFloat(value) > 0
  },

  // Currency validation
  currency: (value: any) => {
    return validators.number(value) && parseFloat(value) >= 0
  },

  // Date validation
  date: (value: string) => {
    const date = new Date(value)
    return !isNaN(date.getTime())
  },

  // Future date validation
  futureDate: (value: string) => {
    const date = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  },

  // Past date validation
  pastDate: (value: string) => {
    const date = new Date(value)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    return date <= today
  },

  // SKU validation (alphanumeric with hyphens)
  sku: (sku: string) => {
    const skuRegex = /^[A-Z0-9\-]+$/
    return skuRegex.test(sku) && sku.length >= 3
  },

  // Address validation
  address: (address: string) => {
    return address.trim().length >= 10
  },

  // Tax ID validation
  taxId: (taxId: string) => {
    const taxIdRegex = /^[A-Z0-9\-]+$/
    return taxIdRegex.test(taxId) && taxId.length >= 5
  }
}

// Fixed: Form validation engine
export const validateForm = (formData: any, rules: any) => {
  const errors: any = {}

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = formData[field]

    if (fieldRules.required && !validators.required(value)) {
      errors[field] = `${field} is required`
      return
    }

    if (value && fieldRules.email && !validators.email(value)) {
      errors[field] = `${field} must be a valid email`
    }

    if (value && fieldRules.phone && !validators.phone(value)) {
      errors[field] = `${field} must be a valid phone number`
    }

    if (value && fieldRules.positiveNumber && !validators.positiveNumber(value)) {
      errors[field] = `${field} must be a positive number`
    }

    if (value && fieldRules.currency && !validators.currency(value)) {
      errors[field] = `${field} must be a valid currency amount`
    }

    if (value && fieldRules.date && !validators.date(value)) {
      errors[field] = `${field} must be a valid date`
    }

    if (value && fieldRules.futureDate && !validators.futureDate(value)) {
      errors[field] = `${field} must be a future date`
    }

    if (value && fieldRules.pastDate && !validators.pastDate(value)) {
      errors[field] = `${field} must be a past date`
    }

    if (value && fieldRules.sku && !validators.sku(value)) {
      errors[field] = `${field} must be a valid SKU`
    }

    if (value && fieldRules.address && !validators.address(value)) {
      errors[field] = `${field} must be a valid address`
    }

    if (value && fieldRules.taxId && !validators.taxId(value)) {
      errors[field] = `${field} must be a valid tax ID`
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `${field} must not exceed ${fieldRules.maxLength} characters`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Fixed: Common validation rules for ERP forms
export const commonValidationRules = {
  customer: {
    display_name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: false, email: true },
    work_phone: { required: false, phone: true },
    mobile_phone: { required: false, phone: true },
    billing_address: { required: false, address: true },
    shipping_address: { required: false, address: true },
    tax_id: { required: false, taxId: true },
    opening_balance: { required: false, currency: true }
  },

  vendor: {
    display_name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: false, email: true },
    work_phone: { required: false, phone: true },
    mobile_phone: { required: false, phone: true },
    billing_address: { required: false, address: true },
    shipping_address: { required: false, address: true },
    tax_id: { required: false, taxId: true },
    opening_balance: { required: false, currency: true }
  },

  invoice: {
    customer_id: { required: true },
    date: { required: true, date: true, pastDate: true },
    due_date: { required: true, date: true, futureDate: true },
    items: { required: true },
    subtotal: { required: true, currency: true },
    total: { required: true, currency: true }
  },

  bill: {
    vendor_id: { required: true },
    date: { required: true, date: true, pastDate: true },
    due_date: { required: true, date: true, futureDate: true },
    items: { required: true },
    subtotal: { required: true, currency: true },
    total: { required: true, currency: true }
  },

  inventoryItem: {
    name: { required: true, minLength: 2, maxLength: 100 },
    sku: { required: true, sku: true },
    unit: { required: true },
    selling_price: { required: true, positiveNumber: true },
    cost_price: { required: true, positiveNumber: true },
    opening_stock: { required: true, currency: true },
    current_stock: { required: true, currency: true }
  }
}
