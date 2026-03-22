'use client'
import { OnboardingContext } from "@/context/OnboardingContext";
import { useContext } from "react";

export function useOnboarding() {
    const context = useContext(OnboardingContext)
    if(!context) throw new Error('useOnboarding must be used within a OnboardingProvider')
    return context
}