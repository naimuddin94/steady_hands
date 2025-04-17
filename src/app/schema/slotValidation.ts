import { z } from 'zod';
import { WEEK_DAYS } from '../modules/Artist/artist.constant';

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

// Helper function to check if any time slots overlap
const hasOverlap = (slots: { start: string; end: string }[]) => {
  const times = slots.map((slot) => ({
    start: slot.start,
    end: slot.end,
    startInMinutes: convertToMinutes(slot.start),
    endInMinutes: convertToMinutes(slot.end),
  }));

  for (let i = 0; i < times.length; i++) {
    for (let j = i + 1; j < times.length; j++) {
      const slot1 = times[i];
      const slot2 = times[j];

      // Check if slot1 overlaps with slot2
      if (
        slot1.startInMinutes < slot2.endInMinutes &&
        slot1.endInMinutes > slot2.startInMinutes
      ) {
        return true;
      }
    }
  }

  return false;
};

// Convert time to minutes
const convertToMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

// Check time valid range
const isValidTimeRange = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

// Zod validation schema
const createSchema = z.object({
  body: z.object({
    day: z.enum(WEEK_DAYS),
    slots: z
      .array(
        z
          .object({
            start: z
              .string()
              .regex(timeFormat, 'Start time must be in HH:MM format')
              .refine(isValidTimeRange, {
                message:
                  'Start time must be a valid time within 00:00 to 23:59',
              }),
            end: z
              .string()
              .regex(timeFormat, 'End time must be in HH:MM format')
              .refine(isValidTimeRange, {
                message: 'End time must be a valid time within 00:00 to 23:59',
              }),
          })
          .refine((data) => validateTimeSlot(data.start, data.end), {
            message: 'End time must be later than start time',
            path: ['end'], // Indicating where to report the error
          })
      )
      .refine((slots) => !hasDuplicateSlots(slots), {
        message: 'There are duplicate time slots',
        path: ['slots'], // Indicating where to report the error
      })
      .refine((slots) => !hasOverlap(slots), {
        message: 'There are overlapping time slots',
        path: ['slots'], // Indicating where to report the error
      }),
  }),
});

export const SlotValidation = {
  createSchema,
};

export type TAvailability = z.infer<typeof createSchema.shape.body>;
