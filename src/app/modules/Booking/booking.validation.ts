import { z } from 'zod';

// Helper function to validate time format and convert to minutes for comparison
const timeFormat = /^\d{2}:\d{2}$/;

// Function to compare start and end time
const validateTimeSlot = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Convert times to minutes
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  return endTimeInMinutes > startTimeInMinutes;
};

// Helper function to check for duplicate time slots
const hasDuplicateSlots = (slots: { start: string; end: string }[]) => {
  const times = slots.map((slot) => `${slot.start}-${slot.end}`);
  return new Set(times).size !== times.length; // If the size of the set is different, duplicates exist
};

// Zod schema for the booking
const bookingSchema = z.object({
  body: z.object({
    artistId: z.string().min(1, 'Artist ID is required'),
    userId: z.string().min(1, 'User ID is required'),
    date: z.date(),  // Date of the booking
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
      message: 'Invalid day of the week',
    }),
    slotId: z.string().min(1, 'Slot ID is required'),
  }),
});

// Zod schema for the slots
export const BookingValidation = {
  bookingSchema
};
