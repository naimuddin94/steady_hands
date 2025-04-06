export const ROLE = {
  CLIENT: 'CLIENT',
  ARTIST: 'ARTIST',
  BUSINESS: 'BUSINESS',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type TRole = keyof typeof ROLE;

export const ARTIST_TYPE = {
  TATOO_ARTIST: 'Tattoo Artist',
  PIEREER: 'Piereer',
} as const;

export type ValueOf<T> = T[keyof T];
export type TArtistType = ValueOf<typeof ARTIST_TYPE>;
