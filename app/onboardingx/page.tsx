'use client'
import { useOnboarding } from '@/hooks/useOnboarding'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

const OnboardingForm = () => {
  const router = useRouter();
  const {user, loading} = useUser();
  const {step} = useOnboarding();
  
  
  console.log("user is ", "-------------", user)
  if(!user){
    router.push('/login');
  } 
  if(user?.onboarding_complete) router.push('/dashboard');
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {step === 1  && <Step1/>}
      {step === 2  && <Step2/>}
      {step === 3  && <Step3/>}
      {step === 4  && <Step4/>}
    </div>
  )
}

export default OnboardingForm