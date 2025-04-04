import { z } from 'zod';
import {
  artistTypes,
  dateFormats,
  favoritePiercings,
  favoriteTattoos,
  homeViews,
  serviceTypes,
} from './client.constant';

// Reusable validators
const zodEnumFromObject = <T extends Record<string, string>>(obj: T) =>
  z.enum([...Object.values(obj)] as [string, ...string[]]);

const createSchema = z.object({
  body: z
    .object({
      location: z
        .object({
          longitude: z.number().min(-180).max(180),
          latitude: z.number().min(-90).max(90),
        })
        .optional(),

      radius: z.number().min(0).optional(),

      lookingFor: z.array(zodEnumFromObject(serviceTypes)).optional(),

      favoriteTattoos: z.array(zodEnumFromObject(favoriteTattoos)).optional(),

      favoritePiercing: z
        .array(zodEnumFromObject(favoritePiercings))
        .optional(),

      homeView: zodEnumFromObject(homeViews).optional(),

      preferredArtistType: zodEnumFromObject(artistTypes).optional(),

      language: z.string().optional(),

      dateFormat: zodEnumFromObject(dateFormats).optional(),

      country: z.string().optional(),

      notificationPreferences: z
        .union([z.literal('app'), z.literal('email'), z.literal('sms')])
        .array()
        .optional(),
    })
    .strict(),
});

export const clientValidation = {
  createSchema,
};
