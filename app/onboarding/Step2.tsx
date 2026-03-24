import { useOnboarding } from "@/hooks/useOnboarding";
import { register } from "module";
import { useRef } from "react";

const Step2 = () => {
  const { form, setStep } = useOnboarding();

  const genreRef = useRef<HTMLInputElement>(null);
  const genre = form.watch("genre_preferences");


const addGenre = () => {
      const val = genreRef.current?.value.trim();
      if(!val) return;
      form.setValue('genre_preferences', [...genre, val]);
      genreRef.current!.value = '';
    }

    const removeGenre = (item: string) => {
      form.setValue(
        "genre_preferences",
        genre.filter((g) => g !== item),
      );
    };

    const checkAndNext = async () => {
      const valid = await form.trigger('headline') && await form.trigger('bio') && await form.trigger('genre_preferences');
      if(!valid) return
      setStep(3);
    }
  return (
    <div>
      <div className="mb-5">
        <label
          htmlFor="headline"
          className="block mb-2.5 text-sm font-medium text-md"
        >Headline</label>
        <input
          type="text"
          id="headline"
          {...form.register("headline")}
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
        />
        {form.formState.errors.headline && (
          <p className="mt-2 text-xs text-red-600">
            {form.formState.errors.headline.message}
          </p>
        )}
      </div>
      <div className="mb-5">
        <label
          htmlFor="bio"
          className="block mb-2.5 text-sm font-medium text-md"
        >Bio</label>
        <textarea
          id="bio"
          {...form.register("bio")}
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body rounded-lg"
        />
        {form.formState.errors.bio && (
          <p className="mt-2 text-xs text-red-600">
            {form.formState.errors.bio.message}
          </p>
        )}
      </div>
      <div className="mb-5">
        <label
          htmlFor="genre"
          className="block mb-2.5 text-sm font-medium text-md"
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
            if (e.key === "Enter") {
              e.preventDefault();
              addGenre();
            }
          }}
        />
        {form.formState.errors.genre_preferences && (
          <p className="mt-2 text-xs text-red-600">
            {form.formState.errors.genre_preferences.message}
          </p>
        )}
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
      <div className="mb-5">
        <button type="button" onClick={() => checkAndNext()}>Next</button>
      </div>
    </div>
  );
};

export default Step2;
