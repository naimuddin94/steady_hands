import mongoose, { Schema, model } from 'mongoose';
import { IClient } from './client.interface';
import {
  serviceTypes,
  favoriteTattoos,
  favoritePiercings,
  homeViews,
  artistTypes,
  dateFormats,
} from './client.constant';
// import { locationSchema } from '../Location/location.model';

const clientSchema = new Schema<IClient>(
  {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    radius: {
      type: Number,
      required: false,
    },

    lookingFor: {
      type: [String],
      enum: Object.values(serviceTypes),
      required: false,
    },

    country: {
      type: String,
      required: false,
    },

    favoriteTattoos: {
      type: [String],
      enum: Object.values(favoriteTattoos),
      required: false,
    },

    favoritePiercing: {
      type: [String],
      enum: Object.values(favoritePiercings),
      required: false,
    },

    homeView: {
      type: String,
      enum: Object.values(homeViews),
      required: false,
    },

    preferredArtistType: {
      type: String,
      enum: Object.values(artistTypes),
      required: false,
    },

    language: {
      type: String,
      required: false,
    },

    dateFormat: {
      type: String,
      enum: Object.values(dateFormats),
      required: false,
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

clientSchema.index({ location: '2dsphere' });

const Client = model<IClient>('Client', clientSchema);

export default Client;
