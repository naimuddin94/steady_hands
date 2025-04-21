import { Document, Types } from 'mongoose';
import {
  ExpertiseType,
  TArtistType,
  TContact,
  TServices,
} from './artist.constant';
import { locationSchema } from '../Location/location.model';

export interface IArtist extends Document {
  auth: Types.ObjectId;
  type: TArtistType;
  expertise: ExpertiseType[];
  image?: string;
  location: typeof locationSchema;
  city: string;
  idCardFront: string;
  idCardBack: string;
  selfieWithId: string;
  profileViews: number;
  services?: TServices;
  contact?: TContact;
  description: string;
  isVerified: boolean;
  isDeleted: boolean;
  isActive: boolean;
  flashes: Types.ObjectId[];
  portfolio: Types.ObjectId[];
  preferences?: Types.ObjectId;
  timeOff: Date[],
}
