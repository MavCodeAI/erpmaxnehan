import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { handleSupabaseError } from '../utils/errorHandler'

interface UseSupabaseDataOptions<T> {
  table: string
  select?: string
  orderBy?: { column: string; ascending?: boolean }
  filter?: { column: string; operator: string; value: any }
  enabled?: boolean
}

export function useSupabaseData<T = any>(options: UseSupabaseDataOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (options.enabled === false) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase.from(options.table).select(options.select || '*')

      // Apply filters
      if (options.filter) {
        query = query.filter(
          options.filter.column,
          options.filter.operator,
          options.filter.value
        )
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        })
      }

      const { data: result, error } = await query

      if (error) {
        throw error
      }

      setData(result as T[])
    } catch (err) {
      const errorMessage = handleSupabaseError(err)
      setError(errorMessage)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [
    options.table,
    options.select,
    options.orderBy?.column,
    options.orderBy?.ascending,
    options.filter?.column,
    options.filter?.operator,
    options.filter?.value,
    options.enabled,
  ])

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}

// Hook for real-time subscriptions (simplified version)
export function useSupabaseRealtime<T = any>(
  table: string,
 event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error } = await supabase
          .from(table)
          .select('*')

        if (error) throw error
        setData(result as T[])
      } catch (err) {
        setError(handleSupabaseError(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Note: Real-time subscription requires additional setup
    // For now, this hook provides basic data fetching
    // To enable real-time, uncomment and configure:
    /*
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event, schema: 'public', table },
        (payload: any) => {
          if (event === 'INSERT' || event === '*') {
            setData(prev => [...prev, payload.new as T])
          }
          if (event === 'UPDATE' || event === '*') {
            setData(prev =>
              prev.map(item =>
                (item as any).id === payload.new.id ? payload.new as T : item
              )
            )
          }
          if (event === 'DELETE' || event === '*') {
            setData(prev =>
              prev.filter(item => (item as any).id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
    */
  }, [table, event])

  return { data, loading, error }
}
