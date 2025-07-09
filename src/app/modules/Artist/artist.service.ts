/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Artist from './artist.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose, { ObjectId } from 'mongoose';
import {
  TUpdateArtistNotificationPayload,
  TUpdateArtistPayload,
  TUpdateArtistPreferencesPayload,
  TUpdateArtistPrivacySecurityPayload,
  TUpdateArtistProfilePayload,
} from './artist.validation';
import ArtistPreferences from '../ArtistPreferences/artistPreferences.model';
import fs from 'fs';
import { TAvailability } from '../../schema/slotValidation';
import Slot from '../Slot/slot.model';
import {
  hasOverlap,
  removeDuplicateSlots,
  splitIntoHourlySlots,
  toMinutes,
} from '../Slot/slot.utils';
import QueryBuilder from '../../builders/QueryBuilder';
import Booking from '../Booking/booking.model';
import moment from 'moment';

const updateProfile = async (
  user: IAuth,
  payload: TUpdateArtistProfilePayload
) => {
  const artist = await Artist.findOne({ auth: user._id });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Artist.findByIdAndUpdate(user._id, payload, { session });

    const updatedArtist = await Artist.findOne({ auth: user._id }).populate(
      'auth'
    );

    await session.commitTransaction();
    session.endSession();
    return updatedArtist;
  } catch {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update artist profile'
    );
  }
};

const updatePreferences = async (
  user: IAuth,
  payload: TUpdateArtistPreferencesPayload
) => {
  const artist = await Artist.findOne({
    auth: user._id,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const artistPreferences = await ArtistPreferences.findOne({
    artistId: artist._id,
  });

  if (!artistPreferences) {
    throw new AppError(status.NOT_FOUND, 'Artist preferences not found');
  }

  Object.assign(artistPreferences, payload);
  await artistPreferences.save();

  return artistPreferences;
};

const updateNotificationPreferences = async (
  user: IAuth,
  payload: TUpdateArtistNotificationPayload
) => {
  const artist = await Artist.findOne({
    auth: user._id,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const artistPreferences = await ArtistPreferences.findOne({
    artistId: artist._id,
  });

  if (!artistPreferences) {
    throw new AppError(status.NOT_FOUND, 'Artist preferences not found');
  }

  Object.assign(artistPreferences, payload);
  await artistPreferences.save();

  return artistPreferences;
};

const updatePrivacySecuritySettings = async (
  user: IAuth,
  payload: TUpdateArtistPrivacySecurityPayload
) => {
  const artist = await Artist.findOne({
    auth: user._id,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  const artistPreferences = await ArtistPreferences.findOne({
    artistId: artist._id,
  });

  if (!artistPreferences) {
    throw new AppError(status.NOT_FOUND, 'Artist preferences not found');
  }

  Object.assign(artistPreferences, payload);
  await artistPreferences.save();

  return artistPreferences;
};

const addFlashesIntoDB = async (
  user: IAuth,
  files: Express.Multer.File[] | undefined
) => {
  const artist = await Artist.findOne({
    auth: user._id,
    isActive: true,
    isDeleted: false,
    isVerified: true,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  if (!files || !files?.length) {
    throw new AppError(status.BAD_REQUEST, 'Files are required');
  }

  return await Artist.findByIdAndUpdate(
    artist._id,
    {
      $push: {
        flashes: { $each: files.map((file) => file.path) },
      },
    },
    { new: true }
  );
};

const addPortfolioImages = async (
  user: IAuth,
  files: Express.Multer.File[] | undefined
) => {
  const artist = await Artist.findOne({
    auth: user._id,
    isDeleted: false,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  if (!artist.isVerified) {
    throw new AppError(status.BAD_REQUEST, 'Artist not verified');
  }

  if (!artist.isActive) {
    throw new AppError(status.BAD_REQUEST, 'Artist not activated by admin yet');
  }

  if (!files || !files?.length) {
    throw new AppError(status.BAD_REQUEST, 'Files are required');
  }

  return await Artist.findByIdAndUpdate(
    artist._id,
    {
      $push: {
        portfolio: { $each: files.map((file) => file.path) },
      },
    },
    { new: true }
  );
};

const removeImage = async (user: IAuth, filePath: string) => {
  const artist = await Artist.findOne({
    auth: user._id,
    isActive: true,
    isDeleted: false,
    isVerified: true,
  });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  // Remove the image file path from the 'flashes' array
  const updatedArtist = await Artist.findByIdAndUpdate(
    artist._id,
    {
      $pull: {
        flashes: filePath,
        portfolio: filePath,
      },
    },
    { new: true }
  );

  if (!updatedArtist) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to remove flash image'
    );
  }

  // Check if the file exists and delete it
  fs.unlink(filePath, () => {});

  return updatedArtist;
};

const updateArtistPersonalInfoIntoDB = async (
  user: IAuth,
  payload: TUpdateArtistPayload
) => {
  const artist = await Artist.findOne({ auth: user._id });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  await ArtistPreferences.findOneAndUpdate({ artistId: artist._id }, payload, {
    new: true,
  });

  return await Artist.findOneAndUpdate({ auth: user._id }, payload, {
    new: true,
  }).populate('preferences');
};

const saveAvailabilityIntoDB = async (user: IAuth, payload: TAvailability) => {
  const { day, slots } = payload;

  // Step 1: Normalize into 1-hour blocks
  const hourlySlots = slots.flatMap((slot) =>
    splitIntoHourlySlots(slot.start, slot.end)
  );

  // Step 2: Deduplicate within request
  const uniqueSlots = removeDuplicateSlots(hourlySlots);

  // Step 3: Fetch existing slots for that day
  const existing = await Slot.findOne({ auth: user._id, day });

  if (existing) {
    const existingSlots = existing.slots;

    // Step 4: Check overlap
    if (hasOverlap(existingSlots, uniqueSlots)) {
      throw new AppError(
        status.BAD_REQUEST,
        'New slots overlap with existing slots'
      );
    }

    // Step 5: Merge, dedupe, and sort
    const merged = removeDuplicateSlots([
      ...existingSlots,
      ...uniqueSlots,
    ]).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    // Step 6: Save
    existing.set('slots', merged);
    await existing.save();
    return existing;
  } else {
    // First time adding slots
    return await Slot.create({
      auth: user._id,
      day,
      slots: uniqueSlots,
    });
  }
};

const fetchAllArtistsFromDB = async (query: Record<string, unknown>) => {
  const artistsQuery = new QueryBuilder(
    Artist.find({
      isActive: true,
      isDeleted: false,
      isVerified: true,
    }).populate([
      {
        path: 'auth',
        select: 'fullName image phoneNumber',
      },
      {
        path: 'portfolio.folder',
        select: 'name images createdAt',
      },
    ]),
    query
  )
    .search([])
    .fields()
    .filter()
    .paginate()
    .sort();

  const data = await artistsQuery.modelQuery;
  const meta = await artistsQuery.countTotal();

  return { data, meta };
};

// For availability
const updateAvailability = async (user: IAuth, data: any) => {
  // Find the artist
  const artist = await Artist.findOne({ auth: user._id });
  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  // Update availability slots
  const slots = data.slots; // This would be an array of time slots
  // Assuming you store the time slots in the artist schema or in a related collection
  await Slot.updateMany(
    { auth: artist.auth },
    { $set: { slots } } // Update the slots for the artist
  );

  return artist;
};

const updateTimeOff = async (user: IAuth, payload: { dates: string[] }) => {
  // Handle time-off (if needed, set blocked dates, etc.)
  // Assuming time off is stored as an array of dates that are blocked

  const artist = await Artist.findOne({ auth: user._id });

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  // Convert the string dates in the payload to Date objects
  const newDates = payload.dates.map((date) => new Date(date));

  // Validate the payload dates to ensure they are in the future
  newDates.forEach((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

    if (today > date) {
      throw new AppError(
        status.BAD_REQUEST,
        'Selected date cannot be in the past. Please choose a future date.'
      );
    }
  });

  // Get the current date and set the time to midnight to ignore the time part
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to midnight for correct comparison
  const currentDateString = currentDate.toISOString(); // Convert to ISO string for accurate comparison

  // Remove past dates from timeOff
  await Artist.updateOne(
    { _id: artist._id },
    {
      $pull: {
        timeOff: { $lt: currentDateString }, // Remove past dates from timeOff
      },
    }
  );

  // Add the time-off dates
  const result = await Artist.updateOne(
    { _id: artist._id },
    {
      $addToSet: {
        timeOff: { $each: newDates.map((date) => date.toISOString()) }, // Add new dates without duplicates
      },
    }
  );

  if (result.modifiedCount === 0) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update time off'
    );
  }

  const updatedArtist = await Artist.findById(artist._id);
  return updatedArtist;
};

const getAvailabilityExcludingTimeOff = async (
  artistId: string,
  month: number,
  year: number
) => {
  const artist = await Artist.findById(artistId);

  if (!artist) {
    throw new AppError(status.NOT_FOUND, 'Artist not found');
  }

  // Fetch the available slots for the artist
  const availableSlots = await Slot.find({ auth: artist.auth }).select(
    'day slots'
  );

  // Fetch the artist's time off (days when they are not available)
  const offDay = artist.timeOff.map((off) => moment(off).format('YYYY-MM-DD'));

  // Get the total days for the given month and year

  const totalDays = new Date(
    new Date().getFullYear(),
    month, // this is dynamic data from frontend
    0
  ).getDate();

  // Fetch booking data for the artist for upcoming dates
  const bookingData = await Booking.find({
    artist: artist._id,
    date: { $gt: new Date() },
    status: { $ne: 'cancelled' },
  }).populate('slot');

  // Generate the calendar data by iterating through each day of the month
  const calendarData = [];

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD'); // The current date in the loop
    const dayName = currentDate.format('dddd'); // Name of the day (e.g., Monday, Tuesday)

    // Check if this day is a time off day for the artist
    const isOffDay = offDay.includes(currentDate.format('YYYY-MM-DD'));

    // Get the available slots for this day
    const availableSlotsForDay =
      availableSlots.find((slot) => slot.day === dayName)?.slots || [];

    // Exclude booked slots for this day
    const availableTimeSlots = availableSlotsForDay.filter((slot) => {
      return !bookingData.some((booking) => {
        // Check if the booking is on the same day and if the slot time matches
        return (
          moment(booking.date).isSame(currentDate, 'day') &&
          booking.slotTimeId.toString() === (slot._id as ObjectId).toString()
        );
      });
    });

    // Add the data for this day to the calendar data
    calendarData.push({
      date: currentDate.format('YYYY-MM-DD'),
      dayName,
      availableSlots: isOffDay ? [] : availableTimeSlots, // If it's an off day, no available slots
      isUnavailable: isOffDay || availableTimeSlots.length === 0, // If it's an off day or no available slots, mark it as unavailable
    });
  }

  // Return the calendar data
  return { calendarData };
};

export const ArtistService = {
  updateProfile,
  updatePreferences,
  updateNotificationPreferences,
  updatePrivacySecuritySettings,
  addFlashesIntoDB,
  addPortfolioImages,
  removeImage,
  updateArtistPersonalInfoIntoDB,
  saveAvailabilityIntoDB,
  fetchAllArtistsFromDB,
  updateAvailability,
  updateTimeOff,
  getAvailabilityExcludingTimeOff,
};
