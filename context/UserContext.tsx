'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { createClient } from '@/lib/supabase/client'

type UserProfile = {
  id: string
  role: 'ADMIN' | 'LEADER' | 'MEMBER' | 'GUEST'
  email: string
  name: string
  bio: string | null
  avatar: string | null
  onboarding: boolean
  headline: string
  genre_preference: string[]
  notification_preferences: string
  created_at: string
}

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  refresh: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  refresh: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setUser(profile ?? null)
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') fetchProfile()
      if (event === 'SIGNED_OUT') setUser(null)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile, supabase])

  return (
    <UserContext.Provider value={{ user, isLoading, refresh: fetchProfile }}>
      {children}
    </UserContext.Provider>
  )
}

