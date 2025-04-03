import { Document, Types } from 'mongoose';

export interface ConnectedAccount {
  provider: 'google' | 'apple' | 'facebook';
  connectedOn: Date;
}

export type NotificationChannel = 'app' | 'email' | 'sms';

export interface IClientPreferences extends Document {
  clientId: Types.ObjectId;

  // Notifications
  bookingConfirmations: boolean;
  bookingReminders: boolean;
  bookingCancellations: boolean;
  newMessageNotifications: boolean;
  appUpdates: boolean;
  newAvailability: boolean;
  lastMinuteBookings: boolean;
  newGuestArtists: boolean;
  notificationPreferences: NotificationChannel[];

  // Connected Accounts
  connectedAccounts: ConnectedAccount[];

  // Security & Personalization
  twoFactorAuthEnabled: boolean;
  personalizedContent: boolean;
  locationSuggestions: boolean;
}
