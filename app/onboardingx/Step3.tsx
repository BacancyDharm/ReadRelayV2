import { useOnboarding } from "@/hooks/useOnboarding";
import React from "react";

const Step3 = () => {
  const { form, setStep, step } = useOnboarding();
  const onSubmit = async () => {
    const data = form.getValues();
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },            
      body: JSON.stringify({...data, name: form.getValues().name, onboarding: true}),
    })
    if(res.ok){
      setStep(4)
    }
    else{
      const error = await res.json()
      alert(error.message)
    }
  };
  return (
    <>
      <label className="w-80 inline-flex cursor-pointer p-4 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
        <input
          type="checkbox"
          {...form.register("notification_preferences.new_member_joined")}
          className="sr-only peer"
        />
        <div className="shrink-0 relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
        <div className="ms-2.5 select-none">
          <p className="text-sm font-medium text-heading mb-1">New Members</p>
          <p className="text-sm font-normal text-body">
            Send Email when new members join
          </p>
        </div>
      </label>

      <label className="w-80 inline-flex cursor-pointer p-4 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
        <input
          type="checkbox"
          {...form.register("notification_preferences.member_fell_behind")}
          className="sr-only peer"
        />
        <div className="shrink-0 relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
        <div className="ms-2.5 select-none">
          <p className="text-sm font-medium text-heading mb-1">
            Member Fall Behind
          </p>
          <p>Send me email when a member falls behind</p>
        </div>
      </label>

      <label className="w-80 inline-flex cursor-pointer p-4 bg-neutral-primary-soft border border-default rounded-base shadow-xs">
        <input
          type="checkbox"
          {...form.register("notification_preferences.discusstion_post")}
          className="sr-only peer"
        />
        <div className="shrink-0 relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
        <div className="ms-2.5 select-none">
          <p className="text-sm font-medium text-heading mb-1">Discussion</p>
          <p className="text-sm font-normal text-body">
            Send me email when there is a discussion
          </p>
        </div>
      </label>

      <button
        onClick={() => {
          onSubmit();
        }}
      >
        check status
      </button>
    </>
  );
};

export default Step3;
