import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import Booking from './booking.model';
import { BookingService } from './booking.service';

const saveBooking = asyncHandler(async (req, res) => {
  const result = await BookingService.createBooking(req.user, req.body);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'Booked successfully'));
});

export const BookingController = {
  saveBooking,
};
