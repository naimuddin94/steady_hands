import mongoose from 'mongoose';

export const locationSchema = new mongoose.Schema(
  {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  },
  { versionKey: false, _id: false }
);
