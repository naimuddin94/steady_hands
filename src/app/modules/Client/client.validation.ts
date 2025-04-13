import { z } from 'zod';
import {
  homeViews,
  favoriteTattoos,
  favoritePiercings,
  artistTypes,
  dateFormats,
  notificationChannel,
} from './client.constant';

const preferencesSchema = z.object({
  body: z.object({
    // Favorite Tattoo Styles (Array of favorite tattoo styles)
    favoriteTattooStyles: z
      .array(z.enum(Object.values(favoriteTattoos) as [string, ...string[]]))
      .min(1, 'Please select at least one favorite tattoo style.')
      .optional(),

    // Favorite Piercings (Array of favorite piercing styles)
    favoritePiercings: z
      .array(z.enum(Object.values(favoritePiercings) as [string, ...string[]]))
      .min(1, 'Please select at least one favorite piercing.')
      .optional(),

    // Default Home View (Grid View, Map View, or Both)
    defaultHomeView: z
      .enum(Object.values(homeViews) as [string, ...string[]])
      .default(homeViews.BOTH)
      .optional(),

    // Preferred Artist Type (Tattoo Artist, Piercers, or Both)
    preferredArtistType: z
      .enum(Object.values(artistTypes) as [string, ...string[]])
      .default(artistTypes.BOTH)
      .optional(),

    // Language (string, can be an array of languages based on application preferences)
    language: z.string().min(1, 'Language is required').optional(),

    // Date Format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
    dateFormat: z
      .enum(Object.values(dateFormats) as [string, ...string[]])
      .default(dateFormats.DDMMYYYY)
      .optional(),

    // Notification Channels (app, email, sms)
    notificationChannels: z
      .array(
        z.enum(Object.values(notificationChannel) as [string, ...string[]])
      )
      .min(1, 'Please select at least one notification channel.')
      .optional(),
  }),
});

const notificationSchema = z.object({
  body: z.object({
    bookingConfirmations: z.boolean().optional(),
    bookingReminders: z.boolean().optional(),
    bookingCancellations: z.boolean().optional(),
    newMessageNotifications: z.boolean().optional(),
    appUpdates: z.boolean().optional(),
    newAvailability: z.boolean().optional(),
    lastMinuteBookings: z.boolean().optional(),
    newGuestArtists: z.boolean().optional(),
    notificationChannels: z
      .array(
        z.enum(Object.values(notificationChannel) as [string, ...string[]])
      )
      .min(1, 'Please select at least one notification channel.')
      .optional(),
  }),
});

const privacySecuritySchema = z.object({
  body: z.object({
    twoFactorAuthentication: z.boolean().optional(),
    personalizedContent: z.boolean().optional(),
    locationBasedSuggestions: z.boolean().optional(),
  }),
});

const profileInfoSchema = z.object({
  body: z
    .object({
      email: z.string().email({ message: 'Invalid email format' }).optional(),
      fullName: z
        .string()
        .nonempty('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
      country: z.string().nonempty('Country is required').optional(),
    })
    .strict(),
});

const clientPreferencesSchema = z.object({
  body: z.object({
    favoriteTattooStyles: z
      .array(z.enum(Object.values(favoriteTattoos) as [string, ...string[]]))
      .min(1, 'Please select at least one favorite tattoo style.')
      .optional(),

    favoritePiercings: z
      .array(z.enum(Object.values(favoritePiercings) as [string, ...string[]]))
      .min(1, 'Please select at least one favorite piercing.')
      .optional(),

    defaultHomeView: z
      .enum(Object.values(homeViews) as [string, ...string[]])
      .default(homeViews.BOTH)
      .optional(),

    preferredArtistType: z
      .enum(Object.values(artistTypes) as [string, ...string[]])
      .default(artistTypes.BOTH)
      .optional(),

    language: z.string().min(1, 'Language is required').optional(),

    dateFormat: z
      .enum(Object.values(dateFormats) as [string, ...string[]])
      .default(dateFormats.DDMMYYYY)
      .optional(),

    notificationChannels: z
      .array(
        z.enum(Object.values(notificationChannel) as [string, ...string[]])
      )
      .min(1, 'Please select at least one notification channel.')
      .optional(),
  }),
});

const NotificationPreferencesSchema = z.object({
  body: z.object({
    bookingConfirmations: z.boolean().optional(),
    bookingReminders: z.boolean().optional(),
    bookingCancellations: z.boolean().optional(),
    newMessageNotifications: z.boolean().optional(),
    appUpdates: z.boolean().optional(),
    newAvailability: z.boolean().optional(),
    lastMinuteBookings: z.boolean().optional(),
    newGuestArtists: z.boolean().optional(),
    notificationChannels: z
      .array(z.enum(['app', 'email', 'sms']))
      .min(1, 'Please select at least one notification channel.')
      .optional(),
  }),
});

export type TUpdateProfilePayload = z.infer<
  typeof profileInfoSchema.shape.body
>;

export type TUpdatePreferencePayload = z.infer<
  typeof clientPreferencesSchema.shape.body
>;

export type TUpdateNotificationPayload = z.infer<
  typeof NotificationPreferencesSchema.shape.body
>;

export const ClientValidation = {
  preferencesSchema,
  notificationSchema,
  privacySecuritySchema,
  profileInfoSchema,
  clientPreferencesSchema,
};
