import {z} from 'zod'

export const usernameValidation = z.
    string()
    .min(2, "atleast 2 character")
    .max(20, "username must not contain more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid Email"}),
    password : z.string().min(6, {message : "Password must be atleast 6 characters"})
})