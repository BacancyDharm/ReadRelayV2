// Add to your register/page.tsx and login/page.tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

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
    // No redirect needed here — Google takes over automatically
  }

  return (
    <div>
      {/* Your existing email + password form */}

      <button
        onClick={handleGoogleSignIn}
        type="button"
      >
        Continue with Google
      </button>
    </div>
  )
}