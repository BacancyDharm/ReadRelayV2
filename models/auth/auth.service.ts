// src/app/api/auth/auth.service.ts
import { createClient } from '@/lib/supabase/server'
// import { supabaseAdmin } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export const registerService = async (userData: {
  name:     string
  email:    string
  password: string
  role:     string
  onboarding: boolean
}) => {
  const supabase = createClient(cookies())

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email:    userData.email,
    password: userData.password,
  })

  if (authError || !authData.user) {
    throw new Error(authError?.message ?? 'Signup failed')
  }

  const { data, error: profileError } = await supabase 
    .from('users')
    .insert({
      id:                  authData.user.id,  // ← must come from authData
      name:                userData.name,
      email:               userData.email,
      role:                userData.role,
      onboarding:          false
    })
    .select('*')
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  return data
}

export const loginService = async (userData: {
  email:    string
  password: string
}) => {
  const supabase = createClient(cookies())

  const { data, error } = await supabase.auth.signInWithPassword({
    email:    userData.email,
    password: userData.password,
  })

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Invalid email or password')
  }

  const {data: existingUser, error: existingUserError} = await supabase.from('users').select('id, role, onboarding').eq('id', data.user.id).single();

  if(!existingUser){
    //create a user
    const {data: userData, error} = await supabase.from('users').insert({
      id: data.session.user.id,
      email: data.session.user.email as string,
      role: "LEADER",
      onboarding: false
    })

    if(error){
      throw new Error(error.message)
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', data.user.id)
    .single()

  if (profileError) {
    throw new Error('Failed to fetch user profile')
  }

  return profile
}