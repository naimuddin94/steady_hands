import { Router } from 'express';
import {
  auth,
  validateRequest,
  validateRequestCookies,
} from '../../middlewares';
import { AuthValidation } from './auth.validation';
import { UserController } from '../User/user.controller';
import { AuthController } from './auth.controller';
import { UserValidation } from '../User/user.validation';
import { upload } from '../../lib';

const router = Router();

router
  .route('/signup')
  .post(
    upload.single('image'),
    validateRequest(UserValidation.createSchema),
    UserController.signup
  );

router
  .route('/signin')
  .post(validateRequest(AuthValidation.signinSchema), UserController.signin);

router.route('/signout').post(auth(), UserController.signout);

router
  .route('/verify-otp/:email')
  .post(validateRequest(AuthValidation.otpSchema), AuthController.verifyOtp);

// For forget password
router
  .route('/forget-password')
  .post(
    validateRequest(AuthValidation.forgetPasswordSchema),
    AuthController.forgetPassword
  );

router
  .route('/forget-password-verify/:email')
  .post(
    validateRequest(AuthValidation.otpSchema),
    AuthController.verifyOtpForForgetPassword
  );

router
  .route('/reset-password')
  .post(
    validateRequest(AuthValidation.resetPasswordSchema),
    AuthController.resetPassword
  );

router
  .route('/resend-otp')
  .post(
    validateRequest(AuthValidation.resendOtpSchema),
    AuthController.resendOtp
  );

router
  .route('/refresh-token')
  .post(
    validateRequestCookies(AuthValidation.refreshTokenSchema),
    AuthController.refreshToken
  );

router
  .route('/change-password')
  .patch(
    auth(),
    validateRequest(AuthValidation.passwordChangeSchema),
    AuthController.changePassword
  );

export const AuthRoutes = router;
