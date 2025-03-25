import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import config from '../../config';
import { USER_ROLE } from './user.constant';
import { IUser, IUserMethods, IUserModel } from './user.interface';

// Define the schema for the user model
const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: 0,
    },
    image: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: 'USER',
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalDonation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Custom hooks/methods

// Modified password fields before save to database
userSchema.pre('save', async function (next) {
  try {
    // Check if the password is modified or this is a new user
    if (this.password && (this.isModified('password') || this.isNew)) {
      const hashPassword = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
      );
      this.password = hashPassword;
    }
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
});

// Check that the user exists to database
userSchema.statics.isUserExists = async function (email: string) {
  const result = await User.findOne({
    email,
    isActive: true,
    isVerified: true,
  }).select('+password');
  return result;
};

// For check the password is correct
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// For generating access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    config.jwt_access_secret!,
    {
      expiresIn: config.jwt_access_expires_in,
    }
  );
};

// For generating refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt_refresh_secret!,
    {
      expiresIn: config.jwt_refresh_expires_in,
    }
  );
};

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
