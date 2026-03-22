import {email, z} from 'zod';
import { no } from 'zod/v4/locales';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const registrationSchema = z.object({
    name: z.string().min(4,"The name should be at least 4 characters long"),
    email: z.email(),
    password: z.string().min(8, "the password must be at least 8 characters long").regex(passwordValidation, "the password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    role: z.enum(["ADMIN", "LEADER", "MEMBER", "GUEST"])
})

export type RegistrationSchemaType = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "the password must be at least 8 characters long").regex(passwordValidation, "the password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
})

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const OnboardingSchema = z.object({
    name: z.string().min(4,"The name should be at least 4 characters long"),
    headline: z.string().min(4,"The headline should be at least 4 characters long").max(80, "The headline should be at most 80 characters long"),
    bio: z.string().min(4,"The bio should be at least 4 characters long").max(300, "The bio should be at most 300 characters long"),
    genre_preferences: z.array(z.string()).min(1, "You must select at least one genre").max(5, "You can select a maximum of 5 genres"),
    notification_preferences: z.object({
        discusstion_post: z.boolean(),
        new_member_joined: z.boolean(),
        member_fell_behind: z.boolean()
    }),
})

export type OnboardingSchemaType = z.infer<typeof OnboardingSchema>