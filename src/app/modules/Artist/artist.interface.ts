import { Document } from 'mongoose';
import { TArtistType } from '../Auth/auth.constant';

export interface IArtist extends Document {
  type: TArtistType;
}
