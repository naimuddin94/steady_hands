import Booking from './booking.model';
import Slot from '../Slot/slot.model';
import { IAuth } from '../Auth/auth.interface';
import { AppError } from '../../utils';
import status from 'http-status';
import mongoose, { Types } from 'mongoose';
import { BOOKING_STATUS } from './booking.constant';
import { TBookingData } from './booking.validation';

// Create a new booking
const createBooking = async (user: IAuth, payload: TBookingData) => {
  const { slotId, date } = payload;
  // Check if the selected slot exists and is available
  const slot = await Slot.findOne({ 'slots._id': slotId });

  if (!slot) {
    throw new AppError(status.NOT_FOUND, 'Slot not available on this day');
  }

  const findSlot = slot.slots.find(
    (item) => (item._id as Types.ObjectId).toString() === slotId
  );

  console.log({ slot, findSlot, date, user });

  // // Check if the booking already exists for the same user and artist at this slot
  // const existingBooking = await Booking.findOne({
  //   artist: artistId,
  //   user: user._id,
  //   date,
  //   slot: slotId,
  // });
  // if (existingBooking) {
  //   throw new AppError(
  //     status.BAD_REQUEST,
  //     'You have already booked for this time slot'
  //   );
  // }

  // // Create the booking
  // const booking = new Booking({
  //   artist: artistId,
  //   user: user._id,
  //   date,
  //   day: slot.day,
  //   slot: slotId,
  //   status: BOOKING_STATUS.PENDING,
  // });

  // // Save the booking
  // await booking.save();
  // return booking;
};

// // Get all bookings for a user (client)
// const getUserBookings = async (user: IAuth) => {
//   const bookings = await Booking.find({ user: user._id })
//     .populate('artist', 'name')
//     .populate('slot', 'start end day')
//     .exec();

//   if (!bookings.length) {
//     throw new AppError(status.NOT_FOUND, 'No bookings found for this user');
//   }

//   return bookings;
// };

// // Get all bookings for an artist
// const getArtistBookings = async (artistId: string) => {
//   const bookings = await Booking.find({ artist: artistId })
//     .populate('user', 'fullName email')
//     .populate('slot', 'start end day')
//     .exec();

//   if (!bookings.length) {
//     throw new AppError(status.NOT_FOUND, 'No bookings found for this artist');
//   }

//   return bookings;
// };

// // Update booking status (e.g., accept, reject)
// const updateBookingStatus = async (bookingId: string, status: string) => {
//   const validStatuses = Object.values(BOOKING_STATUS);
//   if (!validStatuses.includes(status)) {
//     throw new AppError(status.BAD_REQUEST, 'Invalid booking status');
//   }

//   // Find and update the booking
//   const updatedBooking = await Booking.findByIdAndUpdate(
//     bookingId,
//     { status },
//     { new: true }
//   ).populate('artist', 'name')
//     .populate('user', 'fullName')
//     .populate('slot', 'start end day')
//     .exec();

//   if (!updatedBooking) {
//     throw new AppError(status.NOT_FOUND, 'Booking not found');
//   }

//   return updatedBooking;
// };

// // Cancel a booking
// const cancelBooking = async (bookingId: string) => {
//   const cancelledBooking = await Booking.findByIdAndUpdate(
//     bookingId,
//     { status: BOOKING_STATUS.CANCELLED },
//     { new: true }
//   ).populate('artist', 'name')
//     .populate('user', 'fullName')
//     .populate('slot', 'start end day')
//     .exec();

//   if (!cancelledBooking) {
//     throw new AppError(status.NOT_FOUND, 'Booking not found');
//   }

//   return cancelledBooking;
// };

// // Check availability for a given date and time slot
// const checkAvailability = async (day: string, start: string, end: string) => {
//   const existingBookings = await Booking.find({
//     day,
//     'slot.start': { $lt: end },
//     'slot.end': { $gt: start },
//   });

//   if (existingBookings.length > 0) {
//     return false; // Slot is not available
//   }

//   return true; // Slot is available
// };

export const BookingService = {
  createBooking,
  // getUserBookings,
  // getArtistBookings,
  // updateBookingStatus,
  // cancelBooking,
  // checkAvailability,
};
