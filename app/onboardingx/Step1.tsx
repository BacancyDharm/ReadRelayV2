import { useOnboarding } from "@/hooks/useOnboarding";
import { useUser } from "@/hooks/useUser";
import React, { useState } from "react";

const Step1 = () => {
  const { form, setStep, step } = useOnboarding();
  const [error, setError] = useState("");
  const {user} = useUser();
  const checkAndNext = async () => {
   const valid = await form.trigger('name') 
   if(!valid) return
    const res = await fetch(`/api/checkname?username=${form.getValues().name}`);
    const isNameTaken = await res.json();
    // console.log(isNameTaken.nameTaken)
    if (isNameTaken.nameTaken) {
      setError("Name already taken try another username");
      return;
    }
    setError("");
    setStep(2);
  };
  return (
    <div>
      <h1 className="text-lg">Step 1 : Pick Your Username</h1>
      <label htmlFor="name">Enter your Username: </label>
      <input
        type="text"
        id="name"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkAndNext();
          }
        }}
        {...form.register("name")}
      />
      {error && <p className="text-red-500">{error}</p>}
      {form.formState.errors.name && <p className="text-red-500">{form.formState.errors.name.message}</p>}
      <button type="button" onClick={checkAndNext}>
        Next
      </button>
    </div>
  );
};

export default Step1;
