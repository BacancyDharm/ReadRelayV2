"use client";

import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/models/auth/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { register, handleSubmit, formState } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const [errors, setErrors] = useState<string>();
  const { refreshUser } = useUser();
  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      refreshUser();
      router.push("/onboarding");

    } else {
      const error = await res.json();
      console.log(error);
      setErrors(error.message);
    }
  };
  async function handleGoogleSignIn() {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign in error:", error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg w-full mx-auto flex flex-col gap-2"
    >
      <div className="mb-5">
        <h1 className="mx-auto text-center text-2xl font-semibold">Login</h1>
      </div>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          Your Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          {...register("email")}
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
        />
        {formState.errors.email && (
          <p className="text-red-600">{formState.errors.email.message}</p>
        )}
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          Password
        </label>
        <input
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
          type="password"
          id="password"
          placeholder="Password"
          {...register("password")}
        />
        {formState.errors.password && (
          <p className="text-red-600">{formState.errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="text-white bg-brand box-border border border-white rounded-lg shadow-xs font-medium rounded-base text-sm px-4 py-2.5 focus:outline-none"
      >
        Login
      </button>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="text-white bg-brand box-border border border-white rounded-lg hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none "
      >
        Continue with Google
      </button>
      {errors && <p className="text-red-600">{errors}</p>}
    </form>
  );
}
