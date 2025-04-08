import mongoose, { Schema, model } from 'mongoose';
import { IArtist } from './artist.interface';
import { expertiseTypes, ARTIST_TYPE } from './artist.contant';
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
    hourly_rate: { type: Number, default: 0 },
    day_rate: { type: Number, default: 0 },
    consultations_fee: { type: Number, default: 0 },
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

    image: { type: String },

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

    isVerfied: {
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
  },
  {
    timestamps: true,
    versionKey: false, 
  }
);

const Artist = model<IArtist>('Artist', artistSchema);

export default Artist;
