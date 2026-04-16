'use client'
import { acceptInvitation } from "@/actions/invitations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "at least 2 characters").max(80, "max 80 characters"),
  password: z
    .string()
    .min(8, "at least 8 characters")
    .max(80, "max 80 characters")
    .regex(/[A-Z]/, "must contain an uppercase letter")
    .regex(/[a-z]/, "must contain a lowercase letter")
    .regex(/\d/, "must contain a number")
    .regex(/[@$!%*?&]/, "must contain a special character"),
});

type FormData = z.infer<typeof schema>;

export default function JoinForm({
  token,
  email,
  clubId,
}: {
  token: string;
  email: string;
  clubId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    const result = await acceptInvitation({ ...data, token });
    console.log("result is" ,result); 

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      if (result.redirectTo) router.push(result.redirectTo);
      return;
    }
console.log("reached here")
    router.push(`/clubs/${result.clubId}`);
    // router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor=""
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 foucs:ring-blue-500"
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor=""
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Create a password
        </label>
        <input
          {...register("password")}
          type="password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 foucs:ring-blue-500"
          placeholder="Minimum 8 characters"
        />
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error} </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Joining..." : "Create account & Join club"}
      </button>

      <p className="text-center text-xs text-gray-400">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}
