import { useOnboarding } from '@/hooks/useOnboarding'
import { useRouter } from 'next/navigation';
import React from 'react'

const Step4 = () => {
    const router = useRouter();
    return (

    <div>
        <button className='border border-white p-5 rounded-3xl' onClick={() => router.push('/createClub')}>Create your First club</button>        
        <button className='border border-blue-500 rounded-3xl p-5' onClick={() => router.push("/dashboard")
        }>Skip for now Go to dashboard</button>
    </div>
  )
}

export default Step4