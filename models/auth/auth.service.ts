import { createClient } from '@/lib/supabase/server'
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
      id:                  authData.user.id,  
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

  if (!error && data.user) {
    const {data: profile, error: profileError} = await supabase
      .from('users')
      .select('id, name, email, role, onboarding')
      .eq('id', data.session?.user.id)
      .single()
    
    if(profileError || !profile) {
      throw new Error('Account setup incomplete')
    }

    return {profile, isNewUser: false}
  }

  const isUserNotFound =
    error?.message?.toLowerCase().includes('invalid login credentials') ||
    error?.message?.toLowerCase().includes('user not found')
  if (!isUserNotFound) {
    throw new Error(error?.message ?? 'Login failed')
  }


  const {data: authData, error: signUpError} = await supabase.auth.signUp({
    email:    userData.email,
    password: userData.password,
  })

  if(signUpError || !authData.user) {
    console.log('------------', signUpError?.message)
    throw new Error("Invalid password")
  }

  const {data: profile, error: profileError} = await supabase
    .from('users')
    .insert({
      id:authData.user.id,
      email:userData.email,
      role:'LEADER',
      onboarding:false
    })

    if(profileError) {
      throw new Error(profileError.message)
    }


  const { data: newSession, error: newSignInError } = await supabase.auth.signInWithPassword({
    email:    userData.email,
    password: userData.password,
  })

  if (newSignInError) {
    throw new Error(newSignInError.message)
  }

  const {data: newProfile, error: newProfileError} = await supabase
    .from('users')
    .select('id, name, email, role, onboarding')
    .eq('id', newSession.user.id)
    .single()
  

  if (newProfileError) {
    throw new Error(newProfileError.message)
  }
  return {profile: newProfile, isNewUser: true}
}