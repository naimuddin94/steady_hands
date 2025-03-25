import express from 'express';
import { StripeController } from './stripe.controller';

const router = express.Router();

router.post('/webhook', StripeController.handleStripeWebhook);

export const StripeRoutes = router;
