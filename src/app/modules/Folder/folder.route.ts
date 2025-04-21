import { Router } from 'express';
import { auth } from '../../middlewares';
import { FolderValidation } from './folder.validation';
import { FolderController } from './folder.controller';
import { upload } from '../../lib';
import { validateRequestFromFormData } from '../../middlewares/validateRequest';
import { ROLE } from '../Auth/auth.constant';

const router = Router();

router
  .route('/')
  .post(
    auth(),
    upload.array('files'),
    validateRequestFromFormData(FolderValidation.folderValidationSchema),
    FolderController.saveFolder
  );

router
  .route('/:folderId')
  .delete(
    auth(ROLE.ARTIST, ROLE.ADMIN, ROLE.SUPER_ADMIN),
    FolderController.removeFolder
  );

export const FolderRoutes = router;
