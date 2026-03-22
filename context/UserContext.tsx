'use client'

import { createClient } from "@/lib/supabase/client"
import { projectUpdateInfoSubscribe } from "next/dist/build/swc/generated-native"
import { createContext, useEffect, useState } from "react"

type UserProfile = {
  id:                  string
  name:                string
  email:               string
  role:                'LEADER' | 'MEMBER' | 'ADMIN'
  username_slug:       string | null
  avatar:              string | null
  onboarding_complete: boolean
  headline:            string | null   
  bio:                 string | null  
  genre_preferences:   string[] | null 
}
type UserContextType = {
    user: UserProfile | null
    loading: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

export const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    async function fetchUserProfile(userId:string) {
        const {data, error} = await supabase.from('users').select('*').eq('id', userId).single()

        if(error || !data) return null

        return data as UserProfile
    }

    async function loadUser() {
        setLoading(true)
        try {
            const {data:{user: authUser}} = await supabase.auth.getUser();

            if(!authUser) {
                setUser(null)
                return
            };

            const profile = await fetchUserProfile(authUser.id)
            setUser(profile)
        } finally {
            setLoading(false)
        }
    }

    async function refreshUser() {
        const {data: {user: authUser}} = await supabase.auth.getUser()
        if(!authUser) return

        const profile = await fetchUserProfile(authUser.id)
        console.log("after refresh", profile)
        setUser(profile)
    }

    async function logout() {
        await supabase.auth.signOut()
        setUser(null)
    }

    useEffect(() => {
        loadUser()

        const {data: { subscription }} = supabase.auth.onAuthStateChange(async (event, session) => {
            if(event === 'SIGNED_IN' && session?.user) {
               const profile = await fetchUserProfile(session.user.id)
               setUser(profile)
               setLoading(false)
            }
            if(event === 'SIGNED_OUT') {
                setUser(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <UserContext.Provider value={{user, loading,  logout, refreshUser}}>
            {children}
        </UserContext.Provider>
    )
}