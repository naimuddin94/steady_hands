import { Router } from 'express';
import { auth } from '../../middlewares';
import { FolderValidation } from './folder.validation';
import { FolderController } from './folder.controller';
import { upload } from '../../lib';
import { validateRequestFromFormData } from '../../middlewares/validateRequest';

const router = Router();

router
  .route('/')
  .post(
    auth(),
    upload.array('files'),
    validateRequestFromFormData(FolderValidation.folderValidationSchema),
    FolderController.saveFolder
  );

export const FolderRoutes = router;
