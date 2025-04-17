import mongoose, { Schema, model } from 'mongoose';
import { WEEK_DAYS } from '../Artist/artist.constant';

const availabilitySlotSchema = new Schema({
  start: { type: String, required: true }, // Format: 'HH:MM'
  end: { type: String, required: true }, // Format: 'HH:MM'
});

const slotSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    day: {
      type: String,
      enum: WEEK_DAYS,
      required: true,
    },
    slots: {
      type: [availabilitySlotSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Slot = model('Slot', slotSchema);

export default Slot;
