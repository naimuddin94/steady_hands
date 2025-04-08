/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateOtp } from '../../lib';
import sendOtpSms from '../../utils/sendOtpSms';
import { IAuth } from './auth.interface';
import config from '../../config';
import { AppError } from '../../utils';
import status from 'http-status';
import Auth from './auth.model';
import { TProfilePayload } from './auth.validation';
import { ROLE } from './auth.constant';
import Client from '../Client/client.model';
import ClientPreferences from '../ClientPreferences/clientPreferences.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Artist from '../Artist/artist.model';
import { TProfileFileFields } from '../../types';
import fs from 'fs';

const createAuth = async (payload: IAuth) => {
  const existingUser = await Auth.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(status.BAD_REQUEST, 'User already exists');
  }

  const otp = generateOtp();
  await sendOtpSms(payload.phoneNumber, otp);
  const token = jwt.sign({ ...payload, otp }, config.jwt_access_secret!, {
    expiresIn: '5m',
  });

  return { token, otp };
};

const signupOtpSendAgin = async (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;

  const authData = {
    email: decoded.email,
    phoneNumber: decoded.phoneNumber,
    password: decoded.password,
  };

  const otp = generateOtp();
  await sendOtpSms(decoded.phoneNumber, otp);
  const newToken = jwt.sign({ ...authData, otp }, config.jwt_access_secret!, {
    expiresIn: '5m',
  });

  return { token: newToken, otp };
};

const saveAuthIntoDB = async (token: string, otp: number) => {
  const decoded = jwt.verify(token, config.jwt_access_secret!) as JwtPayload;

  const existingUser = await Auth.findOne({ email: decoded.email });

  if (existingUser) {
    throw new AppError(status.BAD_REQUEST, 'User already exists');
  }

  if (decoded?.otp !== otp) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  const result = await Auth.create({
    fullName: decoded.fullName,
    phoneNumber: decoded.phoneNumber,
    email: decoded.email,
    password: decoded.password,
    isVerified: true,
  });

  if (!result) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to save user info'
    );
  }

  const accessToken = result.generateAccessToken();
  const refreshToken = result.generateRefreshToken();

  return { accessToken, refreshToken };
};

const signinIntoDB = async (payload: { email: string; password: string }) => {
  const user = await Auth.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Invalide credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const saveProfileIntoDB = async (
  payload: TProfilePayload,
  user: IAuth,
  files: TProfileFileFields
) => {
  // 🔐 Prevent creating multiple profiles for same user
  if (user.isProfile) {
    throw new AppError(
      status.BAD_REQUEST,
      'Profile already saved for this user'
    );
  }

  // 🔍 Destructure relevant fields from the payload
  const {
    role,
    favoriteTattoos,
    location,
    radius,
    lookingFor,
    notificationPreferences,
    artistType,
    city,
    expertise,
    studioName,
  } = payload;

  // 🧾 Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /**
     * ==========================
     * 📌 CLIENT PROFILE CREATION
     * ==========================
     */
    if (role === ROLE.CLIENT) {
      // Check if client profile already exists
      const isExistClient = await Client.findOne({ auth: user._id });

      if (isExistClient) {
        throw new AppError(
          status.BAD_REQUEST,
          'Client data already saved in database'
        );
      }

      // Step 1: Create client profile
      const clientPayload = {
        role,
        favoriteTattoos,
        location,
        radius,
        studioName,
        lookingFor,
        auth: user._id,
      };

      const [client] = await Client.create([clientPayload], { session });

      // Step 2: Update Auth model to reflect profile creation
      await Auth.findByIdAndUpdate(
        user._id,
        { role: ROLE.CLIENT, isProfile: true },
        { session }
      );

      // Step 4: Commit transaction and return the client
      await ClientPreferences.create(
        [
          {
            clientId: client._id,
            notificationPreferences,
          },
        ],
        { session }
      );

      // Step 4: Commit transaction and return the client
      await session.commitTransaction();
      session.endSession();

      return client;
    } else if (role === ROLE.ARTIST) {
      /**
       * ==========================
       * ✍️ ARTIST PROFILE CREATION
       * ==========================
       */
      // Check if artist profile already exists
      const isExistArtist = await Artist.findOne({ auth: user._id });

      if (isExistArtist) {
        throw new AppError(
          status.BAD_REQUEST,
          'Artist profile already exists.'
        );
      }

      // Extract file paths for ID verification images
      const idCardFront = files.idFrontPart?.[0]?.path || '';
      const idCardBack = files.idBackPart?.[0]?.path || '';
      const selfieWithId = files.selfieWithId?.[0]?.path || '';

      // Step 1: Create artist profile
      const artistPayload = {
        auth: user._id,
        type: artistType,
        expertise,
        location,
        city,
        idCardFront,
        idCardBack,
        selfieWithId,
      };

      const [artist] = await Artist.create([artistPayload], { session });

      // Step 2: Update Auth model to reflect artist status
      await Auth.findByIdAndUpdate(
        user._id,
        { role: ROLE.ARTIST, isProfile: true },
        { session }
      );

      // Step 3: Commit transaction and return the artist
      await session.commitTransaction();
      session.endSession();

      return artist;
    }
  } catch (error) {
    // ❌ Roll back transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    console.log(error);

    // 🧼 Cleanup: Delete uploaded files to avoid storage bloat
    if (files && typeof files === 'object' && !Array.isArray(files)) {
      Object.values(files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          try {
            if (file?.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          } catch (deleteErr) {
            console.warn(
              'Failed to delete uploaded file:',
              file.path,
              deleteErr
            );
          }
        });
      });
    }

    // 🧾 Re-throw application-specific errors
    if (error instanceof AppError) {
      throw error;
    }

    // 🧾 Throw generic internal server error
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create client profile. Please try again.'
    );
  }
};

export const AuthService = {
  createAuth,
  saveAuthIntoDB,
  signupOtpSendAgin,
  saveProfileIntoDB,
  signinIntoDB,
};
