import { AppResponse } from '../../utils';
import status from 'http-status';
import { asyncHandler } from '../../utils';
import { PaymentService } from './payment.service';

const createSubscription = asyncHandler(async (req, res) => {
  const result = await PaymentService.createSubscriptionIntoDB(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Payment url send successfully'));
});

const handlePaymentSuccess = asyncHandler(async (req, res) => {
  const { message } = await PaymentService.verifyPaymentSuccess(
    req.user,
    req.query.session_id as string
  );

  res.status(status.OK).json(new AppResponse(status.OK, null, message));
});

export const PaymentController = {
  createSubscription,
  handlePaymentSuccess,
};
