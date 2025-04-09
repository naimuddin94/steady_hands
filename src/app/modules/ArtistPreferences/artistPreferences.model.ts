import mongoose, { Schema } from 'mongoose';

const connectedAccountSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ['google', 'apple', 'facebook'],
      required: true,
    },
    connectedOn: {
      type: Date,
      required: true,
    },
  },
  { _id: false } // ✅ Disable _id for this sub-schema
);

const artistPreferencesSchema = new Schema(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      unique: true,
    },

    // Profile Settings
    showAvailability: { type: Boolean, default: true },
    publiclyVisibleProfile: { type: Boolean, default: true },
    onlineStatusVisible: { type: Boolean, default: false },

    // Booking Settings
    cancellationPolicy: {
      type: String,
      enum: ['24-hour', '48-hour', '72-hour'],
      default: '24-hour',
    },
    allowDirectMessages: { type: Boolean, default: true },

    // Notification Settings (all default: true now)
    bookingRequests: { type: Boolean, default: true },
    bookingConfirmations: { type: Boolean, default: true },
    bookingCancellations: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    newMessages: { type: Boolean, default: true },
    appUpdates: { type: Boolean, default: true },
    newAvailability: { type: Boolean, default: true },
    lastMinuteBookings: { type: Boolean, default: true },
    newGuestArtists: { type: Boolean, default: true },

    // Notification Channels
    notificationPreferences: {
      type: [String],
      enum: ['app', 'email', 'sms'],
      default: ['app'],
    },

    // Security
    twoFactorAuthEnabled: { type: Boolean, default: false },

    // Locale
    language: { type: String, default: 'en-UK' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },

    // Connected Accounts
    connectedAccounts: [connectedAccountSchema],
  },
  {
    timestamps: true,
    versionKey: false, // ✅ Disable __v field
  }
);

const ArtistPreferences = mongoose.model(
  'ArtistPreferences',
  artistPreferencesSchema
);

export default ArtistPreferences;
