/* eslint-disable no-unused-vars */
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
  // Fetch the client data
  const client = await Client.findOne({ auth: user._id });

  if (!client) {
    throw new AppError(status.NOT_FOUND, 'Client not found');
  }

  // Define the earth radius in kilometers (6378.1 km) - This is useful for understanding the scale

  const longitude = client.location.coordinates[0]; // Client longitude
  const latitude = client.location.coordinates[1]; // Client latitude
  const radius = client.radius; // Client's search radius (in kilometers)

  // Check if 'query.type' is provided. If not, fetch all types.
  let artistTypeFilter = {};
  if (typeof query?.type === 'string') {
    // Case-insensitive match using regex if type is provided
    artistTypeFilter = {
      type: {
        $regex: new RegExp(query?.type, 'i'), // 'i' for case-insensitive search
      },
    };
  }

  // Aggregation query to find artists within the specified radius
  const artists = await Artist.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude], // Client's location [longitude, latitude]
        },
        distanceField: 'distance', // Add the distance to each artist document
        maxDistance: radius * 1000, // Convert radius to meters (radius is in kilometers, so multiply by 1000)
        spherical: true, // Use spherical geometry to calculate distance accurately
      },
    },
    {
      $match: {
        isActive: true, // Match active artists
        isDeleted: false, // Exclude deleted artists
        isVerified: true, // Optionally, filter only verified artists
        ...artistTypeFilter,
      },
    },
    {
      $lookup: {
        from: 'auths',
        localField: 'auth',
        foreignField: '_id',
        as: 'auth',
      },
    },
    {
      $unwind: {
        path: '$auth',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'artistpreferences',
        localField: '_id',
        foreignField: 'artistId',
        as: 'preferencesDetails',
      },
    },
    {
      $unwind: {
        path: '$preferencesDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //     type: 1,
    //     city: 1,
    //     profileViews: 1,
    //     location: 1,
    //     distance: 1,
    //     'auth._id': 1,
    //     'auth.fullName': 1,
    //     'auth.email': 1,
    //     'auth.phoneNumber': 1,
    //     'auth.image': 1,
    //   },
    // },
  ]);

  return artists;
};

export const ClientService = {
  updateProfile,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacySecuritySettings,
  fetchDiscoverArtistFromDB,
};
