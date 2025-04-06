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

const saveProfileIntoDB = async (payload: TProfilePayload, user: IAuth) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (payload.role === ROLE.CLIENT) {
      // Manually generate _id for the client so it can be used in both documents
      const clientId = new mongoose.Types.ObjectId();
      const preferencesId = new mongoose.Types.ObjectId();

      // Step 1: Create Client
      const clientPayload = {
        ...payload,
        _id: clientId,
        auth: user._id,
        preferences: preferencesId,
      };

      const [client] = await Client.create([clientPayload], { session });

      // Step 2: Create Preferences
      const [preferences] = await ClientPreferences.create(
        [
          {
            _id: preferencesId,
            clientId: clientId,
            notificationPreferences: payload.notificationPreferences,
          },
        ],
        { session }
      );

      // Step 3: Commit transaction
      await session.commitTransaction();
      session.endSession();

      return client;
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error saving client profile:', error);
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
