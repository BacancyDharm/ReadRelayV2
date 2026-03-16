'use client'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
type FormData = {
  email: string,
  password: string,
  name: string
}
export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const {register, handleSubmit} = useForm<FormData>()
  const [erros, setErrors] = useState<string>()

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Google sign in error:', error.message)
    }    
  }

  const onSubmit = async (data: FormData) => {

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data, role:"LEADER"}),
      })
      if(res.ok){
        router.push('/login')        
      }else{
        const error = await res.json()
        setErrors(error.message)
      }
    
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-md flex flex-col align-center'>
      <div className="mb-5">
        <h1 className='mx-auto text-center'>Register</h1>
      </div>
      <div className="mb-5">
        <label htmlFor="Name" className='block mb-2.5 text-sm font-medium text-heading'>Your Name</label>
      <input type="text" id="Name" placeholder='Name' {...register('name')} className='bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg' />
      </div>
      <div className="mb-5">
        <label htmlFor="email" className='block mb-2.5 text-sm font-medium text-heading'>Your Email</label>
      <input type="email" id="email" placeholder='Email' {...register('email')} className='bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg' />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className='block mb-2.5 text-sm font-medium text-heading'>Password</label>
      <input className='bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg' type="password" id="password" placeholder='Password' {...register('password')} />
      </div>
      <button type="submit" className='text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none'>Register</button>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className='text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none'
      >
        Continue with Google
      </button>

      {erros && <p className='text-red-500'>{erros}</p>}
    </form>
  )
}