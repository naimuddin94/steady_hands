import mongoose, { Schema, model } from 'mongoose';
import { IArtist } from './artist.interface';
import { expertiseTypes, ARTIST_TYPE } from './artist.constant';
import { locationSchema } from '../Location/location.model';

// 🔹 Subschema: Contact
const contactSchema = new Schema(
  {
    email: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { _id: false }
);

// 🔹 Subschema: Services
const servicesSchema = new Schema(
  {
    hourlyRate: { type: Number, default: 0 },
    dayRate: { type: Number, default: 0 },
    consultationsFee: { type: Number, default: 0 },
  },
  { _id: false }
);

// 🔹 Main Artist Schema
const artistSchema = new Schema<IArtist>(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(ARTIST_TYPE),
      required: true,
    },

    expertise: {
      type: [String],
      enum: Object.values(expertiseTypes),
      required: true,
    },

    location: {
      type: locationSchema,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    idCardFront: {
      type: String,
      required: true,
    },

    idCardBack: {
      type: String,
      required: true,
    },

    selfieWithId: {
      type: String,
      required: true,
    },

    profileViews: {
      type: Number,
      default: 0,
    },

    services: {
      type: servicesSchema,
      required: false,
    },

    contact: {
      type: contactSchema,
      required: false,
    },

    description: {
      type: String,
      required: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    flashes: [
      {
        type: String,
        required: true,
      },
    ],
    portfolio: [
      {
        type: String,
        required: true,
      },
    ],
    preferences: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtistPreferences',
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Artist = model<IArtist>('Artist', artistSchema);

export default Artist;
