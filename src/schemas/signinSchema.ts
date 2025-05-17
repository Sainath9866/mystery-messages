import {z} from 'zod'

export const signInSchema = z.object({
    email : z.string().email(),
    password : z.string().min(6, "Password must atleast have 6 characters")
})