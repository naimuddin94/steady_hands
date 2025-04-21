import Business from './business.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose from 'mongoose';
import {
  TUpdateBusinessProfilePayload,
  TUpdateBusinessNotificationPayload,
  TUpdateBusinessSecuritySettingsPayload,
} from './business.validation';
import Auth from '../Auth/auth.model';
import BusinessPreferences from '../BusinessPreferences/businessPreferences.model';

// Update Business Profile
const updateBusinessProfile = async (
  user: IAuth,
  payload: TUpdateBusinessProfilePayload
) => {
  const business = await Business.findOne({ auth: user._id });

  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update Auth data with new business details
    await Auth.findByIdAndUpdate(user._id, payload, { session });

    // Update Business data with new business details
    const updatedBusiness = await Business.findOneAndUpdate(
      { auth: user._id },
      {
        studioName: payload.studioName,
        businessType: payload.businessType,
        country: payload.country,
      },
      { new: true, session }
    ).populate([
      {
        path: 'auth',
        select: 'fullName email phoneNumber',
      },
    ]);

    await session.commitTransaction();
    session.endSession();

    return updatedBusiness;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Something went wrong while updating business profile data'
    );
  }
};

// Update Business Preferences
const updateBusinessPreferences = async (
  user: IAuth,
  payload: TUpdateBusinessProfilePayload
) => {
  // Find the business using the auth user_id
  const business = await Business.findOne({ auth: user._id });
  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  // Find and update business preferences, or create new ones if not found
  const preferences = await BusinessPreferences.findOneAndUpdate(
    { businessId: business._id },
    payload,
    { new: true, upsert: true }
  );

  if (!preferences) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Error updating business preferences'
    );
  }

  return preferences;
};

// Update Business Notification Preferences
const updateBusinessNotificationPreferences = async (
  user: IAuth,
  payload: TUpdateBusinessNotificationPayload
) => {
  // Step 1: Find the business
  const business = await Business.findOne({ auth: user._id });
  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  // Step 2: Find and update the business's notification preferences
  const preferences = await BusinessPreferences.findOneAndUpdate(
    { businessId: business._id },
    payload,
    { new: true }
  );

  if (!preferences) {
    throw new AppError(
      status.NOT_FOUND,
      'Preferences not found for this business'
    );
  }

  // Return the updated preferences
  return preferences;
};

// Update Business Security Settings
const updateBusinessSecuritySettings = async (
  user: IAuth,
  payload: TUpdateBusinessSecuritySettingsPayload
) => {
  // Step 1: Find the business
  const business = await Business.findOne({ auth: user._id });
  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  // Step 2: Find and update the business's notification preferences
  const preferences = await BusinessPreferences.findOneAndUpdate(
    { businessId: business._id },
    payload,
    { new: true }
  );

  if (!preferences) {
    throw new AppError(
      status.NOT_FOUND,
      'Preferences not found for this business'
    );
  }

  // Return the updated preferences
  return preferences;
};

const updateGuestSpots = async (user: IAuth, data: any) => {
  // Find the business
  const business = await Business.findOne({ auth: user._id });
  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  // Update guest spots logic
  const guestSpots = data.guestSpots; // This would be the guest spots to be added/updated
  // Assuming guest spots are an array of available spots for a business
  // business.guestSpots.push(...guestSpots);
  await business.save();

  return business;
};

const updateTimeOff = async (user: IAuth, data: any) => {
  // Handle time-off for business (if needed)
  // Assuming time-off is stored as blocked dates for a business

  const business = await Business.findOne({ auth: user._id });
  if (!business) {
    throw new AppError(status.NOT_FOUND, 'Business not found');
  }

  // Add the time-off logic
  business.timeOff.push(data.date);
  await business.save();

  return business;
};

export const BusinessService = {
  updateBusinessProfile,
  updateBusinessPreferences,
  updateBusinessNotificationPreferences,
  updateBusinessSecuritySettings,
  updateGuestSpots,
  updateTimeOff,
};
