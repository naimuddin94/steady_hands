import { Document, Types } from 'mongoose';
import { TWeekDay } from '../Artist/artist.constant';
import { TBookingStatus } from './booking.constant';

export interface IBooking extends Document {
  artist: Types.ObjectId;
  user: Types.ObjectId;
  date: Date;
  day: TWeekDay;
  slot: Types.ObjectId;
  status: TBookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
