import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateOtp } from '../../lib';
import sendOtpSms from '../../utils/sendOtpSms';
import { IAuth } from './auth.interface';
import config from '../../config';
import { AppError } from '../../utils';
import status from 'http-status';
import Auth from './auth.model';

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

export const AuthService = {
  createAuth,
  saveAuthIntoDB,
  signupOtpSendAgin,
};
