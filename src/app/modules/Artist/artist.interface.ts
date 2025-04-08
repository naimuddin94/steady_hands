import { Document, Types } from 'mongoose';
import {
  ExpertiseType,
  TArtistType,
  TContact,
  TServices,
} from './artist.contant';
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
  isVerfied: boolean;
  isDeleted: boolean;
  isActive: boolean;
  flashes: Types.ObjectId[];
  portfolio: Types.ObjectId[];
  preferences?: Types.ObjectId;
}
