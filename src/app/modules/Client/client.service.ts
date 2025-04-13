import ClientPreferences from '../ClientPreferences/clientPreferences.model';
import Client from './client.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose from 'mongoose';
import { TProfilePayload } from '../Auth/auth.validation';
import fs from 'fs';
import { FavoriteTattoo } from './client.constant';
import { z } from 'zod';
import {
  TUpdatePreferencePayload,
  TUpdateProfilePayload,
} from './client.validation';
import Auth from '../Auth/auth.model';

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

export const ClientService = {
  updateProfile,
  updatePreferences,
};
