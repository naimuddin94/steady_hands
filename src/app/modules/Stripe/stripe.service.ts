import { Request } from 'express';
import stripe from '../Payment/payment.service';
import config from '../../config';
import Donation from '../Donation/donation.model';
import User from '../User/user.model';
import mongoose from 'mongoose';
import Subscription from '../Subscription/subscription.model';
import Ledger from '../Ledger/ledger.model';

const donationFromSubsciber = async (req: Request) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.stripe.webhook_secret as string
    );
  } catch {
    console.error('Webhook signature verification failed.');
    return;
  }

  if (event?.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object; // Get invoice details
    const amountPaid = invoice.amount_paid / 100; // Convert cents to dollars
    const invoiceId = invoice.id;
    const paymentIntent = invoice.payment_intent;
    const subscriptionId = invoice.subscription; // Subscription ID

    if (!subscriptionId) {
      console.log('ℹ️ This is a one-time payment. Skipping...');
      return;
    }

    const isDonationExists = await Donation.findOne({ invoiceId });

    if (isDonationExists) return;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const subscription = await Subscription.findOne({ subscriptionId });

      if (!subscription) return;

      const user = await User.findByIdAndUpdate(
        subscription.user,
        { $inc: { totalDonation: amountPaid } },
        { session }
      );

      if (!user) {
        return;
      }

      // ✅ Create a new donation record in MongoDB
      const newDonation = new Donation({
        user: user._id,
        amount: amountPaid,
        paymentIntent: paymentIntent || null,
        invoiceId: invoiceId,
        status: 'paid',
        isMonthly: true,
      });

      await newDonation.save({ session });

      await Ledger.findOneAndUpdate(
        {},
        { $inc: { availableBalance: amountPaid } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();
    } catch {
      await session.abortTransaction();
      session.endSession();
    }
  }
};

export const StripeService = { donationFromSubsciber };
