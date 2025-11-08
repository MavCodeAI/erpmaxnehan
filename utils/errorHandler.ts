export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  
  // Handle specific error codes
  switch (error.code) {
    case 'PGRST116':
      return 'Record not found'
    case '23505':
      return 'Duplicate record - this record already exists'
    case '23503':
      return 'Foreign key violation - referenced record does not exist'
    case '23502':
      return 'Required field is missing'
    case '42501':
      return 'Permission denied - you do not have access to this resource'
    case 'PGRST301':
      return 'Invalid API key or authentication'
    case 'PGRST302':
      return 'Session expired - please login again'
    case 'PGRST303':
      return 'Invalid request format'
    default:
      return error.message || 'An unexpected error occurred'
  }
}

export const isSupabaseError = (error: any): boolean => {
  return error && typeof error === 'object' && 'code' in error
}

export const getErrorSeverity = (error: any): 'error' | 'warning' | 'info' => {
  if (!isSupabaseError(error)) return 'error'
  
  switch (error.code) {
    case 'PGRST301':
    case 'PGRST302':
      return 'warning'
    case '23505':
      return 'warning'
    default:
      return 'error'
  }
}
