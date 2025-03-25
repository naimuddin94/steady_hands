/* eslint-disable no-undef */
import status from 'http-status';
import { generateOtp, verifyToken } from '../../lib';
import { AppError, deleteFile, sendOtpEmail } from '../../utils';
import { ILoginPayload, IUser } from './user.interface';
import User from './user.model';

const saveUserIntoDB = async (
  payload: IUser,
  file: Express.Multer.File | undefined
) => {
  const isUserExists = await User.findOne({ email: payload.email });

  if (isUserExists && !isUserExists?.isVerified) {
    throw new AppError(status.BAD_REQUEST, 'Please verify your email');
  }

  if (isUserExists) {
    throw new AppError(status.BAD_REQUEST, 'Email already taken');
  }

  const otp = generateOtp();

  if (file) {
    payload.image = file.path;
  }

  const result = await User.create({
    ...payload,
    verificationCode: otp,
    verificationExpiry: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
  });

  if (result) {
    sendOtpEmail(
      payload.email,
      otp,
      `${payload.firstName} ${payload.lastName}`
    );
  }

  return {
    email: result.email,
  };
};

const updateUserIntoDB = async (
  accessToken: string,
  payload: IUser,
  file: Express.Multer.File | undefined
) => {
  const { id } = await verifyToken(accessToken);

  const user = await User.findOne({ _id: id, isActive: true });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  if (file) {
    if (user.image) {
      deleteFile(user.image);
    }
    payload.image = file.path;
  }

  return await User.findByIdAndUpdate(id, payload, { new: true });
};

const getProfieFromDB = async (accessToken: string) => {
  if (!accessToken) {
    throw new AppError(status.UNAUTHORIZED, 'Access token is required');
  }

  const { id } = await verifyToken(accessToken);

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User does not exist!');
  }

  return user;
};

const signinUserIntoDB = async (credentials: ILoginPayload) => {
  const user = await User.isUserExists(credentials.email);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const isCredentialsCorrect = await user.isPasswordCorrect(
    credentials.password
  );

  if (!isCredentialsCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const userData = await User.findByIdAndUpdate(user._id, {
    refreshToken,
  }).select('name email totalDonation role image firstName lastName');

  if (!userData) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Internal Server Error to set refresh token'
    );
  }

  return {
    ...userData.toObject(),
    accessToken,
    refreshToken,
  };
};

const signoutUserFromDB = async (accessToken: string) => {
  // checking if the token is missing
  if (accessToken) {
    const { id } = await verifyToken(accessToken);

    const user = await User.findById(id);

    if (!user) {
      throw new AppError(status.NOT_FOUND, 'User does not exist!');
    }

    user.refreshToken = null;
    await user.save();
  }

  return null;
};

export const UserService = {
  saveUserIntoDB,
  signinUserIntoDB,
  signoutUserFromDB,
  getProfieFromDB,
  updateUserIntoDB,
};
