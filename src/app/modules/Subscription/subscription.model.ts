import mongoose, { Schema } from 'mongoose';
import { ISubscription } from './subscription.interface';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
    },
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancel', 'failed'],
      required: true,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema
);

export default Subscription;
