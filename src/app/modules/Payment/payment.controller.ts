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
  const projectId = req.body.projectId;
  const { message } = await PaymentService.verifyPaymentSuccess(
    req.user,
    req.query.session_id as string,
    projectId
  );

  res.status(status.OK).json(new AppResponse(status.OK, null, message));
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const subscriptionId = req.body.subscriptionId;

  const result = await PaymentService.cancelSubscriptionFromStripe(
    req.user,
    subscriptionId
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Subscription cancel successfully')
    );
});

export const PaymentController = {
  createSubscription,
  handlePaymentSuccess,
  cancelSubscription,
};
