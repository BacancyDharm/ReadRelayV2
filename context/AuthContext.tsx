import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database.types"
import { ChildProcess } from "child_process"
import React, { createContext, useEffect, useState } from "react"

type UserProfile = Database['public']['Tables']['users']['Row']
type UserCredentials = {
    email: string,
    password: string
}

type AuthContextType = {
    user: UserProfile | null,
    isLoading: boolean,
    refresh: () = Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>({
    user: null,
    isLoading: true,
    refresh: async () => {}
});


export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
    


}