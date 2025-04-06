import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = Router();

router
  .route('/signup')
  .post(
    validateRequest(AuthValidation.createSchema),
    AuthController.createAuth
  );

router
  .route('/signin')
  .post(validateRequest(AuthValidation.signinSchema), AuthController.signin);

router.route('/verify-signup-otp').post(AuthController.saveAuthData);

router.route('/verify-signup-otp-again').post(AuthController.signupOtpSendAgin);

router
  .route('/create-profile')
  .post(
    auth(),
    validateRequest(AuthValidation.profileSchema),
    AuthController.createProfile
  );

export const AuthRoutes = router;
