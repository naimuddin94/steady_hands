/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { AppError, sendOtpEmail } from '../../utils';
import User from '../User/user.model';
import { generateOtp, verifyToken } from '../../lib';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { AuthValidation } from './auth.validation';
import { z } from 'zod';
import Ledger from '../Ledger/ledger.model';

// For forget password
const forgotPassword = async (email: string) => {
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  const otp = generateOtp();
  user.verificationCode = otp;
  user.verificationExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendOtpEmail(email, otp, `${user.firstName} ${user.lastName}`);
  return { email };
};

const verifyOtpForForgetPassword = async (email: string, otp: string) => {
  const user = await User.findOne({ email, isVerified: true });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  // Check if the OTP matches
  if (user.verificationCode !== otp || !user.verificationExpiry) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  // Check if OTP has expired
  if (Date.now() > user.verificationExpiry.getTime()) {
    throw new AppError(status.BAD_REQUEST, 'OTP has expired');
  }

  // Mark user as verified after successful OTP validation
  user.verificationCode = null;
  user.verificationExpiry = null;
  await user.save();

  const resetPasswordToken = jwt.sign(
    {
      email: user.email,
      isResetPassword: true,
    },
    config.jwt_access_secret!,
    {
      expiresIn: '5d',
    }
  );

  return { resetPasswordToken };
};

const resetPasswordIntoDB = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  const { email, isResetPassword } = (await verifyToken(
    resetPasswordToken
  )) as any;

  const user = await User.isUserExists(email);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  // Check if the OTP matches
  if (!isResetPassword) {
    throw new AppError(status.BAD_REQUEST, 'Invalid reset password token or ');
  }

  // Update the user's password
  user.password = newPassword;
  await user.save();

  return null;
};

const verifyOtpInDB = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  // Check if the OTP matches
  if (user.verificationCode !== otp || !user.verificationExpiry) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  // Check if OTP has expired
  if (Date.now() > user.verificationExpiry.getTime()) {
    throw new AppError(status.BAD_REQUEST, 'OTP has expired');
  }

  // Mark user as verified after successful OTP validation
  user.isVerified = true;
  user.verificationCode = null;
  user.verificationExpiry = null;
  await user.save();

  await Ledger.findOneAndUpdate({}, { $addToSet: { activeMembers: user._id } });

  return null;
};

const resendOtp = async (email: string) => {
  const user = await User.findOne({ email, isActive: true });

  if (user?.isVerified) {
    throw new AppError(status.BAD_REQUEST, 'Your account is already verified');
  }

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const otp = generateOtp();

  const result = await User.findOneAndUpdate(
    { email },
    {
      verificationCode: otp,
      verificationExpiry: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
    }
  );

  if (result) {
    sendOtpEmail(email, otp, `${result.firstName} ${result.lastName}`);
  }

  return {
    email,
  };
};

const refreshToken = async (refreshToken: string) => {
  const { id } = (await jwt.verify(
    refreshToken,
    config.jwt_refresh_secret as string
  )) as { id: string };

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  if (user?.refreshToken !== refreshToken) {
    throw new AppError(status.FORBIDDEN, 'Refresh token is not valid');
  }

  const accessToken = user.generateAccessToken();

  return { accessToken };
};

const changePasswordIntoDB = async (
  accessToken: string,
  payload: z.infer<typeof AuthValidation.passwordChangeSchema.shape.body>
) => {
  const { id } = await verifyToken(accessToken);

  const user = await User.findOne({ _id: id, isActive: true }).select(
    '+password'
  );

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const isCredentialsCorrect = await user.isPasswordCorrect(
    payload.oldPassword
  );

  if (!isCredentialsCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'New password is not correct');
  }

  user.password = payload.newPassword;
  await user.save();

  return null;
};

export const AuthService = {
  resetPasswordIntoDB,
  forgotPassword,
  verifyOtpInDB,
  resendOtp,
  refreshToken,
  changePasswordIntoDB,
  verifyOtpForForgetPassword,
};
