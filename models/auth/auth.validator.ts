import {email, z} from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const registrationSchema = z.object({
    name: z.string().min(4,"The name should be at least 4 characters long"),
    email: z.email(),
    password: z.string().min(8, "the password must be at least 8 characters long").regex(passwordValidation, "the password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    role: z.enum(["ADMIN", "LEADER", "MEMBER", "GUEST"])
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "the password must be at least 8 characters long").regex(passwordValidation, "the password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
})