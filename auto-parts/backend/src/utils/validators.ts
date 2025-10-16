import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});


export const partSchema = z.object({
    name: z.string().min(1),
    brand: z.string().optional(),
    price: z.number().nonnegative(),
    stock: z.number().int().nonnegative(),
    category: z.string().optional()
});