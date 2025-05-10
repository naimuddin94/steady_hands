import ClientPreferences from '../ClientPreferences/clientPreferences.model';
import Client from './client.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose from 'mongoose';
import {
  TUpdateNotificationPayload,
  TUpdatePreferencePayload,
  TUpdateProfilePayload,
  TUpdateSecuritySettingsPayload,
} from './client.validation';
import Auth from '../Auth/auth.model';
import Artist from '../Artist/artist.model';
import ArtistPreferences from '../ArtistPreferences/artistPreferences.model';

const updateProfile = async (user: IAuth, payload: TUpdateProfilePayload) => {
  const client = await Client.findOne({ auth: user._id });

  if (!client) {
    throw new AppError(status.NOT_FOUND, 'Client not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Auth.findByIdAndUpdate(user._id, payload, { session });

    const response = await Client.findOneAndUpdate(
      { auth: user._id },
      { country: payload.country },
      { new: true, session }
    ).populate([
      {
        path: 'auth',
        select: 'fullName email phoneNumber',
      },
    ]);

    await session.commitTransaction();
    session.endSession();

    return response;
  } catch {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Something went wrong while updating profile data'
    );
  }
};

const updatePreferences = async (
  user: IAuth,
  payload: TUpdatePreferencePayload
) => {
  // Find the client using the auth user_id
  const client = await Client.findOne({ auth: user._id });
  if (!client) {
    throw new AppError(status.NOT_FOUND, 'Client not found');
  }

  // Find and update preferences, or create new ones if not found
  const preferences = await ClientPreferences.findOneAndUpdate(
    { clientId: client._id },
    payload,
    { new: true, upsert: true }
  );

  if (!preferences) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Error updating preferences'
    );
  }

  return preferences;
};

const updateNotificationPreferences = async (
  user: IAuth,
  payload: TUpdateNotificationPayload
) => {
  // Step 1: Find the client
  const client = await Client.findOne({ auth: user._id });
  if (!client) {
    throw new AppError(status.NOT_FOUND, 'Client not found');
  }

  // Step 2: Find and update the client's notification preferences
  const preferences = await ClientPreferences.findOneAndUpdate(
    { clientId: client._id },
    {
      bookingConfirmations: payload.bookingConfirmations,
      bookingReminders: payload.bookingReminders,
      bookingCancellations: payload.bookingCancellations,
      newMessageNotifications: payload.newMessageNotifications,
      appUpdates: payload.appUpdates,
      newAvailability: payload.newAvailability,
      lastMinuteBookings: payload.lastMinuteBookings,
      newGuestArtists: payload.newGuestArtists,
      notificationChannels: payload.notificationChannels,
    },
    { new: true }
  );

  if (!preferences) {
    throw new AppError(
      status.NOT_FOUND,
      'Preferences not found for this client'
    );
  }

  // Return the updated preferences
  return preferences;
};

const updatePrivacySecuritySettings = async (
  user: IAuth,
  payload: TUpdateSecuritySettingsPayload
) => {
  const clientPreferences = await ClientPreferences.findOne({
    clientId: user._id,
  });

  if (!clientPreferences) {
    throw new AppError(status.NOT_FOUND, 'Client preferences not found');
  }

  if (payload.twoFactorAuthEnabled !== undefined) {
    clientPreferences.twoFactorAuthEnabled = payload.twoFactorAuthEnabled;
  }
  if (payload.personalizedContent !== undefined) {
    clientPreferences.personalizedContent = payload.personalizedContent;
  }
  if (payload.locationSuggestions !== undefined) {
    clientPreferences.locationSuggestions = payload.locationSuggestions;
  }

  await clientPreferences.save();

  return clientPreferences;
};

const fetchDiscoverArtistFromDB = async (
  user: IAuth,
  query: Record<string, unknown>
) => {
  const client = await Client.findOne({ auth: user._id });

  if (!client) {
    throw new AppError(status.NOT_FOUND, 'Client not found');
  }

  const preference = await ClientPreferences.findOne({ clientId: client?._id });

  // const artists = await Artist.find({
  //   isActive: true,
  //   isDeleted: false,
  //   isVerified: true,
  // }).populate([
  //   {
  //     path: 'auth',
  //     select: 'fullName image email phoneNumber isProfile',
  //   },
  // ]);

  // Assuming you have geospatial data in the "location" field of the artist model
  const artists = await Artist.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [90.4125, 23.8103], // client's location
        },
        distanceField: 'distance', // The field to store the distance
        maxDistance: client.radius * 1000, // Convert radius to meters
        spherical: true, // Use spherical geometry for distance calculations
      },
    },
    {
      $match: {
        isActive: true,
        isDeleted: false,
        isVerified: true,
      },
    },
    {
      $lookup: {
        from: 'clients', // Assuming the artists have a client reference
        localField: 'auth',
        foreignField: '_id',
        as: 'authDetails',
      },
    },
    {
      $unwind: '$authDetails', // Unwind the authDetails array to access the fields directly
    },
    {
      $project: {
        _id: 1,
        type: 1,
        city: 1,
        profileViews: 1,
        isVerified: 1,
        distance: 1, // Include distance in the response
        'authDetails.fullName': 1,
        'authDetails.image': 1,
        'authDetails.email': 1,
        'authDetails.phoneNumber': 1,
        'authDetails.isProfile': 1,
      },
    },
  ]);

  const artistPreference = await ArtistPreferences.find({});

  console.log({ client, preference, query, artists, artistPreference });
};

export const ClientService = {
  updateProfile,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacySecuritySettings,
  fetchDiscoverArtistFromDB,
};
