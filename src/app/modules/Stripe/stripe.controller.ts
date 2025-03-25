import { Request, Response } from 'express';
import { asyncHandler } from '../../utils';
import { StripeService } from './stripe.service';

const handleStripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    await StripeService.donationFromSubsciber(req);
    res.status(200).json({ received: true });
  }
);

export const StripeController = {
  handleStripeWebhook,
};
