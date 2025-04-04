import { Document, Model } from 'mongoose';
import { TRole } from './auth.constant';

export interface IAuth extends Document {
  email: string;
  fullName?: string;
  phoneNumber: string;
  password: string;
  fcmToken: string | null;
  role: TRole;
  isSocialLogin: boolean;
  refreshToken?: string | null;
  verificationCode?: string | null;
  verificationExpiry?: Date | null;
  isVerified: boolean;
  isActive: boolean;
}

export interface IAuthMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAuthModel
  extends Model<IAuth, Record<string, never>, IAuthMethods> {}
