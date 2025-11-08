import React from 'react'
import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, name?: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        }
      }
    })
    
    return { user: data.user, error }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { user: data.user, error }
  }

  // Sign out
  static async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Listen to auth changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { error }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { error }
  }

  // Update user profile
  static async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    return { error }
  }

  // Sign in with Google (if enabled)
  static async signInWithGoogle(): Promise<{ user: User | null; error: any }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    // OAuth sign-in returns URL, not user directly
    // User will be available after redirect
    return { user: null, error }
  }
}

// React hook for authentication
export const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Get initial user
    AuthService.getCurrentUser().then(currentUser => {
      setUser(currentUser)
      setLoading(false)
    })

    // Listen to auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    signUp: AuthService.signUp,
    signIn: AuthService.signIn,
    signOut: AuthService.signOut,
    resetPassword: AuthService.resetPassword,
    updatePassword: AuthService.updatePassword,
    updateProfile: AuthService.updateProfile,
    signInWithGoogle: AuthService.signInWithGoogle
  }
}
