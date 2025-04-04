import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = Router();

router
  .route('/')
  .post(
    validateRequest(AuthValidation.createSchema),
    AuthController.createAuth
  );

router.route('/verify-signup-otp').post(AuthController.saveAuthData);

router.route('/verify-signup-otp-again').post(AuthController.signupOtpSendAgin);

export const AuthRoutes = router;
