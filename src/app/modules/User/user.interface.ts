/* eslint-disable no-unused-vars */
import { HydratedDocument, Model } from 'mongoose';
import { z } from 'zod';
import { TRole } from './user.constant';
import { UserValidation } from './user.validation';
import { Document } from 'mongoose';

export interface IUser
  extends Omit<z.infer<typeof UserValidation.createSchema.shape.body>, 'role'>,
    Document {
  image?: string;
  refreshToken?: string | null;
  verificationCode?: string | null;
  verificationExpiry?: Date | null;
  isVerified: boolean;
  isActive: boolean;
  role: TRole;
  totalDonation: number;
}

export interface IUserMethods {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExists(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
