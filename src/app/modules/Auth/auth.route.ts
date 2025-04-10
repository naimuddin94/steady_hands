import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { upload } from '../../lib';
import { validateRequestFromFormData } from '../../middlewares/validateRequest';

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

router.route('/create-profile').post(
  upload.fields([
    { name: 'idFrontPart', maxCount: 1 },
    { name: 'idBackPart', maxCount: 1 },
    { name: 'selfieWithId', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'taxIdOrEquivalent', maxCount: 1 },
    { name: 'studioLicense', maxCount: 1 },
  ]),
  auth(),
  validateRequestFromFormData(AuthValidation.profileSchema),
  AuthController.createProfile
);

router
  .route('/social-signin')
  .post(
    validateRequest(AuthValidation.socialSchema),
    AuthController.socialSignin
  );

export const AuthRoutes = router;
