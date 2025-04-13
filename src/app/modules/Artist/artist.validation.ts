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


export const ArtistValidation = {
  artistProfileSchema,
  artistPreferencesSchema,
  artistNotificationSchema,
  artistPrivacySecuritySchema,
};
