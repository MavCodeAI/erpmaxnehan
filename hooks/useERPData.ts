import { useState, useEffect, useCallback } from 'react'
import { DataService } from '../services/dataService'
import { FallbackDataService } from '../services/fallbackDataService'
import { checkSupabaseConnection } from '../lib/supabase'
import { showToast } from '../utils/toast'

// Fixed: Comprehensive ERP data management hook with fallback support
export function useERPData() {
  const [customers, setCustomers] = useState([])
  const [vendors, setVendors] = useState([])
  const [invoices, setInvoices] = useState([])
  const [bills, setBills] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fixed: Check database connection first
      const { connected } = await checkSupabaseConnection()
      setIsOffline(!connected)
      
      if (!connected) {
        showToast.info('Database not available. Using demo mode with sample data.')
      }
      
      const dataService = connected ? DataService : FallbackDataService
      
      const [
        customersData,
        vendorsData,
        invoicesData,
        billsData,
        inventoryData
      ] = await Promise.all([
        dataService.getCustomers(),
        dataService.getVendors(),
        dataService.getInvoices(),
        dataService.getBills(),
        dataService.getInventoryItems()
      ])

      setCustomers(customersData)
      setVendors(vendorsData)
      setInvoices(invoicesData)
      setBills(billsData)
      setInventoryItems(inventoryData)
      
      if (connected) {
        showToast.success('Data loaded successfully from database')
      } else {
        showToast.success('Demo data loaded successfully')
      }
    } catch (err) {
      setError(err.message)
      setIsOffline(true)
      
      // Fixed: Fallback to demo data on error
      try {
        const fallbackService = FallbackDataService
        const [customersData, vendorsData, invoicesData, billsData, inventoryData] = await Promise.all([
          fallbackService.getCustomers(),
          fallbackService.getVendors(),
          fallbackService.getInvoices(),
          fallbackService.getBills(),
          fallbackService.getInventoryItems()
        ])
        
        setCustomers(customersData)
        setVendors(vendorsData)
        setInvoices(invoicesData)
        setBills(billsData)
        setInventoryItems(inventoryData)
        
        showToast.info('Using demo data due to connection issues')
      } catch (fallbackErr) {
        showToast.error('Failed to load data: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Customer operations
  const createCustomer = useCallback(async (customerData) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const newCustomer = await dataService.createCustomer(customerData)
      setCustomers(prev => [newCustomer, ...prev])
      showToast.success('Customer created successfully')
      return newCustomer
    } catch (error) {
      // Auto-fallback to offline mode on network errors
      if (!isOffline && (error.message.includes('fetch') || error.message.includes('network'))) {
        setIsOffline(true)
        const newCustomer = await FallbackDataService.createCustomer(customerData)
        setCustomers(prev => [newCustomer, ...prev])
        showToast.success('Customer created (offline mode)')
        return newCustomer
      }
      showToast.error('Failed to create customer: ' + error.message)
      throw error
    }
  }, [isOffline])

  const updateCustomer = useCallback(async (id, updates) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const updatedCustomer = await dataService.updateCustomer(id, updates)
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c))
      showToast.success('Customer updated successfully')
      return updatedCustomer
    } catch (error) {
      showToast.error('Failed to update customer: ' + error.message)
      throw error
    }
  }, [isOffline])

  const deleteCustomer = useCallback(async (id) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      await dataService.deleteCustomer(id)
      setCustomers(prev => prev.filter(c => c.id !== id))
      showToast.success('Customer deleted successfully')
    } catch (error) {
      showToast.error('Failed to delete customer: ' + error.message)
      throw error
    }
  }, [isOffline])

  // Vendor operations
  const createVendor = useCallback(async (vendorData) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const newVendor = await dataService.createVendor(vendorData)
      setVendors(prev => [newVendor, ...prev])
      showToast.success('Vendor created successfully')
      return newVendor
    } catch (error) {
      // Auto-fallback to offline mode on network errors
      if (!isOffline && (error.message.includes('fetch') || error.message.includes('network'))) {
        setIsOffline(true)
        const newVendor = await FallbackDataService.createVendor(vendorData)
        setVendors(prev => [newVendor, ...prev])
        showToast.success('Vendor created (offline mode)')
        return newVendor
      }
      showToast.error('Failed to create vendor: ' + error.message)
      throw error
    }
  }, [isOffline])

  const updateVendor = useCallback(async (id, updates) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const updatedVendor = await dataService.updateVendor(id, updates)
      setVendors(prev => prev.map(v => v.id === id ? updatedVendor : v))
      showToast.success('Vendor updated successfully')
      return updatedVendor
    } catch (error) {
      showToast.error('Failed to update vendor: ' + error.message)
      throw error
    }
  }, [isOffline])

  const deleteVendor = useCallback(async (id) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      await dataService.deleteVendor(id)
      setVendors(prev => prev.filter(v => v.id !== id))
      showToast.success('Vendor deleted successfully')
    } catch (error) {
      showToast.error('Failed to delete vendor: ' + error.message)
      throw error
    }
  }, [isOffline])

  // Invoice operations
  const createInvoice = useCallback(async (invoiceData) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const newInvoice = await dataService.createInvoice(invoiceData)
      setInvoices(prev => [newInvoice, ...prev])
      showToast.success('Invoice created successfully')
      return newInvoice
    } catch (error) {
      // If network error, switch to offline mode and retry
      if (error.message.includes('fetch') || error.message.includes('network')) {
        setIsOffline(true)
        showToast.info('Connection lost. Switching to offline mode...')
        try {
          const newInvoice = await FallbackDataService.createInvoice(invoiceData)
          setInvoices(prev => [newInvoice, ...prev])
          showToast.success('Invoice created successfully (offline mode)')
          return newInvoice
        } catch (fallbackError) {
          showToast.error('Failed to create invoice: ' + fallbackError.message)
          throw fallbackError
        }
      }
      showToast.error('Failed to create invoice: ' + error.message)
      throw error
    }
  }, [isOffline])

  const updateInvoice = useCallback(async (id, updates) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const updatedInvoice = await dataService.updateInvoice(id, updates)
      setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i))
      showToast.success('Invoice updated successfully')
      return updatedInvoice
    } catch (error) {
      showToast.error('Failed to update invoice: ' + error.message)
      throw error
    }
  }, [isOffline])

  const deleteInvoice = useCallback(async (id) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      await dataService.deleteInvoice(id)
      setInvoices(prev => prev.filter(i => i.id !== id))
      showToast.success('Invoice deleted successfully')
    } catch (error) {
      showToast.error('Failed to delete invoice: ' + error.message)
      throw error
    }
  }, [isOffline])

  // Bill operations
  const createBill = useCallback(async (billData) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const newBill = await dataService.createBill(billData)
      setBills(prev => [newBill, ...prev])
      showToast.success('Bill created successfully')
      return newBill
    } catch (error) {
      // Auto-fallback to offline mode on network errors
      if (!isOffline && (error.message.includes('fetch') || error.message.includes('network'))) {
        setIsOffline(true)
        const newBill = await FallbackDataService.createBill(billData)
        setBills(prev => [newBill, ...prev])
        showToast.success('Bill created (offline mode)')
        return newBill
      }
      showToast.error('Failed to create bill: ' + error.message)
      throw error
    }
  }, [isOffline])

  const updateBill = useCallback(async (id, updates) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const updatedBill = await dataService.updateBill(id, updates)
      setBills(prev => prev.map(b => b.id === id ? updatedBill : b))
      showToast.success('Bill updated successfully')
      return updatedBill
    } catch (error) {
      showToast.error('Failed to update bill: ' + error.message)
      throw error
    }
  }, [isOffline])

  const deleteBill = useCallback(async (id) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      await dataService.deleteBill(id)
      setBills(prev => prev.filter(b => b.id !== id))
      showToast.success('Bill deleted successfully')
    } catch (error) {
      showToast.error('Failed to delete bill: ' + error.message)
      throw error
    }
  }, [isOffline])

  // Inventory operations
  const createInventoryItem = useCallback(async (itemData) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const newItem = await dataService.createInventoryItem(itemData)
      setInventoryItems(prev => [newItem, ...prev])
      showToast.success('Item created successfully')
      return newItem
    } catch (error) {
      // Auto-fallback to offline mode on network errors
      if (!isOffline && (error.message.includes('fetch') || error.message.includes('network'))) {
        setIsOffline(true)
        const newItem = await FallbackDataService.createInventoryItem(itemData)
        setInventoryItems(prev => [newItem, ...prev])
        showToast.success('Item created (offline mode)')
        return newItem
      }
      showToast.error('Failed to create item: ' + error.message)
      throw error
    }
  }, [isOffline])

  const updateInventoryItem = useCallback(async (id, updates) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      const updatedItem = await dataService.updateInventoryItem(id, updates)
      setInventoryItems(prev => prev.map(i => i.id === id ? updatedItem : i))
      showToast.success('Item updated successfully')
      return updatedItem
    } catch (error) {
      showToast.error('Failed to update item: ' + error.message)
      throw error
    }
  }, [isOffline])

  const deleteInventoryItem = useCallback(async (id) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      await dataService.deleteInventoryItem(id)
      setInventoryItems(prev => prev.filter(i => i.id !== id))
      showToast.success('Item deleted successfully')
    } catch (error) {
      showToast.error('Failed to delete item: ' + error.message)
      throw error
    }
  }, [isOffline])

  // Search operations
  const searchCustomers = useCallback(async (query) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      // Fixed: Add null check for query
      const safeQuery = query || ''
      return await dataService.searchCustomers(safeQuery)
    } catch (error) {
      showToast.error('Search failed: ' + error.message)
      return []
    }
  }, [isOffline])

  const searchVendors = useCallback(async (query) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      // Fixed: Add null check for query
      const safeQuery = query || ''
      return await dataService.searchVendors(safeQuery)
    } catch (error) {
      showToast.error('Search failed: ' + error.message)
      return []
    }
  }, [isOffline])

  const searchInventoryItems = useCallback(async (query) => {
    try {
      const dataService = isOffline ? FallbackDataService : DataService
      // Fixed: Add null check for query
      const safeQuery = query || ''
      return await dataService.searchInventoryItems(safeQuery)
    } catch (error) {
      showToast.error('Search failed: ' + error.message)
      return []
    }
  }, [isOffline])

  // Initialize data on mount
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  return {
    // Data
    customers,
    vendors,
    invoices,
    bills,
    inventoryItems,
    loading,
    error,
    isOffline, // Fixed: Added connection status
    
    // Setters for state management
    setCustomers,
    setVendors,
    setInvoices,
    setBills,
    setInventoryItems,
    
    // Actions
    loadAllData,
    
    // Customer actions
    createCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Vendor actions
    createVendor,
    updateVendor,
    deleteVendor,
    
    // Invoice actions
    createInvoice,
    updateInvoice,
    deleteInvoice,
    
    // Bill actions
    createBill,
    updateBill,
    deleteBill,
    
    // Inventory actions
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    
    // Search actions
    searchCustomers,
    searchVendors,
    searchInventoryItems
  }
}
