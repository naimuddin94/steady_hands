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
    {
      guestSpotRequests: payload.guestSpotRequests,
      guestSpotConfirmations: payload.guestSpotConfirmations,
      guestSpotCancellations: payload.guestSpotCancellations,
      newEventRegistrations: payload.newEventRegistrations,
      newMessageAlerts: payload.newMessageAlerts,
      paymentReceivedAlerts: payload.paymentReceivedAlerts,
      newAvailability: payload.newAvailability,
      lastMinuteBookings: payload.lastMinuteBookings,
      newGuestArtists: payload.newGuestArtists,
      notificationPreferences: payload.notificationPreferences,
    },
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
  const businessPreferences = await BusinessPreferences.findOne({
    businessId: user._id,
  });

  if (!businessPreferences) {
    throw new AppError(status.NOT_FOUND, 'Business preferences not found');
  }

  if (payload.twoFactorAuthEnabled !== undefined) {
    businessPreferences.twoFactorAuthEnabled = payload.twoFactorAuthEnabled;
  }
  if (payload.hideEarnings !== undefined) {
    businessPreferences.hideEarnings = payload.hideEarnings;
  }
  if (payload.manualDepositApproval !== undefined) {
    businessPreferences.manualDepositApproval = payload.manualDepositApproval;
  }
  if (payload.language !== undefined) {
    businessPreferences.language = payload.language;
  }
  if (payload.dateFormat !== undefined) {
    businessPreferences.dateFormat = payload.dateFormat;
  }

  await businessPreferences.save();

  return businessPreferences;
};

export const BusinessService = {
  updateBusinessProfile,
  updateBusinessPreferences,
  updateBusinessNotificationPreferences,
  updateBusinessSecuritySettings,
};
