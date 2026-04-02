import { z } from "zod"

export const sectionSchema = z.object({
    section_number: z.number(),
    title: z.string().optional(),
    start_page: z.coerce.number().min(1, 'Required'),
    end_page: z.coerce.number().min(1, 'Required'),
    deadline: z.string().min(1, 'Required'),
})


export const scheduleSchema = z.object({
    club_book_id: z.uuid(),
    page_count: z.number(),
    sections: z.array(sectionSchema).min(2, "At least 2 sections are required").max(8, 'Maximum 8 sections allowed').superRefine((sections, ctx) => {
        sections.forEach((section, index) => {
            if(index === 0 && section.start_page !== 1){
                ctx.addIssue({
                    code: 'custom',
                    path: [index, 'start_page'],
                    message: 'First section must start at page 1'
                })
            }

            if(index > 0 ){
                const expectedStart = sections[index - 1].end_page + 1
                if(section.start_page !== expectedStart){
                    ctx.addIssue({
                        code: 'custom',
                        path: [index, 'start_page'],
                        message: `Start page must be ${expectedStart}`
                    })
                }
            }

            if(section.end_page <= section.start_page){
                ctx.addIssue({
                    code: 'custom',
                    path: [index, 'end_page'],
                    message: 'End page must be greater than start page'
                })
            }

            if(index > 0){
                const prevDeadline = new Date(sections[index - 1].deadline);
                const thisDeadline = new Date(section.deadline);
                if(prevDeadline > thisDeadline){
                    ctx.addIssue({
                        code: 'custom',
                        path: [index, 'deadline'],
                        message: 'Deadline must be greater than previous deadline'
                    })
                }
            }
        })
    })
})

export type ScheduleSchemaType = z.input<typeof scheduleSchema>

