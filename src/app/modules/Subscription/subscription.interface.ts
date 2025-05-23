import mongoose from 'mongoose';

export interface ISubscription {
  user: mongoose.Types.ObjectId;
  donation: mongoose.Types.ObjectId;
  subscriptionId: string;
  amount: number;
  status: 'active' | 'cancel' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}
