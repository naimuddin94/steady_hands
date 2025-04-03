import { Document } from 'mongoose';
import { TRole } from './auth.constant';

export interface IAuth extends Document {
  email: string;
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
