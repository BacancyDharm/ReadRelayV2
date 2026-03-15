'use client'

import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
    const supabase = createClient()

    async function handleGoogleSignIn() {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if(error) {
            console.error('Google sign in error:', error.message)
        }
    }

    return (
        <div>
            <h1>Sign in</h1>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
    )
}