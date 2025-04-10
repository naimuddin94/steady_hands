import { z } from 'zod';

const profileInfoSchema = z.object({
  body: z
    .object({
      fullName: z
        .string()
        .nonempty('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

      email: z
        .string()
        .email('Invalid email address')
        .nonempty('Email is required')
        .optional(),

      country: z.string().nonempty('Country is required').optional(),
    })
    .strict(),
});

export type TUpdateProfilePayload = z.infer<typeof profileInfoSchema.shape.body>;

export const SharedValidation = { profileInfoSchema };
