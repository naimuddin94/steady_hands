import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';

// Define the validation schemas under the "body" object for each section
const artistProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, 'Full name is required'),
    email: z.string().email('Invalid email format'),
    phoneNumber: z.string().min(10, 'Phone number is required'),
    country: z.string().min(2, 'Country is required'),
  }),
});

const artistPreferencesSchema = z.object({
  body: z.object({
    showAvailability: z.boolean().optional(),
    publiclyVisibleProfile: z.boolean().optional(),
    cancellationPolicy: z.enum(['24-hour', '48-hour', '72-hour']),
    allowDirectMessages: z.boolean(),
    notificationPreferences: z.array(z.enum(['app', 'email', 'sms'])),
    twoFactorAuthEnabled: z.boolean(),
  }),
});

const artistNotificationSchema = z.object({
  body: z.object({
    bookingRequests: z.boolean(),
    bookingConfirmations: z.boolean(),
    bookingCancellations: z.boolean(),
    eventReminders: z.boolean(),
    newMessages: z.boolean(),
    appUpdates: z.boolean(),
    newAvailability: z.boolean(),
    lastMinuteBookings: z.boolean(),
    newGuestArtists: z.boolean(),
    notificationPreferences: z.array(z.enum(['app', 'email', 'sms'])),
  }),
});

const artistPrivacySecuritySchema = z.object({
  body: z.object({
    twoFactorAuthEnabled: z.boolean(),
    language: z.string(),
    dateFormat: z.string(),
  }),
});

// Type definitions based on the updated schemas
export type TUpdateArtistProfilePayload = z.infer<
  typeof artistProfileSchema.shape.body
>;
export type TUpdateArtistPreferencesPayload = z.infer<
  typeof artistPreferencesSchema.shape.body
>;
export type TUpdateArtistNotificationPayload = z.infer<
  typeof artistNotificationSchema.shape.body
>;
export type TUpdateArtistPrivacySecurityPayload = z.infer<
  typeof artistPrivacySecuritySchema.shape.body
>;

const updateSchema = z.object({
  body: z
    .object({
      // Profile Info
      fullName: z.string().optional(),
      email: z.string().email('Invalid email format').optional(),
      phoneNumber: z
        .string()
        .refine(
          (val) => {
            const parsed = parsePhoneNumberFromString(val);
            return parsed?.isValid();
          },
          {
            message: 'Phone number must be a valid international format',
          }
        )
        .optional(),
      country: z.string().optional(),

      // Preferences
      showAvailability: z.boolean().optional().optional(),
      publiclyVisibleProfile: z.boolean().optional().optional(),
      cancellationPolicy: z.enum(['24-hour', '48-hour', '72-hour']).optional(),
      allowDirectMessages: z.boolean(),
      notificationPreferences: z
        .array(z.enum(['app', 'email', 'sms']))
        .optional(),
      twoFactorAuthEnabled: z.boolean().optional(),

      // Notifications
      bookingRequests: z.boolean().optional(),
      bookingConfirmations: z.boolean().optional(),
      bookingCancellations: z.boolean().optional(),
      eventReminders: z.boolean().optional(),
      newMessages: z.boolean().optional(),
      appUpdates: z.boolean().optional(),
      newAvailability: z.boolean().optional(),
      lastMinuteBookings: z.boolean().optional(),
      newGuestArtists: z.boolean().optional(),

      // Privacy & Security
      language: z.string().optional(),
      dateFormat: z.string().optional(),

      // Artist-specific fields
      artistType: z.enum(['tattoo', 'piercing', 'both']).optional(),
      expertise: z
        .array(z.enum(['realism', 'traditional', 'neo-traditional']))
        .optional(),
      studioName: z.string().optional(),
      city: z.string().optional(),
      location: z
        .object({
          longitude: z.number().min(-180).max(180),
          latitude: z.number().min(-90).max(90),
        })
        .optional(),
    })
    .strict(),
});

export const ArtistValidation = {
  artistProfileSchema,
  artistPreferencesSchema,
  artistNotificationSchema,
  artistPrivacySecuritySchema,
  updateSchema,
};
