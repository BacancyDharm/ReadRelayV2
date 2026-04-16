"use client";

import { createSchedule } from "@/actions/schedule";
import {
  sectionSchema,
  scheduleSchema,
  type ScheduleSchemaType as FormData,
} from "@/types/section.shcema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { flushSync } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";

interface Props {
  clubBookId: string;
  pageCount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ScheduleForm({
  clubBookId,
  pageCount,
  onSuccess,
  onCancel,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      club_book_id: clubBookId,
      page_count: pageCount,
      sections: [
        {
          section_number: 1,
          start_page: 1,
          end_page: 0,
          deadline: "",
          title: "",
        },
        {
          section_number: 2,
          start_page: 0,
          end_page: pageCount,
          deadline: "",
          title: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const sections = watch("sections");

  const handleEndPageChange = (index: number, value: string) => {
    const endPage = parseInt(value);
    if(!isNaN(endPage) && index < fields.length - 1){
      setValue(`sections.${index + 1}.start_page`, endPage + 1);
    }
  };

  const addSection = () => {
    if(fields.length >= 8) return

    const lastSection = sections[sections.length -1]
    const newStart = lastSection.end_page ? (lastSection.end_page as number + 1) : 0

    const insertIndex = fields.length - 1;

    append({
      section_number: fields.length + 1,
      start_page: newStart,
      end_page: 0,
      deadline: "",
      title: "",
    })

    setValue(`sections.${fields.length}.end_page`, pageCount)
  };

  const removeSection = (index: number) => {
    if(fields.length <= 2) return
    remove(index);

    const updated = watch('sections');
    updated.forEach((_, i) => {
      setValue(`sections.${i}.section_number`, i + 1)
    })

    if(index > 0 && index < updated.length){
      setValue(`sections.${index}.start_page`, updated[index-1].end_page as number+ 1) 
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError(null);

    const result = await createSchedule({
      club_book_id: data.club_book_id,
      page_count: data.page_count,
      sections: data.sections.map((s, i) => ({
        ...s,
        title: s.title as string,
        start_page: s.start_page as number,
        end_page: s.end_page as number,
        section_number: i + 1,
      }))
    })

    if(result.error){
      setServerError(result.error);
      setIsLoading(false);
      return;
    }

    onSuccess()
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">
            Create Reading Schedule
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Book has {pageCount} pages · {fields.length} sections
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit,(e) => console.log(e))} className="space-y-3">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Section {index + 1}
                </span>
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-3">
                <input
                  {...register(`sections.${index}.title`)}
                  placeholder={`Section ${index + 1} title (optional)`}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="">
                  <label className="block text-xs text-gray-500 mb-1">
                    Start page
                  </label>
                  <input
                    type="number"
                    {...register(`sections.${index}.start_page`)}
                    readOnly={index === 0}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      index === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white border-gray-200"
                    }`}
                  />
                  {errors.sections?.[index]?.start_page && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.sections[index].start_page.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    End Page
                  </label>
                  <input
                    type="number"
                    {...register(`sections.${index}.end_page`)}
                    readOnly={index === fields.length - 1}
                    onChange={(e) => {
                      register(`sections.${index}.end_page`).onChange(e);
                      handleEndPageChange(index, e.target.value);
                    }}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      index === fields.length - 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white border-gray-200"
                    }`}
                  />
                  {errors.sections?.[index]?.end_page && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.sections[index]?.end_page?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Deadline
                  </label>
                  <input
                    {...register(`sections.${index}.deadline`)}
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  {errors.sections?.[index]?.deadline && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.sections[index]?.deadline?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {fields.length < 8 && (
          <button
            type="button"
            onClick={addSection}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-400 transition-colors"
          >
            + Add Section
          </button>
        )}

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            Schedule covers pages 1 -{" "}
            {` ${sections[sections.length - 1].end_page ?? "?"} of ${pageCount} ${sections[sections.length - 1].end_page === pageCount ? "complete" : "/"}`}
            {/* todo remain after : */}
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}
