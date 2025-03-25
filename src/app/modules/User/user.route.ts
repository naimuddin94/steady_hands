import { Router } from 'express';
import { UserController } from './user.controller';
import { auth, validateRequest } from '../../middlewares';
import { UserValidation } from './user.validation';
import { upload } from '../../lib';

const router = Router();

router
  .route('/profile')
  .get(auth(), UserController.profileData)
  .patch(
    auth(),
    upload.single('image'),
    validateRequest(UserValidation.updateSchema),
    UserController.updateProfie
  );

export const UserRoutes = router;
