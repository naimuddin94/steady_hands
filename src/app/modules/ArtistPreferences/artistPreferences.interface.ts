import { Types } from "mongoose";
import { TNotificationChannel } from "../Client/client.constant";
import { ConnectedAccount } from "../ClientPreferences/clientPreferences.interface";

export interface IArtistPreferences extends Document {
    artistId: Types.ObjectId;
  
    // Profile Settings
    showAvailability: boolean;
    publiclyVisibleProfile: boolean;
    onlineStatusVisible: boolean;
  
    // Booking Settings
    cancellationPolicy: '24-hour' | '48-hour' | '72-hour';
    allowDirectMessages: boolean;
  
    // Notification Settings
    bookingRequests: boolean;
    bookingConfirmations: boolean;
    bookingCancellations: boolean;
    eventReminders: boolean;
    newMessages: boolean;
    appUpdates: boolean;
    newAvailability: boolean;
    lastMinuteBookings: boolean;
    newGuestArtists: boolean;
  
    // Notification Channel Preferences
    notificationPreferences: TNotificationChannel[]; // ['app', 'email', 'sms']
  
    // Security
    twoFactorAuthEnabled: boolean;
  
    // Locale Settings
    language: string;          // e.g., 'en-UK'
    dateFormat: string;        // e.g., 'DD/MM/YYYY'
  
    // Connected Accounts
    connectedAccounts: ConnectedAccount[];
  }
  