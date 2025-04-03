import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = Router();

router
  .route('/signup')
  .post(
    validateRequest(AuthValidation.createSchema),
    AuthController.createAuth
  );

export const AuthRoutes = router;
