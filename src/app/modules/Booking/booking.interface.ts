import { Document, Types } from 'mongoose';
import { TWeekDay } from '../Artist/artist.constant';
import { TBookingStatus } from './booking.constant';

export interface IBooking extends Document {
  artist: Types.ObjectId;
  user: Types.ObjectId;
  service: string;
  serviceType: string;
  bodyLocation: string;
  description: string;
  referralImage?: string;
  date: Date;
  day: TWeekDay;
  paymentIntentId?: string;
  transactionId?: string;
  slot: Types.ObjectId;
  slotTimeId: Types.ObjectId;
  status: TBookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
