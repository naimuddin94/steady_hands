import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { ROLE } from '../Auth/auth.constant';
import { BookingController } from './booking.controller';
import { BookingValidation } from './booking.validation';

const router = Router();

router
  .route('/')
  .post(
    auth(ROLE.CLIENT),
    validateRequest(BookingValidation.bookingSchema),
    BookingController.saveBooking
  );

export const BookingRoutes = router;
