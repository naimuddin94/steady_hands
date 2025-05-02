import { z } from 'zod';
import { WEEK_DAYS } from '../Artist/artist.constant';
import { BOOKING_STATUS } from './booking.constant';

// MongoDB ObjectId regex
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// Booking validation schema
const bookingSchema = z.object({
  body: z.object({
    artist: z
      .string({ required_error: 'Artist ID is required' })
      .regex(objectIdPattern, 'Invalid artist ID format'),
    service: z.string({ required_error: 'Service is required' }),
    serviceType: z.string({ required_error: 'Service type is required' }),
    bodyLocation: z.string({ required_error: 'Body location is required' }),
    description: z.string({ required_error: 'Description is required' }),

    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
        'Invalid date format'
      )
      .transform((str) => {
        const date = new Date(str);
        if (isNaN(date.getTime())) throw new Error('Invalid date string');
        return date;
      }),

    day: z.enum(WEEK_DAYS, {
      required_error: 'Day is required and must be valid weekday',
    }),

    slotId: z
      .string({ required_error: 'Slot ID is required' })
      .regex(objectIdPattern, 'Invalid slot ID format'),

    paymentIntentId: z.string().optional(),
    transactionId: z.string().optional(),

    status: z
      .enum([...Object.values(BOOKING_STATUS)] as [string, ...string[]])
      .optional(),
  }),
});

export const BookingValidation = {
  bookingSchema,
};

export type TBookingData = z.infer<typeof bookingSchema.shape.body>;
