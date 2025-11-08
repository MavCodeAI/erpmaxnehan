// Fixed: Performance optimization utilities for ERP
import { useCallback, useRef, useEffect, useMemo, useState } from 'react'

// Fixed: Performance optimization utilities for ERP
// Fixed: Debounce hook with proper typing
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300 // Fixed: Added default parameter
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay)
    },
    [callback, delay]
  ) as T

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

// Fixed: Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now())
  
  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = Date.now()
      }
    },
    [callback, delay]
  ) as T

  return throttledCallback
}

// Fixed: Memoized search utility
export const useSearch = <T>(
  items: T[],
  searchFields: (keyof T)[],
  query: string
) => {
  return useMemo(() => {
    if (!query.trim()) return items

    const lowercaseQuery = query.toLowerCase()
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        return value && 
               typeof value === 'string' && 
               value.toLowerCase().includes(lowercaseQuery)
      })
    )
  }, [items, searchFields, query])
}

// Fixed: Virtual scrolling utility for large lists
export const useVirtualScroll = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  scrollTop: number
) => {
  return useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    
    const visibleItems = items.slice(startIndex, endIndex)
    const offsetY = startIndex * itemHeight
    
    return {
      visibleItems,
      startIndex,
      endIndex,
      offsetY,
      totalHeight: items.length * itemHeight
    }
  }, [items, itemHeight, containerHeight, scrollTop])
}

// Fixed: Local storage utility with error handling
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue || null
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// Fixed: Session storage utility
export const session = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue || null
    }
  },

  set: <T>(key: string, value: T): boolean => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
      return false
    }
  },

  remove: (key: string): boolean => {
    try {
      sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
      return false
    }
  }
}

// Fixed: Performance monitoring utility with proper window.performance typing
declare global {
  interface Window {
    performance: Performance & {
      now: () => number
    }
  }
}

export const performanceUtils = {
  // Measure function execution time
  measure: async <T>(
    fn: () => T | Promise<T>,
    label: string
  ): Promise<{ result: T; duration: number }> => {
    const start = window.performance.now()
    const result = await fn()
    const end = window.performance.now()
    const duration = end - start
    
    console.log(`${label}: ${duration.toFixed(2)}ms`)
    return { result, duration }
  },

  // Create performance marker
  mark: (name: string) => {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name)
    }
  },

  // Measure time between markers
  measureBetween: (name: string, startMark: string, endMark: string) => {
    if (window.performance && window.performance.measure) {
      window.performance.measure(name, startMark, endMark)
      const entries = window.performance.getEntriesByName(name)
      if (entries.length > 0) {
        return entries[0].duration
      }
    }
    return 0
  }
}

// Fixed: Image lazy loading utility
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setLoading(false)
      setError(false)
    }
    
    img.onerror = () => {
      setError(true)
      setLoading(false)
    }
    
    img.src = src
  }, [src, placeholder])

  return { imageSrc, loading, error }
}

// Fixed: Pagination utility
export const usePagination = <T>(
  items: T[],
  itemsPerPage: number,
  currentPage: number = 1
) => {
  return useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedItems = items.slice(startIndex, endIndex)
    const totalPages = Math.ceil(items.length / itemsPerPage)
    
    return {
      items: paginatedItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex
    }
  }, [items, itemsPerPage, currentPage])
}

// Fixed: Array utility functions
export const arrayUtils = {
  // Group array by key
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key])
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {} as Record<string, T[]>)
  },

  // Unique array by key
  uniqueBy: <T, K extends keyof T>(array: T[], key: K): T[] => {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  },

  // Sort array by key
  sortBy: <T, K extends keyof T>(
    array: T[],
    key: K,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },

  // Filter array by multiple criteria
  filterBy: <T>(
    array: T[],
    criteria: Partial<Record<keyof T, any>>
  ): T[] => {
    return array.filter(item =>
      Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === null) return true
        return item[key as keyof T] === value
      })
    )
  }
}
