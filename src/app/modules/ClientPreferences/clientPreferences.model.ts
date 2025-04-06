import mongoose, { Schema } from 'mongoose';

const connectedAccountSchema = new Schema({
  provider: {
    type: String,
    enum: ['google', 'apple', 'facebook'],
    required: true,
  },
  connectedOn: {
    type: Date,
    required: true,
  },
});

const clientPreferencesSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      unique: true,
    },

    // Notifications
    bookingConfirmations: { type: Boolean, default: true },
    bookingReminders: { type: Boolean, default: true },
    bookingCancellations: { type: Boolean, default: true },
    newMessageNotifications: { type: Boolean, default: true },
    appUpdates: { type: Boolean, default: true },
    newAvailability: { type: Boolean, default: true },
    lastMinuteBookings: { type: Boolean, default: true },
    newGuestArtists: { type: Boolean, default: true },
    notificationPreferences: {
      type: [String],
      enum: ['app', 'email', 'sms'],
      default: ['app'],
    },

    // Connected accounts
    connectedAccounts: {
      type: [connectedAccountSchema],
      default: [],
    },

    // Security & Personalization
    twoFactorAuthEnabled: { type: Boolean, default: false },
    personalizedContent: { type: Boolean, default: true },
    locationSuggestions: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ClientPreferences = mongoose.model(
  'ClientPreferences',
  clientPreferencesSchema
);
export default ClientPreferences;
