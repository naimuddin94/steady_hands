import { Types } from 'mongoose';
import { TWeekDay } from '../Artist/artist.constant';

export interface IAvailabilitySlot {
  start: string; // Format: 'HH:MM'
  end: string; // Format: 'HH:MM'
}

export interface IArtistAvailability {
  _id?: Types.ObjectId;
  artist: Types.ObjectId;
  day: TWeekDay;
  slots: IAvailabilitySlot[];
  createdAt?: Date;
  updatedAt?: Date;
}
