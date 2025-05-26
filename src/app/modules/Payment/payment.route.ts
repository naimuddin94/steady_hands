import { Router } from 'express';
import { auth } from '../../middlewares';
import { PaymentController } from './payment.controller';

const router = Router();

router.route('/').post(auth(), PaymentController.createSubscription);
router.route('/verify').post(auth(), PaymentController.handlePaymentSuccess);

export const PaymentRoutes = router;
