/* eslint-disable no-unused-vars */
import { Document, Types } from 'mongoose';
import { TContact } from '../Artist/artist.constant';
import {
  TBusinessType,
  TOperatingDay,
  TServiceOffered,
} from './business.constants';

export interface IBusiness extends Document {
  auth: Types.ObjectId;

  // Core details
  studioName: string;
  businessType: TBusinessType;
  servicesOffered: TServiceOffered[];

  // Location & Contact
  location: { type: 'Point'; coordinates: [number, number] };
  city: string;
  contact: TContact;

  // Operating hours
  operatingHours: {
    [key in TOperatingDay]?: { start: string; end: string }[];
  };

  // Documents for verification
  registrationCertificate: string;
  taxIdOrEquivalent: string;
  studioLicense?: string;

  // Metadata
  profileViews: number;
  description?: string;

  // Status
  isVerified: boolean;
  isDeleted: boolean;
  isActive: boolean;

  // References
  preferences?: Types.ObjectId;
  guestSpots?: Types.ObjectId[];
  events?: Types.ObjectId[];
  residentArtists?: Types.ObjectId[];

  timeOff: Date[];
}
