import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .min(3, { message: 'First name must be at least 3 characters long' })
      .max(30, { message: 'First name cannot exceed 30 characters' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'First name can only contain letters and spaces',
      }),

    lastName: z
      .string({
        required_error: 'Last name is required',
      })
      .min(3, { message: 'Last name must be at least 3 characters long' })
      .max(30, { message: 'Last name cannot exceed 30 characters' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Last name can only contain letters and spaces',
      }),

    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),

    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'Password must contain at least one special character',
      }),
    country: z.string({
      required_error: 'Country is required',
    }),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body
    .partial()
    .omit({ email: true, password: true })
    
    .strict(),
});

export const UserValidation = {
  createSchema,
  updateSchema,
};
