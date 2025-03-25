export const USER_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
} as const;

export type TRole = keyof typeof USER_ROLE;
