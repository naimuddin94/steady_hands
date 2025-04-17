export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRM: 'confirmed',
    CANCELLED: 'cancelled',
  } as const;
  
  export type TBookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
  