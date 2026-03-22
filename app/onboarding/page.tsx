'use client'

import useDebounce from "@/hooks/useDebounce";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {useForm} from 'react-hook-form'

type FormData = {
    headline: string;
    bio: string;
    genre_preferences: string[];
    name: string
};

export default function OnboardingPage(){
  const genreRef = useRef<HTMLInputElement>(null);
    const {user} = useUser();
    const router = useRouter();   
    const {register, handleSubmit, setValue, watch }= useForm<FormData>({
        defaultValues: {
            headline: user?.headline || '',
            bio: user?.bio || '',
            genre_preferences: user?.genre_preferences || [],
            name: user?.name || ''
        }
    })
    const genre = watch('genre_preferences');
    const nameValue = watch('name')
    const debouncedName = useDebounce(nameValue, 1000)
    console.log(debouncedName)
    const [errors, setErrors] = useState<string>('');

    if(user=== null || user.role !== "LEADER"){
        console.log("user is null")
        router.push('/login');
    }

    useEffect(() => {
     const isAvailable = async () => {
       const namecheck = await fetch(`/api/checkname?username=${debouncedName}`)
       const isNameTaken = await namecheck.json()
       if(isNameTaken.nameTaken){
        setErrors("Name already taken try another username")
       }else{
        setErrors('')
       }

     }
     isAvailable()
     return () => {}
    }, [debouncedName])

    const addGenre = () => {
      const val = genreRef.current?.value.trim();
      if(!val) return;
      setValue('genre_preferences', [...genre, val]);
      genreRef.current!.value = '';
    }

    const removeGenre = (item: string) => {
      setValue('genre_preferences', genre.filter(g => g !== item));
    }
    
    const onSubmit = async (data: FormData) => {
      const namecheck = await fetch(`/api/checkname?username=${debouncedName}`)
      const isNameTaken = await namecheck.json()
      if(isNameTaken.nameTaken){
        console.log(isNameTaken.nameTaken)
        setErrors("Name already taken try another username")
        return
      }
      setErrors('')
      console.log(isNameTaken.nameTaken)
        const res = await fetch('/api/onboarding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },            
            body: JSON.stringify({...data, name: debouncedName, onboarding: true}),
        })
        if(res.ok){
          console.log("--------ok")
            // router.push('/leader/createClub')
        }else{
            const error = await res.json()
            setErrors(error.message)
        }
    }
    return (
      <div>
        <h1>Welcome to ReadRelay</h1>
        <p>Please complete following details to get Started</p>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg mx-auto w-full flex flex-col gap-2"
          >
            <div className="mb5">
              <label
                htmlFor="name"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
              />
              {errors && <p className="text-red-500">{errors}</p>}
            </div>
            <div className="mb-5">
              <label
                htmlFor="headline"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Tell us in short about yourself
              </label>
              <input
                type="text"
                {...register("headline")}
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="bio"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Your Bio
              </label>
              <textarea
                id="bio"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
                {...register("bio")}
              ></textarea>
              <label
                htmlFor="genre"
                className="block mb-2.5 text-sm font-medium text-heading"
              >
                Genre Preference
              </label>
              <input
                type="text"
                id="genre"
                ref={genreRef}
                placeholder="Enter your Genre here"
                className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
                onKeyDown={(e) => {
                  if(e.key === 'Enter'){
                    e.preventDefault();
                    addGenre();
                  }
                }}
              />
              {genre?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {genre.map((g, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => removeGenre(g)}
                                        className="border border-white rounded-lg px-2 py-1 text-sm text-white flex items-center gap-1"
                                    >
                                        {g} <span>✕</span>
                                    </button>
                                ))}
                            </div>
                        )}
            </div>

            <div>
              <h2>Let's get started</h2>
              <button
                type="submit"
                className="text-white bg-brand box-border border border-white rounded-lg hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                Create Your first club
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-white bg-brand box-border border border-white rounded-lg hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              >
                Skip for now, go to dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}