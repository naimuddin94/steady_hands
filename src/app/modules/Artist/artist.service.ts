import Artist from './artist.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose from 'mongoose';
import {
  TUpdateArtistNotificationPayload,
  TUpdateArtistPayload,
  TUpdateArtistPreferencesPayload,
  TUpdateArtistPrivacySecurityPayload,
  TUpdateArtistProfilePayload,
} from './artist.validation';
import ArtistPreferences from '../ArtistPreferences/artistPreferences.model';
import fs from 'fs';

const updateProfile = async (
  user: IAuth,
  payload: TUpdateArtistProfilePayload
) => {
  const artist = await Artist.findOne({ auth: user._id });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Artist.findByIdAndUpdate(user._id, payload, { session });

    const updatedArtist = await Artist.findOne({ auth: user._id }).populate(
      'auth'
    );

    await session.commitTransaction();
    session.endSession();
    return updatedArtist;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update artist profile'
    );
  }
};

const updatePreferences = async (
  user: IAuth,
  payload: TUpdateArtistPreferencesPayload
) => {
  const artist = await Artist.findOne({
    auth: user._id,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const artistPreferences = await ArtistPreferences.findOne({
    artistId: artist._id,
  });

  if (!artistPreferences) {
    throw new AppError(status.NOT_FOUND, 'Artist preferences not found');
  }

  Object.assign(artistPreferences, payload);
  await artistPreferences.save();

  return artistPreferences;
};

const updateNotificationPreferences = async (
  user: IAuth,
  payload: TUpdateArtistNotificationPayload
) => {
  const artist = await Artist.findOne({
    auth: user._id,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const artistPreferences = await ArtistPreferences.findOne({
    artistId: artist._id,
  });

  if (!artistPreferences) {
    throw new AppError(status.NOT_FOUND, 'Artist preferences not found');
  }

  Object.assign(artistPreferences, payload);
  await artistPreferences.save();

  return artistPreferences;
};

const updatePrivacySecuritySettings = async (
  user: IAuth,
  payload: TUpdateArtistPrivacySecurityPayload
) => {
  const artist = await Artist.findOne({
    auth: user._id,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const artistPreferences = await ArtistPreferences.findOne({
    artistId: artist._id,
  });

  if (!artistPreferences) {
    throw new AppError(status.NOT_FOUND, 'Artist preferences not found');
  }

  Object.assign(artistPreferences, payload);
  await artistPreferences.save();

  return artistPreferences;
};

const addFlashesIntoDB = async (
  user: IAuth,
  files: Express.Multer.File[] | undefined
) => {
  const artist = await Artist.findOne({
    auth: user._id,
    isActive: true,
    isDeleted: false,
    isVerified: true,
  });

  console.log(artist);

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  if (!files || !files?.length) {
    throw new AppError(status.BAD_REQUEST, 'Files are required');
  }

  return await Artist.findByIdAndUpdate(
    artist._id,
    {
      $push: {
        flashes: { $each: files.map((file) => file.path) },
      },
    },
    { new: true }
  );
};

const removeImage = async (user: IAuth, filePath: string) => {
  const artist = await Artist.findOne({
    auth: user._id,
    isActive: true,
    isDeleted: false,
    isVerified: true,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  // Remove the image file path from the 'flashes' array
  const updatedArtist = await Artist.findByIdAndUpdate(
    artist._id,
    {
      $pull: {
        flashes: filePath,
        portfolio: filePath,
      },
    },
    { new: true }
  );

  if (!updatedArtist) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to remove flash image'
    );
  }

  // Check if the file exists and delete it
  fs.unlink(filePath, () => {});

  return updatedArtist;
};

const updateArtistPersonalInfoIntoDB = async (
  user: IAuth,
  payload: TUpdateArtistPayload
) => {
  const artist = await Artist.findOne({ auth: user._id });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  await ArtistPreferences.findOneAndUpdate({ artistId: artist._id }, payload, {
    new: true,
  });

  return await Artist.findOneAndUpdate({ auth: user._id }, payload, {
    new: true,
  }).populate('preferences');
};

export const ArtistService = {
  updateProfile,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacySecuritySettings,
  addFlashesIntoDB,
  removeImage,
  updateArtistPersonalInfoIntoDB,
};
