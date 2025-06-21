import { useState, useEffect } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from 'next/navigation'
import type { Database } from '@/types/supabase'

export const useAuth = () => {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Supabase session (getSession):', session);
      setUser(session?.user ?? null)
      setSession(session)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Supabase session (onAuthStateChange):', session);
      setUser(session?.user ?? null)
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting sign up process...', { email, userData });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          }
        }
      })

      console.log('Auth sign up response:', { data, error });

      if (error) throw error

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Email confirmation required');
        return { 
          data: { 
            user: data.user, 
            requiresConfirmation: true 
          }, 
          error: null 
        }
      }

      if (data.user && data.session) {
        console.log('User created and signed in successfully:', { userId: data.user.id });
        
        // The database trigger will automatically create the user profile
        // We can optionally update the profile if needed
        const { error: profileError } = await supabase
          .from('users')
          .update({
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: 'user',
          })
          .eq('id', data.user.id)

        console.log('Profile update response:', { profileError });

        if (profileError) {
          console.warn('Profile update failed, but user was created:', profileError);
        }

        // Session is already established from signup
        setUser(data.session.user)
        setSession(data.session)
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }
} 