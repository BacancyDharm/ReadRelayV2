'use client'

import { createContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { OnboardingSchema, type OnboardingSchemaType } from "@/models/auth/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
type OnboardingContextType = {
    form: UseFormReturn<OnboardingSchemaType>,
    setStep: (step: number) => void,
    step: number
}

type FormData = {
    headline: string,
    bio: string,
    genre_preferences: string[],
    name: string,
    notification_preferences: {
        discusstion_post: boolean,
        new_member_joined: boolean,
        member_fell_behind: boolean
    }
}

export const OnboardingContext = createContext<OnboardingContextType | null>(null)

export const OnboardingProvider = ({children}: {children: React.ReactNode}) => {
    const [step, setStep] = useState(1);
    const form = useForm<OnboardingSchemaType>(
        {
            defaultValues: {
                headline: '',
                bio: '',
                genre_preferences: [],
                name: '',
                notification_preferences:{
                    discusstion_post: false,
                    new_member_joined: true,
                    member_fell_behind: true
                } 
            },
            resolver: zodResolver(OnboardingSchema),
            mode: "onBlur"
        }
    );
    return (<OnboardingContext.Provider value={{form, step, setStep}}>{children}</OnboardingContext.Provider>)
}
