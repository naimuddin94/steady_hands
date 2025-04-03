export const ROLE = {
  CLIENT: 'CLIENT',
  ARTIST: 'ARTIST',
  BUSINESS: 'BUSINESS',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type TRole = keyof typeof ROLE;
