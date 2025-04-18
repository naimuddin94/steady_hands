import { z } from 'zod';
import { WEEK_DAYS } from '../Artist/artist.constant';

// MongoDB ObjectId regex pattern
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Zod schema for the booking
const bookingSchema = z.object({
  body: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, 'Invalid date format')
      .transform((str) => {
        const date = new Date(str);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date string');
        }
        return date;
      }), // This will convert the string to a Date object
    slotId: z
      .string({ required_error: 'Slot id is required' })
      .regex(objectIdPattern, 'Invalid Slot ID format'),
  }),
});

// Zod schema for the slots
export const BookingValidation = {
  bookingSchema,
};

export type TBookingData = z.infer<typeof bookingSchema.shape.body>;
