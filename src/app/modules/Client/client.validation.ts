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

export const ClientValidation = {
  preferencesSchema,
  notificationSchema,
  privacySecuritySchema,
};
