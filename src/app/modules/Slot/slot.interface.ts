import { Types, Document } from 'mongoose';
import { TWeekDay } from '../Artist/artist.constant';

export interface IAvailabilitySlot extends Document {
  start: string; // Format: 'HH:MM'
  end: string; // Format: 'HH:MM'
}

export interface ISlot extends Document {
  auth: Types.ObjectId;
  artist: Types.ObjectId;
  day: TWeekDay;
  slots: IAvailabilitySlot[];
  createdAt?: Date;
  updatedAt?: Date;
}
